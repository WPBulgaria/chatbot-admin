import { useState } from "react";
import { Card, Button, Input, Toast } from "../components";
import { Chatbot } from "../types/chatbot";
import { Link, useRouter } from "@tanstack/react-router";
import { chatbotsApi } from "../api/chatbots-api";


export function Dashboard({ chatbot, chatbotId }: { chatbot: Chatbot, chatbotId: number }) {
  const router = useRouter();
  const [editingField, setEditingField] = useState<'title' | 'description' | 'status' | null>(null);
  const [editedTitle, setEditedTitle] = useState(chatbot.title);
  const [editedDescription, setEditedDescription] = useState(chatbot.description || '');
  const [editedStatus, setEditedStatus] = useState(chatbot.status);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleEdit = (field: 'title' | 'description' | 'status') => {
    setEditingField(field);
    setEditedTitle(chatbot.title);
    setEditedDescription(chatbot.description || '');
    setEditedStatus(chatbot.status);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditedTitle(chatbot.title);
    setEditedDescription(chatbot.description || '');
    setEditedStatus(chatbot.status);
  };

  const handleSave = async () => {
    if (!editingField) return;

    const payload: any = {...chatbot, config: undefined, modifiedAt: undefined, createdAt: undefined};
    if (editingField === 'title') {
      if (!editedTitle.trim()) {
        setToast({ message: 'Title cannot be empty', type: 'error' });
        return;
      }
      payload.title = editedTitle;
    } else if (editingField === 'description') {
      payload.description = editedDescription;
    } else if (editingField === 'status') {
      payload.status = editedStatus;
    }

    setLoading(true);
    try {
      await chatbotsApi.update(chatbotId, payload);
      setToast({ message: 'Updated successfully', type: 'success' });
      setEditingField(null);
      router.invalidate();
    } catch (error) {
      setToast({ message: 'Failed to update', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          {editingField === 'title' ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="flex-1"
                placeholder="Enter title"
              />
              <Button onClick={handleSave} disabled={loading} className="whitespace-nowrap">
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">{chatbot.title}</h1>
              <button
                onClick={() => handleEdit('title')}
                className="text-gray-400 hover:text-gray-600 transition"
                title="Edit title"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">Overview</p>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Status</span>
              {editingField !== 'status' && (
                <button
                  onClick={() => handleEdit('status')}
                  className="text-gray-400 hover:text-gray-600 transition"
                  title="Edit status"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
            </div>
            {editingField === 'status' ? (
              <div className="space-y-2">
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value as 'publish' | 'draft')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="publish">Publish</option>
                  <option value="draft">Draft</option>
                </select>
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={loading} className="flex-1 text-xs">
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="secondary" onClick={handleCancel} disabled={loading} className="flex-1 text-xs">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-900 capitalize">{chatbot.status}</div>
            )}
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Chatbot ID</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">#{chatbot.id}</div>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Created</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {new Date(Date.parse(chatbot.createdAt)).toLocaleDateString()}
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Updated</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {new Date(Date.parse(chatbot.modifiedAt)).toLocaleDateString()}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Description</h3>
            {editingField !== 'description' && (
              <button
                onClick={() => handleEdit('description')}
                className="text-gray-400 hover:text-gray-600 transition"
                title="Edit description"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>
          {editingField === 'description' ? (
            <div className="space-y-2">
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-900">{chatbot.description || 'No description'}</p>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <div className="space-y-2">
              <Link to={`/$chatbotId/chats`} params={{ chatbotId: chatbot.id.toString() }} className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition">
                View Chats
              </Link>
              <Link to={`/$chatbotId/knowledge-base`} params={{ chatbotId: chatbot.id.toString() }} className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition">
                Manage Knowledge Base
              </Link>
              <Link to={`/$chatbotId/plans`} params={{ chatbotId: chatbot.id.toString() }} className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition">
                Configure Plans
              </Link>
              <Link to={`/$chatbotId/configuration`} params={{ chatbotId: chatbot.id.toString() }} className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition">
                Configuration
              </Link>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
            <div className="text-sm text-gray-600">
              <p>Configure your chatbot settings, appearance, and behavior to match your needs.</p>
              <Link to={`/$chatbotId/configuration`} params={{ chatbotId: chatbot.id.toString() }} className="text-blue-600 hover:underline mt-2 inline-block">
                Go to Configuration →
              </Link>
            </div>
          </div>
        </Card>
      </div>

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
}