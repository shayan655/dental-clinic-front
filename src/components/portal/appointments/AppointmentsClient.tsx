'use client'

import { useState, useMemo } from 'react'
import { Appointment, AppointmentStatus } from '@/types'
import AppointmentFilters from './AppointmentFilters'
import AppointmentsTable from './AppointmentsTable'
import AppointmentCard from './AppointmentCard'

type Props = {
  appointments: Appointment[]
}

export type Filters = {
  status: AppointmentStatus | 'all'
  dateFrom: string
  dateTo: string
}

export default function AppointmentsClient({ appointments }: Props) {
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    dateFrom: '',
    dateTo: '',
  })

  const filtered = useMemo(() => {
    return appointments.filter(apt => {
      if (filters.status !== 'all' && apt.status !== filters.status) return false

      const aptDate = apt.scheduled_at.slice(0, 10)
      if (filters.dateFrom && aptDate < filters.dateFrom) return false
      if (filters.dateTo && aptDate > filters.dateTo) return false

      return true
    })
  }, [appointments, filters])

  return (
    <div className="space-y-4">
      <AppointmentFilters filters={filters} onChange={setFilters} />

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-2xl mb-2">📅</p>
          <p className="font-medium text-gray-700">No appointments found</p>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block">
            <AppointmentsTable appointments={filtered} />
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-3">
            {filtered.map(apt => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}