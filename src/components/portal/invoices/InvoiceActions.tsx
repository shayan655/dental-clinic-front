'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getErrorMessage } from '@/lib/api';
import { Invoice } from '@/types';

export default function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Paid and cancelled invoices are final
  if (invoice.status !== 'pending') return null;

  async function update(status: 'paid' | 'cancelled') {
    if (status === 'cancelled' && !confirm('Cancel this invoice?')) return;

    setLoading(true);
    setError(null);
    try {
      await api.put(`/api/invoices/${invoice.id}`, { status });
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update the invoice.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1">
        <button
          onClick={() => update('paid')}
          disabled={loading}
          className="text-sm text-green-700 hover:text-green-900 font-medium px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
        >
          Mark as paid
        </button>
        <button
          onClick={() => update('cancelled')}
          disabled={loading}
          className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}