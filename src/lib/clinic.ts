const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://api.clinic.test';

export type ClinicInfo = {
  name: string;
  address: string;
  phone: string;
  email: string;
};

export type WorkingDay = {
  day: string;
  is_open: boolean;
  open_time: string;
  close_time: string;
};

const FALLBACK_INFO: ClinicInfo = { name: 'Dental Clinic', address: '', phone: '', email: '' };

// Public pages must still render if the API is down, so failures return null
async function getPublic<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 }, // edits in Settings show up within a minute
    });
    if (!res.ok) return null;
    return (await res.json()).data as T;
  } catch {
    return null;
  }
}

export async function getClinicInfo(): Promise<ClinicInfo> {
  return (await getPublic<ClinicInfo>('/api/settings')) ?? FALLBACK_INFO;
}

export async function getWorkingHours(): Promise<WorkingDay[]> {
  return (await getPublic<WorkingDay[]>('/api/settings/hours')) ?? [];
}

const SHORT_DAY: Record<string, string> = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
};

// Groups consecutive days with the same hours: ["Mon–Thu: 09:00–17:00", "Fri: 09:00–15:00", "Sat–Sun: Closed"]
export function formatHours(hours: WorkingDay[]): string[] {
  const label = (d: WorkingDay) => (d.is_open ? `${d.open_time}–${d.close_time}` : 'Closed');
  const lines: string[] = [];

  let i = 0;
  while (i < hours.length) {
    let j = i;
    while (j + 1 < hours.length && label(hours[j + 1]) === label(hours[i])) j++;

    const from = SHORT_DAY[hours[i].day] ?? hours[i].day;
    const to = SHORT_DAY[hours[j].day] ?? hours[j].day;
    lines.push(`${i === j ? from : `${from}–${to}`}: ${label(hours[i])}`);

    i = j + 1;
  }

  return lines;
}