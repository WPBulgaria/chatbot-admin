import { useRef, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Button as HeadlessButton } from '@headlessui/react';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Pagination } from '../components/Pagination';
import { humanReadableTime } from '../utils/time';
import { makeFilesApi } from '../api/files-api';
import type { KnowledgeBaseFile } from '../types/knowledge-base';
import { useRouter } from '@tanstack/react-router';
import { Input } from '@headlessui/react';

interface KnowledgeBaseProps {
  files: KnowledgeBaseFile[];
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
  chatbotId: number;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  files = [],
  total = 0,
  pages = 1,
  currentPage = 1,
  limit = 10,
  chatbotId,
}) => {
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
  const [startUsingLoadingId, setStartUsingLoadingId] = useState<string | null>(null);

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
      const response = await makeFilesApi().remove(fileToRemove.id, chatbotId);
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

  const handleStartUsingFile = async (file: KnowledgeBaseFile) => {
    if (file.inUse) {
      return;
    }

    setStartUsingLoadingId(file.id);
    try {
      const response = await makeFilesApi().use(file.id, chatbotId);
      if (!response.success) {
        setToastType('error');
        console.log(response);
        setToastMessage(response.message?.toString() || 'An error occurred while starting to use the file');
        setShowToast(true);
        return;
      }
      router.invalidate();
      setTableFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, inUse: true } : f)),
      );
      setToastType('success');
      setToastMessage('File is now in use');
      setShowToast(true);
    } catch {
      setToastType('error');
      setToastMessage('An error occurred while starting to use the file');
      setShowToast(true);
    } finally {
      setStartUsingLoadingId(null);
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

      const response = await makeFilesApi().upload(file, chatbotId);

      if (!response.success) {
        setUploadErrors({ general: response.message?.toString() || 'An error occurred while uploading the file' });
        setToastType('error');
        setToastMessage(response.message?.toString() || 'An error occurred while uploading the file');
        setShowToast(true);
        return;
      }



      setToastType('success');
      setToastMessage('File uploaded successfully');
      setShowToast(true);
      setIsUploadModalOpen(false);
      setUploadErrors({});
      setUploadFile(null);
      router.invalidate();
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

  const handlePageChange = (newPage: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (router.navigate as any)({
      to: '/knowledge-base',
      search: { page: newPage, limit },
    });
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
                  File Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In use?
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File URL
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
                    <div className="truncate max-w-[150px] text-sm font-medium text-gray-900" title={file.name}>
                          {file.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{file.type?.split('/')[1] || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatBytes(file.size)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{file.inUse ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" title={file.url ?? '-'}>
                    <HeadlessButton
                      onClick={() => {
                        if (file.url) {
                          navigator.clipboard.writeText(file.url);
                          setToastType('success');
                          setToastMessage('File URL copied to clipboard');
                          setShowToast(true);
                        }
                      }}
                      className="rounded-full mr-1 cursor-pointer"
                      title="Copy file URL to clipboard"
                      type="button"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                        <rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </HeadlessButton>
                    {truncateMiddle(file.url ?? '-', 30)}
                  </td>
                  <td className="truncate max-w-[200px] px-6 py-4 whitespace-nowrap text-sm text-gray-600" title={file.uploader}>{file.uploader}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {humanReadableTime(file.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {!file.inUse && (
                        <button
                          onClick={() => handleStartUsingFile(file)}
                          disabled={startUsingLoadingId === file.id}
                          className="text-green-600 hover:text-green-800 transition-colors p-2 hover:bg-green-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Start using file"
                        >
                          {startUsingLoadingId === file.id ? (
                            <svg
                              className="w-5 h-5 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                        </button>
                      )}
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
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first knowledge base file.</p>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={pages}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
          itemLabel="files"
        />
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
