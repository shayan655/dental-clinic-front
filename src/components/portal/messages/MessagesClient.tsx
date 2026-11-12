'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getErrorMessage } from '@/lib/api';
import { ContactMessage } from '@/types';

interface Props {
  messages: ContactMessage[];
  canDelete: boolean;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MessagesClient({ messages, canDelete }: Props) {
  const router = useRouter();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [openId, setOpenId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === 'unread' ? messages.filter((m) => !m.read_at) : messages),
    [messages, filter]
  );

  async function setRead(message: ContactMessage, read: boolean) {
    setError(null);
    try {
      await api.put(`/api/contact-messages/${message.id}`, { read });
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update the message.'));
    }
  }

  function toggle(message: ContactMessage) {
    const opening = openId !== message.id;
    setOpenId(opening ? message.id : null);

    // Opening an unread message marks it as read
    if (opening && !message.read_at) {
      void setRead(message, true);
    }
  }

  async function handleDelete(id: number) {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/contact-messages/${id}`);
      setDeleteConfirmId(null);
      setOpenId(null);
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not delete the message.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'unread'] as const).map((value) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-colors ${
              filter === value
                ? 'bg-blue-700 text-white border-blue-700'
                : 'border-gray-300 text-gray-600 hover:border-blue-700 hover:text-blue-700'
            }`}
          >
            {value === 'all' ? 'All' : 'Unread'}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {visible.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-12 text-center text-sm text-gray-400">
          {filter === 'unread' ? 'No unread messages.' : 'No messages yet.'}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((message) => {
            const isOpen = openId === message.id;
            const isUnread = !message.read_at;
            const isConfirmingDelete = deleteConfirmId === message.id;

            return (
              <div key={message.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                {/* Header row */}
                <button
                  onClick={() => toggle(message)}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${isUnread ? 'bg-blue-600' : 'bg-transparent'}`}
                      aria-label={isUnread ? 'Unread' : 'Read'}
                    />
                    <div className="min-w-0">
                      <p className={`text-sm text-gray-900 ${isUnread ? 'font-semibold' : 'font-medium'}`}>
                        {message.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{message.message}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{formatDateTime(message.created_at)}</span>
                </button>

                {/* Opened message */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-6 py-5 space-y-4">
                    <p className="text-sm text-gray-800 whitespace-pre-line">{message.message}</p>

                    <dl className="text-sm space-y-1">
                      <div className="flex gap-2">
                        <dt className="text-gray-500 w-14 shrink-0">Email</dt>
                        <dd className="text-gray-900 break-all">{message.email}</dd>
                      </div>
                      {message.phone && (
                        <div className="flex gap-2">
                          <dt className="text-gray-500 w-14 shrink-0">Phone</dt>
                          <dd className="text-gray-900">{message.phone}</dd>
                        </div>
                      )}
                    </dl>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={`mailto:${message.email}?subject=${encodeURIComponent('Your message to our clinic')}`}
                        className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        Reply by email
                      </a>
                      <button
                        onClick={() => setRead(message, false)}
                        className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Mark as unread
                      </button>

                      {canDelete &&
                        (!isConfirmingDelete ? (
                          <button
                            onClick={() => setDeleteConfirmId(message.id)}
                            className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Delete permanently?</span>
                            <button
                              onClick={() => handleDelete(message.id)}
                              disabled={loading}
                              className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              {loading ? 'Deleting...' : 'Yes, delete'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}