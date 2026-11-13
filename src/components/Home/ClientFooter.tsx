'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ClinicInfo } from '@/lib/clinic';
import FooterView from './FooterView';

const EMPTY: ClinicInfo = { name: 'Dental Clinic', address: '', phone: '', email: '' };

export default function ClientFooter() {
  const { data } = useQuery({
    queryKey: ['clinic-info'],
    queryFn: async () => (await api.get<{ data: ClinicInfo }>('/api/settings')).data,
    staleTime: 60_000,
  });

  return <FooterView clinic={data ?? EMPTY} />;
}