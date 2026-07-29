'use client';

import { useMemo, useState } from 'react';
import { Invoice, InvoiceStatus } from '@/types';

interface Props {
  invoices: Invoice[];
  isPatient: boolean;
}

const STATUS_FILTERS: { label: string; value: InvoiceStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Cancelled', value: 'cancelled' },
];

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export default function InvoicesClient({ invoices, isPatient }: Props) {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return invoices;
    return invoices.filter((inv) => inv.status === statusFilter);
  }, [invoices, statusFilter]);

  return (
    <div className="space-y-4">

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-blue-700 text-white border-blue-700'
                : 'border-gray-300 text-gray-600 hover:border-blue-700 hover:text-blue-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Invoice</th>
              {!isPatient && (
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Patient</th>
              )}
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Amount</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Issued</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Paid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={isPatient ? 5 : 6}
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  No invoices found{statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''}.
                </td>
              </tr>
            ) : (
              filtered.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{invoice.id}
                  </td>
                  {!isPatient && (
                    <td className="px-6 py-4 text-gray-600">
                      {invoice.patient?.name ?? '—'}
                    </td>
                  )}
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {formatAmount(invoice.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[invoice.status]}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(invoice.issued_at)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {invoice.paid_at ? formatDate(invoice.paid_at) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400">
            No invoices found{statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''}.
          </div>
        ) : (
          filtered.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white border border-gray-200 rounded-xl px-4 py-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-gray-900">Invoice #{invoice.id}</p>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[invoice.status]}`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                {!isPatient && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Patient</span>
                    <span className="text-gray-900">{invoice.patient?.name ?? '—'}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-medium text-gray-900">{formatAmount(invoice.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Issued</span>
                  <span className="text-gray-900">{formatDate(invoice.issued_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Paid</span>
                  <span className="text-gray-900">{invoice.paid_at ? formatDate(invoice.paid_at) : '—'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}