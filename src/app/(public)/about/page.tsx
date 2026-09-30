import Footer from '@/components/Home/Footer';
import Navbar from '@/components/Home/Navbar';
import { getAuthUser } from '@/lib/auth';
import Link from 'next/link';

const TEAM = [
  {
    name: 'Dr. Sarah Mitchell',
    role: 'Lead Dentist & Founder',
    bio: 'Over 15 years of experience in general and cosmetic dentistry. Passionate about pain-free care and patient comfort.',
    initial: 'S',
  },
  {
    name: 'Dr. James Okafor',
    role: 'Endodontist',
    bio: 'Specialist in root canal treatments and dental infections. Known for his calm approach and precise technique.',
    initial: 'J',
  },
  {
    name: 'Dr. Priya Nair',
    role: 'Cosmetic Dentist',
    bio: 'Expert in teeth whitening, veneers, and smile makeovers. Dedicated to helping patients feel confident in their smile.',
    initial: 'P',
  },
];

const VALUES = [
  {
    icon: '🤝',
    title: 'Patient First',
    description: 'Every decision we make starts with what is best for our patients — comfort, safety, and long-term health.',
  },
  {
    icon: '🔬',
    title: 'Modern Technology',
    description: 'We invest in the latest dental equipment and techniques to deliver precise, efficient, and minimally invasive care.',
  },
  {
    icon: '💙',
    title: 'Compassionate Care',
    description: 'Dental anxiety is real. We create a calm, welcoming environment so every visit feels as comfortable as possible.',
  },
  {
    icon: '📋',
    title: 'Transparent Pricing',
    description: 'No hidden fees, no surprises. We explain all costs upfront so you can make informed decisions about your care.',
  },
];

export default async function AboutPage() {
  const user = await getAuthUser();
  const bookingHref = user ? '/portal/appointments/new' : '/register';
  const bookingLabel = user ? 'Book an Appointment' : 'Register & Book';

  return (
    <div className='bg-blue-900'>
      <Navbar />

      <div className="min-h-screen bg-gray-50">

        {/* Hero */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-16 text-center">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              About Us
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              A Clinic Built on Trust,<br className="hidden sm:block" /> Care, and Expertise
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              DentalCare has been serving Amsterdam since 2010. We are a team of dedicated dental professionals committed to keeping your smile healthy for life.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">

          {/* Our story */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <div className="space-y-4 text-gray-500 text-sm leading-relaxed">
                <p>
                  DentalCare was founded in 2010 by Dr. Sarah Mitchell with a simple mission: to provide high-quality dental care in a warm, stress-free environment. What started as a small two-chair practice has grown into a trusted clinic serving thousands of patients across Amsterdam.
                </p>
                <p>
                  Over the years we have expanded our team, upgraded our technology, and broadened our range of services — but our core values have never changed. Every patient who walks through our doors is treated with the same care and respect, regardless of the complexity of their needs.
                </p>
                <p>
                  We believe that good dental health is foundational to overall wellbeing, and we are here to make that care as accessible and comfortable as possible.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '14+',   label: 'Years in Practice'   },
                { value: '5,000+', label: 'Patients Treated'   },
                { value: '3',     label: 'Expert Dentists'     },
                { value: '98%',   label: 'Patient Satisfaction' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white border border-gray-200 rounded-2xl p-6 text-center"
                >
                  <p className="text-3xl font-bold text-blue-700 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Values */}
          <section>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What We Stand For</h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                Our values shape every interaction — from the moment you book to the moment you leave.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {VALUES.map((value) => (
                <div
                  key={value.title}
                  className="bg-white border border-gray-200 rounded-2xl p-6 flex gap-4"
                >
                  <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{value.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Meet the Team</h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                Our dentists bring decades of combined experience and a shared passion for exceptional patient care.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {TEAM.map((member) => (
                <div
                  key={member.name}
                  className="bg-white border border-gray-200 rounded-2xl p-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {member.initial}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-xs text-blue-700 font-medium mt-0.5 mb-3">{member.role}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA banner */}
          <section className="bg-blue-700 rounded-2xl px-8 py-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to Take Care of Your Smile?
            </h2>
            <p className="text-blue-200 text-sm mb-6 max-w-md mx-auto">
              Join thousands of patients who trust DentalCare for their dental health. Book your first appointment today.
            </p>
            <Link
              href={bookingHref}
              className="inline-block bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
            >
              {bookingLabel}
            </Link>
            {!user && (
              <p className="text-blue-300 text-xs mt-4">
                Already registered?{' '}
                <Link href="/login" className="text-white hover:underline font-medium">
                  Log in here
                </Link>
              </p>
            )}
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}