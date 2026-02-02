import { useState } from 'react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { chatbotsApi } from '../api/chatbots-api';
import type { Chatbot, ChatbotPayload } from '../types/chatbot';
import { Button, Card, Modal, Input, Toast, ConfirmDialog } from '../components';

export const Chatbots = ({ chatbots }: { chatbots: Chatbot[], total: number, pages: number, currentPage: number, limit: number }) => {
  const navigate = useNavigate();
  const [chatbotsList, setChatbotsList] = useState<Chatbot[]>(chatbots);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [chatbot, setChatbot] = useState<ChatbotPayload>({
    title: '',
    description: '',
    status: 'publish',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [chatbotToDelete, setChatbotToDelete] = useState<Chatbot | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();
  const handleCreateChatbot = async () => {
    if (!chatbot.title.trim()) {
      setToast({ message: 'Title is required', type: 'error' });
      return;
    }

    try {
      const created = await chatbotsApi.create(chatbot);
      setChatbotsList([...chatbotsList, created]);
      setIsCreateModalOpen(false);
      setChatbot({ title: '', description: '', status: 'publish' });
      setToast({ message: 'Chatbot created successfully', type: 'success' });
      router.invalidate();
    } catch (error) {
      setToast({ message: 'Failed to create chatbot', type: 'error' });
    }
  };

  const handleSelectChatbot = (chatbot: Chatbot) => {
    navigate({ to: `/$chatbotId/dashboard`, params: { chatbotId: chatbot.id.toString() } });
  };

  const handleOpenDeleteDialog = (chatbot: Chatbot, event: React.MouseEvent) => {
    event.stopPropagation();
    setChatbotToDelete(chatbot);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setChatbotToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!chatbotToDelete) {
      return;
    }

    setDeleteLoading(true);
    try {
      await chatbotsApi.trash(chatbotToDelete.id);
      setChatbotsList(chatbotsList.filter(bot => bot.id !== chatbotToDelete.id));
      setToast({ message: 'Chatbot deleted successfully', type: 'success' });
      router.invalidate();
    } catch (error) {
      setToast({ message: 'Failed to delete chatbot', type: 'error' });
    } finally {
      setDeleteLoading(false);
      handleCloseDeleteDialog();
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'publish':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chatbots</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your chatbot instances</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create
        </Button>
      </div>

      {chatbots.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No chatbots yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first chatbot</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>Create Chatbot</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((chatbot) => (
            <Card
              key={chatbot.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSelectChatbot(chatbot)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{chatbot.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadgeClass(chatbot.status)}`}>
                    {chatbot.status}
                  </span>
                </div>
                
                {chatbot.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{chatbot.description}</p>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    ID: {chatbot.id}
                  </div>
                  <button
                    onClick={(e) => handleOpenDeleteDialog(chatbot, e)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Chatbot"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={chatbot.title}
            onChange={(e) => setChatbot({ ...chatbot, title: e.target.value })}
            placeholder="Enter chatbot title"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea 
              value={chatbot.description}
              onChange={(e) => setChatbot({ ...chatbot, description: e.target.value })}
              placeholder="Enter chatbot description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={chatbot.status}
              onChange={(e) => setChatbot({ ...chatbot, status: e.target.value as 'publish' | 'draft' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="publish">Publish</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleCreateChatbot} className="flex-1">
              Create
            </Button>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Chatbot"
        message={`Are you sure you want to delete "${chatbotToDelete?.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
      />

      {toast && (
        <Toast
          show={true}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
