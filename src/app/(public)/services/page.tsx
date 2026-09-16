import { getAuthUser } from '@/lib/auth';
import { Service } from '@/types';
import Link from 'next/link';

async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data;
  } catch {
    return [
      { id: 1, name: 'General Checkup',  description: 'A thorough examination of your teeth and gums to detect any issues early and keep your smile healthy.', duration_minutes: 30, price: '50.00',  created_at: '', updated_at: '' },
      { id: 2, name: 'Teeth Cleaning',   description: 'Professional scaling and polishing to remove plaque and tartar buildup for a fresher, cleaner mouth.', duration_minutes: 45, price: '80.00',  created_at: '', updated_at: '' },
      { id: 3, name: 'Tooth Extraction', description: 'Safe and gentle removal of damaged or problematic teeth under local anaesthesia.', duration_minutes: 60, price: '150.00', created_at: '', updated_at: '' },
      { id: 4, name: 'Root Canal',       description: 'Effective treatment to save an infected tooth by removing damaged tissue and sealing the canal.', duration_minutes: 90, price: '600.00', created_at: '', updated_at: '' },
      { id: 5, name: 'Teeth Whitening',  description: 'Professional-grade whitening treatment to brighten your smile by several shades in a single session.', duration_minutes: 60, price: '200.00', created_at: '', updated_at: '' },
      { id: 6, name: 'Dental X-Ray',     description: 'High-resolution imaging to detect hidden issues such as bone loss, infections, or impacted teeth.', duration_minutes: 20, price: '40.00',  created_at: '', updated_at: '' },
    ];
  }
}

const SERVICE_ICONS: Record<string, string> = {
  'General Checkup':  '🦷',
  'Teeth Cleaning':   '✨',
  'Tooth Extraction': '🩺',
  'Root Canal':       '💉',
  'Teeth Whitening':  '⭐',
  'Dental X-Ray':     '📋',
};

export default async function ServicesPage() {
  const [services, user] = await Promise.all([
    getServices(),
    getAuthUser(),
  ]);

  const bookingHref = user ? '/portal/appointments/new' : '/register';
  const bookingLabel = user ? 'Book Now' : 'Register to Book';

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Our Services
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Expert Dental Care,<br className="hidden sm:block" /> Tailored to You
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            From routine checkups to advanced treatments — our experienced team is here to keep your smile healthy and bright.
          </p>
        </div>
      </div>

      {/* Services grid */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col hover:shadow-md transition-shadow"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-5">
                {SERVICE_ICONS[service.name] ?? '🦷'}
              </div>

              {/* Name */}
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                {service.name}
              </h2>

              {/* Description */}
              {service.description && (
                <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">
                  {service.description}
                </p>
              )}

              {/* Meta */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="text-sm font-medium text-gray-700">
                    {service.duration_minutes} min
                  </p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-xs text-gray-400">Price</p>
                  <p className="text-lg font-bold text-blue-700">
                    €{service.price}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <Link
                href={bookingHref}
                className="mt-4 block text-center bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
              >
                {bookingLabel}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom note for guests */}
        {!user && (
          <p className="text-center text-sm text-gray-400 mt-10">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
              Log in to book
            </Link>
          </p>
        )}
      </div>

    </div>
  );
}