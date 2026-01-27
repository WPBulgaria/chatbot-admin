import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Toast } from '../components/Toast';
import { humanReadableTime } from '../utils/time';
import { makeChatsApi, type ChatWithMessages } from '../api/chats-api';
import { useRouter, Link } from '@tanstack/react-router';
import clsx from 'clsx';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const decodeUnicode = (str: string): string => {
  if (!str) return '';
  try {
    // Use JSON.parse to properly decode all unicode escapes including
    // Cyrillic, Chinese, Arabic, emoji, and surrogate pairs
    return JSON.parse(`"${str.replace(/"/g, '\\"')}"`);
  } catch {
    // Fallback: try regex replacement for \uXXXX patterns
    try {
      return str.replace(/\\u([0-9a-fA-F]{4})/gi, (_, code) =>
        String.fromCharCode(parseInt(code, 16))
      );
    } catch {
      return str;
    }
  }
};

interface EditChatProps {
  chat: ChatWithMessages;
  chatbotId?: number;
}

export const EditChat: React.FC<EditChatProps> = ({ chat, chatbotId }) => {
  const [title, setTitle] = useState(chat.title || '');
  const [titleLoading, setTitleLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const router = useRouter();

  const handleUpdateTitle = async () => {
    if (!title.trim()) {
      setToastType('error');
      setToastMessage('Title cannot be empty');
      setShowToast(true);
      return;
    }

    setTitleLoading(true);
    try {
      const response = await makeChatsApi().updateTitle(chat.id, title, chatbotId);
      if (!response.success) {
        setToastType('error');
        setToastMessage(response.message?.toString() || 'An error occurred while updating the title');
        setShowToast(true);
        return;
      }
      router.invalidate();
      setToastType('success');
      setToastMessage('Title updated successfully');
      setShowToast(true);
    } catch {
      setToastType('error');
      setToastMessage('An error occurred while updating the title');
      setShowToast(true);
    } finally {
      setTitleLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Link
          to={'/chats' as any}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Chats
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Chat #{chat.id}</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage this chat conversation</p>
      </div>

      <div className="space-y-6">
        <Card title="Chat Details" description="Basic information about this chat">
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Input
                  label="Title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Chat title"
                />
              </div>
              <Button onClick={handleUpdateTitle} loading={titleLoading}>
                Update Title
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-500">User ID</label>
                <p className="mt-1 text-sm text-gray-900">{chat.userId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <p className="mt-1">
                  {chat.trashedAt ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Trashed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Created</label>
                <p className="mt-1 text-sm text-gray-900">{humanReadableTime(chat.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Updated</label>
                <p className="mt-1 text-sm text-gray-900">{humanReadableTime(chat.modifiedAt)}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Messages" description={`${chat.messages?.length || 0} messages in this conversation`}>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {chat.messages && chat.messages.length > 0 ? (
              chat.messages.map((message) => (
                <div
                  key={message.id}
                  className={clsx(
                    'p-4 rounded-lg',
                    message.role === 'user' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8',
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={clsx(
                        'text-xs font-medium px-2 py-1 rounded',
                        message.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800',
                      )}
                    >
                      {message.role === 'user' ? 'User' : 'Assistant'}
                    </span>
                    <span className="text-xs text-gray-500">{humanReadableTime(message.createdAt)}</span>
                  </div>
                  <div className="text-sm text-gray-900 markdown-content">
                    <Markdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-base font-bold mt-2 mb-1">{children}</h3>,
                        p: ({ children }) => <p className="my-2">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="ml-2">{children}</li>,
                        code: ({ className, children }) => {
                          const isBlock = className?.includes('language-');
                          if (isBlock) {
                            return (
                              <code className="block bg-gray-800 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                                {children}
                              </code>
                            );
                          }
                          return (
                            <code className="bg-gray-200 text-pink-600 px-1.5 py-0.5 rounded text-xs">
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children }) => <pre className="my-3 overflow-x-auto">{children}</pre>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-600">
                            {children}
                          </blockquote>
                        ),
                        a: ({ href, children }) => (
                          <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                            {children}
                          </a>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-3">
                            <table className="min-w-full border border-gray-300 text-sm">{children}</table>
                          </div>
                        ),
                        th: ({ children }) => <th className="border border-gray-300 px-3 py-2 bg-gray-100 font-semibold text-left">{children}</th>,
                        td: ({ children }) => <td className="border border-gray-300 px-3 py-2">{children}</td>,
                        hr: () => <hr className="my-4 border-gray-300" />,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                      }}
                    >
                      {decodeUnicode(message.content)}
                    </Markdown>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
                <p className="mt-1 text-sm text-gray-500">This chat has no messages yet.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Toast show={showToast} message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
    </div>
  );
};
