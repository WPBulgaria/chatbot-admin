import { useEffect, useRef, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { humanReadableTime } from '../utils/time';
import { makeFilesApi } from '../api/files-api';
import type { KnowledgeBaseFile } from '../types/knowledge-base';
import { useRouter } from '@tanstack/react-router';
import {Input} from '@headlessui/react';

export const KnowledgeBase: React.FC<{ files: KnowledgeBaseFile[] }> = ({ files = [] }) => {
  const [tableFiles, setTableFiles] = useState<KnowledgeBaseFile[]>(files);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadErrors, setUploadErrors] = useState<{ file?: string; general?: string }>({});
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [fileToRemove, setFileToRemove] = useState<KnowledgeBaseFile | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    if (files.length === 0) {
      return;
    }
    setTableFiles(files);
  }, [files]);

  const handleOpenUploadModal = () => {
    setUploadErrors({});
    setUploadFile(null);
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setUploadErrors({});
    setUploadLoading(false);
  };

  const handleBrowseFileChange = (file: File | null) => {
    setUploadFile(file);
    setUploadErrors({});
  };

  const handleOpenRemoveDialog = (file: KnowledgeBaseFile) => {
    setFileToRemove(file);
    setIsRemoveDialogOpen(true);
  };

  const handleCloseRemoveDialog = () => {
    setIsRemoveDialogOpen(false);
    setFileToRemove(null);
  };

  const handleRemoveConfirm = async () => {
    if (!fileToRemove) {
      return;
    }

    setRemoveLoading(true);
    try {
      const response = await makeFilesApi().remove(fileToRemove.id);
      if (!response.success) {
        setToastType('error');
        setToastMessage(response.message?.toString() || 'An error occurred while removing the file');
        setShowToast(true);
        return;
      }
      router.invalidate();
      setTableFiles((prev) => prev.filter((f) => f.id !== fileToRemove.id));
      setToastType('success');
      setToastMessage('File removed successfully');
      setShowToast(true);
    } catch {
      setToastType('error');
      setToastMessage('An error occurred while removing the file');
      setShowToast(true);
    } finally {
      setRemoveLoading(false);
      handleCloseRemoveDialog();
    }
  };

  const handleUploadSubmit = async () => {
    const nextErrors: { file?: string; general?: string } = {};
    if (!uploadFile) {
      nextErrors.file = 'Please choose a file';
    }

    if (nextErrors.file) {
      setUploadErrors(nextErrors);
      return;
    }

    setUploadLoading(true);
    try {
      const file = uploadFile!;


      const response = await makeFilesApi().upload(file);

      if (!response.success) {
        setUploadErrors({ general: response.message?.toString() || 'An error occurred while uploading the file' });
        setToastType('error');
        setToastMessage(response.message?.toString() || 'An error occurred while uploading the file');
        setShowToast(true);
        return;
      }


      setTableFiles((prev) => [response.file!, ...prev]);
      router.invalidate();

      setToastType('success');
      setToastMessage('File uploaded successfully');
      setShowToast(true);
      setIsUploadModalOpen(false);
      setUploadErrors({});
      setUploadFile(null);
    } catch {
      setUploadErrors({ general: 'An error occurred while uploading the file' });
      setToastType('error');
      setToastMessage('An error occurred while uploading the file');
      setShowToast(true);
    } finally {
      setUploadLoading(false);
      setUploadFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    }
  };

  const formatBytes = (bytes: number): string => {
    if (!Number.isFinite(bytes) || bytes < 0) {
      return '-';
    }
    if (bytes === 0) {
      return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** unitIndex;
    const decimals = unitIndex === 0 ? 0 : value < 10 ? 2 : 1;
    return `${value.toFixed(decimals)} ${units[unitIndex]}`;
  };

  const truncateMiddle = (value: string, maxLength: number): string => {
    if (!value) {
      return '';
    }
    if (value.length <= maxLength) {
      return value;
    }
    const keepStart = Math.max(8, Math.floor(maxLength * 0.6));
    const keepEnd = Math.max(6, maxLength - keepStart - 3);
    return `${value.slice(0, keepStart)}...${value.slice(-keepEnd)}`;
  };

  return (
    <div className="max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your knowledge base files</p>
        </div>
        <Button onClick={handleOpenUploadModal}>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v12m0-12l4 4m-4-4L8 8m-4 8h16"
              />
            </svg>
            Upload File
          </span>
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Path
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploader
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                        {file.name?.charAt(0)?.toUpperCase() || 'F'}
                      </div>
                      <div className="ml-4">
                        <div className="truncate max-w-[150px] text-sm font-medium text-gray-900" title={file.name}>{file.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatBytes(file.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" title={file.path}>
                    {truncateMiddle(file.path, 30)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {file.uploader}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {humanReadableTime(file.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenRemoveDialog(file)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        title="Remove file"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tableFiles.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first knowledge base file.
              </p>
            </div>
          )}
        </div>
      </Card>

      <Modal isOpen={isUploadModalOpen} onClose={handleCloseUploadModal} title="Upload File">
        <div className="space-y-4">
          <div>
            <Input
              ref={fileInputRef}
              placeholder="Upload File"
              type="file"
              accept="application/json, application/pdf, text/plain, text/csv, text/tab-separated-values, text/tsv, application/xml"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleBrowseFileChange(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-200 file:text-gray-800 hover:file:bg-gray-300 focus:outline-none"
            />
            {uploadErrors.file && <p className="mt-1.5 text-sm text-red-600">{uploadErrors.file}</p>}
          </div>

          {uploadErrors.general && <div className="text-red-500 text-sm">{uploadErrors.general}</div>}

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button variant="secondary" onClick={handleCloseUploadModal} disabled={uploadLoading}>
              Cancel
            </Button>
            <Button onClick={handleUploadSubmit} loading={uploadLoading}>
              Upload
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isRemoveDialogOpen}
        onClose={handleCloseRemoveDialog}
        onConfirm={handleRemoveConfirm}
        title="Remove file"
        message="Are you sure you want to remove this file? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
        loading={removeLoading}
      />

      <Toast show={showToast} message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
    </div>
  );
};

