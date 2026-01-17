import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { Toast } from '../components/Toast';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Pagination } from '../components/Pagination';
import { humanReadableTime } from '../utils/time';
import { makeChatsApi, type Chat } from '../api/chats-api';
import { useRouter, Link } from '@tanstack/react-router';
import { Button } from '@headlessui/react';

interface ChatsProps {
  chats: Chat[];
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
}

export const Chats: React.FC<ChatsProps> = ({
  chats = [],
  total = 0,
  pages = 1,
  currentPage = 1,
  limit = 20,
}) => {
  const [tableChats, setTableChats] = useState<Chat[]>(chats);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const router = useRouter();

  const [isTrashDialogOpen, setIsTrashDialogOpen] = useState(false);
  const [chatToTrash, setChatToTrash] = useState<Chat | null>(null);
  const [trashLoading, setTrashLoading] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [restoreLoadingId, setRestoreLoadingId] = useState<number | null>(null);

  useEffect(() => {
    setTableChats(chats);
  }, [chats]);

  const handleOpenTrashDialog = (chat: Chat) => {
    setChatToTrash(chat);
    setIsTrashDialogOpen(true);
  };

  const handleCloseTrashDialog = () => {
    setIsTrashDialogOpen(false);
    setChatToTrash(null);
  };

  const handleTrashConfirm = async () => {
    if (!chatToTrash) {
      return;
    }

    setTrashLoading(true);
    try {
      const response = await makeChatsApi().trash(chatToTrash.id);
      if (!response.success) {
        setToastType('error');
        setToastMessage(response.message?.toString() || 'An error occurred while trashing the chat');
        setShowToast(true);
        return;
      }
      router.invalidate();
      setTableChats((prev) =>
        prev.map((c) => (c.id === chatToTrash.id ? { ...c, trashedAt: new Date().toISOString() } : c)),
      );
      setToastType('success');
      setToastMessage('Chat moved to trash');
      setShowToast(true);
    } catch {
      setToastType('error');
      setToastMessage('An error occurred while trashing the chat');
      setShowToast(true);
    } finally {
      setTrashLoading(false);
      handleCloseTrashDialog();
    }
  };

  const handleOpenDeleteDialog = (chat: Chat) => {
    setChatToDelete(chat);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setChatToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!chatToDelete) {
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await makeChatsApi().remove(chatToDelete.id);
      if (!response.success) {
        setToastType('error');
        setToastMessage(response.message?.toString() || 'An error occurred while deleting the chat');
        setShowToast(true);
        return;
      }
      router.invalidate();
      setTableChats((prev) => prev.filter((c) => c.id !== chatToDelete.id));
      setToastType('success');
      setToastMessage('Chat deleted permanently');
      setShowToast(true);
    } catch {
      setToastType('error');
      setToastMessage('An error occurred while deleting the chat');
      setShowToast(true);
    } finally {
      setDeleteLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const handleRestore = async (chat: Chat) => {
    setRestoreLoadingId(chat.id);
    try {
      const response = await makeChatsApi().restore(chat.id);
      if (!response.success) {
        setToastType('error');
        setToastMessage(response.message?.toString() || 'An error occurred while restoring the chat');
        setShowToast(true);
        return;
      }
      router.invalidate();
      setTableChats((prev) => prev.map((c) => (c.id === chat.id ? { ...c, trashedAt: undefined } : c)));
      setToastType('success');
      setToastMessage('Chat restored');
      setShowToast(true);
    } catch {
      setToastType('error');
      setToastMessage('An error occurred while restoring the chat');
      setShowToast(true);
    } finally {
      setRestoreLoadingId(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (router.navigate as any)({
      to: '/chats',
      search: { page: newPage, limit },
    });
  };

  const truncateTitle = (title: string, maxLength = 50): string => {
    if (!title) {
      return 'Untitled Chat';
    }
    if (title.length <= maxLength) {
      return title;
    }
    return `${title.slice(0, maxLength)}...`;
  };

  return (
    <div className="max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage chat conversations</p>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableChats.map((chat) => (
                <tr key={chat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">#{chat.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Link
                      to={'/chats/$chatId' as any}
                      params={{ chatId: String(chat.id) } as any}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      title={chat.title}
                    >
                      {truncateTitle(chat.title)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{chat.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {chat.trashedAt ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Trashed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {humanReadableTime(chat.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {humanReadableTime(chat.modifiedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <Link
                        to={'/chats/$chatId' as any}
                        params={{ chatId: String(chat.id) } as any}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                        title="View chat"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>

                      {chat.trashedAt ? (
                        <>
                          <Button
                            onClick={() => handleRestore(chat)}
                            disabled={restoreLoadingId === chat.id}
                            className="text-green-600 hover:text-green-800 transition-colors p-2 hover:bg-green-50 rounded-lg disabled:opacity-50"
                            title="Restore chat"
                          >
                            {restoreLoadingId === chat.id ? (
                              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleOpenDeleteDialog(chat)}
                            className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            title="Delete permanently"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleOpenTrashDialog(chat)}
                          className="text-orange-600 hover:text-orange-800 transition-colors p-2 hover:bg-orange-50 rounded-lg"
                          title="Move to trash"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tableChats.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No chats</h3>
              <p className="mt-1 text-sm text-gray-500">No chat conversations found.</p>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={pages}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
          itemLabel="chats"
        />
      </Card>

      <ConfirmDialog
        isOpen={isTrashDialogOpen}
        onClose={handleCloseTrashDialog}
        onConfirm={handleTrashConfirm}
        title="Move to trash"
        message="Are you sure you want to move this chat to trash? You can restore it later."
        confirmText="Move to Trash"
        cancelText="Cancel"
        variant="danger"
        loading={trashLoading}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete permanently"
        message="Are you sure you want to permanently delete this chat? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteLoading}
      />

      <Toast show={showToast} message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
    </div>
  );
};
