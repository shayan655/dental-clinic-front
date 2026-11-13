import Navbar from '@/components/Home/Navbar';
import Footer from '@/components/Home/FooterView';
import { formatHours, getClinicInfo, getWorkingHours } from '@/lib/clinic';
import ContactContent from '@/components/contact/ContactContent';

export default async function ContactPage() {
  const [clinic, hours] = await Promise.all([getClinicInfo(), getWorkingHours()]);

  return (
    <div className="bg-blue-900">
      <Navbar />
      <ContactContent clinic={clinic} hoursLines={formatHours(hours)} />
      <Footer />
    </div>
  );
}