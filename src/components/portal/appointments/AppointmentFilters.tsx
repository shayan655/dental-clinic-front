'use client'

import { AppointmentStatus } from '@/types'
import { Filters } from './AppointmentsClient'

const statusOptions: { value: AppointmentStatus | 'all'; label: string }[] = [
  { value: 'all',         label: 'All Statuses' },
  { value: 'pending',     label: 'Pending'      },
  { value: 'confirmed',   label: 'Confirmed'    },
  { value: 'in_progress', label: 'In Progress'  },
  { value: 'completed',   label: 'Completed'    },
  { value: 'cancelled',   label: 'Cancelled'    },
]

type Props = {
  filters: Filters
  onChange: (filters: Filters) => void
}

export default function AppointmentFilters({ filters, onChange }: Props) {
  const handleStatus = (status: AppointmentStatus | 'all') => {
    onChange({ ...filters, status })
  }

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, [e.target.name]: e.target.value })
  }

  const handleClear = () => {
    onChange({ status: 'all', dateFrom: '', dateTo: '' })
  }

  const isActive = filters.status !== 'all' || filters.dateFrom !== '' || filters.dateTo !== ''

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">

      {/* Status pills */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleStatus(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filters.status === opt.value
                ? 'bg-blue-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Date range + clear */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex items-center gap-2 flex-1">
          <label className="text-xs text-gray-500 shrink-0">From</label>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleDate}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 flex-1">
          <label className="text-xs text-gray-500 shrink-0">To</label>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleDate}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {isActive && (
          <button
            onClick={handleClear}
            className="text-xs text-red-500 hover:text-red-700 font-medium shrink-0 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

    </div>
  )
}