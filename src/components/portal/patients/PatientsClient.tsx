'use client';

import { useMemo, useState } from 'react';
import { Patient } from '@/types';
import Link from 'next/link';

interface Props {
  patients: Patient[];
}

function formatDOB(dob: string) {
  return new Date(dob).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function PatientsClient({ patients }: Props) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) => p.name.toLowerCase().includes(q));
  }, [patients, search]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Name</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Email</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Phone</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Date of Birth</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                  No patients found{search ? ` matching "${search}"` : ''}.
                </td>
              </tr>
            ) : (
              filtered.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      {patient.name}
                      {!patient.user_id && (
                        <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                          No account
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{patient.email}</td>
                  <td className="px-6 py-4 text-gray-600">{patient.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDOB(patient.date_of_birth)}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/portal/patients/${patient.id}`}
                      className="text-blue-700 hover:text-blue-900 font-medium transition-colors"
                    >
                      View →
                    </Link>
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
            No patients found{search ? ` matching "${search}"` : ''}.
          </div>
        ) : (
          filtered.map((patient) => (
            <div key={patient.id} className="bg-white border border-gray-200 rounded-xl px-4 py-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{patient.name}</p>
                  {!patient.user_id && (
                    <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full mt-1 inline-block">
                      No account
                    </span>
                  )}
                </div>
                <Link
                  href={`/portal/patients/${patient.id}`}
                  className="text-blue-700 hover:text-blue-900 text-sm font-medium shrink-0 transition-colors"
                >
                  View →
                </Link>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-900">{patient.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="text-gray-900">{patient.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date of birth</span>
                  <span className="text-gray-900">{formatDOB(patient.date_of_birth)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}