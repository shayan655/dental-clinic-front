import Navbar from '@/components/Home/Navbar';
import Footer from '@/components/Home/FooterView';
import type { ClinicInfo } from '@/lib/clinic';

interface Props {
  title: string;
  intro: string;
  updated: string;
  children: React.ReactNode;
}

export default function LegalPage({ title, intro, updated, children }: Props) {
  return (
    <div className="bg-blue-900">
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-6 py-14">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="mt-3 text-gray-500">{intro}</p>
            <p className="mt-4 text-xs text-gray-400">Last updated: {updated}</p>
          </div>
        </div>

        <article className="max-w-3xl mx-auto px-6 py-12 space-y-10">{children}</article>
      </div>

      <Footer />
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="text-sm leading-7 text-gray-700 space-y-3">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

// The clinic details come from Settings, so they are never out of date
export function ClinicContact({ clinic }: { clinic: ClinicInfo }) {
  const lines = [clinic.address, clinic.email, clinic.phone].filter(Boolean);

  return (
    <p>
      <span className="font-medium text-gray-900">{clinic.name}</span>
      {lines.map((line) => (
        <span key={line}>
          <br />
          {line}
        </span>
      ))}
    </p>
  );
}