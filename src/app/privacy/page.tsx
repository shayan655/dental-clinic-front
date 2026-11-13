import type { Metadata } from 'next';
import LegalPage, { ClinicContact, LegalList, LegalSection } from '@/components/legal/LegalPage';
import { getClinicInfo } from '@/lib/clinic';

export const metadata: Metadata = { title: 'Privacy Policy' };

const UPDATED = '13 November 2026';

export default async function PrivacyPage() {
  const clinic = await getClinicInfo();

  return (
    <LegalPage
      title="Privacy Policy"
      intro="How we collect, use and protect your personal data when you use our website and patient portal."
      updated={UPDATED}
    >
      <LegalSection title="1. Who we are">
        <p>
          The clinic below is responsible for the personal data described in this policy (the
          “controller”).
        </p>
        <ClinicContact clinic={clinic} />
        <p>
          For any question about your data, or to use your rights, contact us using the details
          above.
        </p>
      </LegalSection>

      <LegalSection title="2. What data we collect">
        <LegalList
          items={[
            <>
              <span className="font-medium">Account and profile data:</span> name, email address,
              phone number, date of birth and your password (stored only in scrambled, hashed form;
              we cannot read it).
            </>,
            <>
              <span className="font-medium">Appointment data:</span> dates and times, the service
              booked, the dentist assigned and any notes added to the appointment.
            </>,
            <>
              <span className="font-medium">Health data:</span> diagnoses, treatments,
              prescriptions and clinical notes written by your dentist. This is a special category
              of personal data and receives extra protection.
            </>,
            <>
              <span className="font-medium">Billing data:</span> invoice amounts, status and dates.
              We do not collect card or bank details, because payments are made in person at the
              clinic.
            </>,
            <>
              <span className="font-medium">Contact form messages:</span> your name, email address,
              optional phone number and the message you send us.
            </>,
            <>
              <span className="font-medium">Technical data:</span> the cookies described in section 6
              that keep you signed in securely.
            </>,
          ]}
        />
        <p>
          If a member of our staff created your patient profile for you, they entered the contact
          details you gave them.
        </p>
      </LegalSection>

      <LegalSection title="3. Why we use your data">
        <p>Where data protection law such as the GDPR applies, we rely on these legal grounds:</p>
        <LegalList
          items={[
            'To provide dental care, manage your appointments and keep your treatment records: this is necessary for providing healthcare, and for health data it relies on the healthcare exception for processing special category data.',
            'To issue invoices and keep accounting records: this is necessary to meet our legal obligations.',
            'To answer your messages and requests: this is necessary to respond to your request.',
            'To keep the portal secure, prevent misuse and fix errors: this is our legitimate interest in running a safe service.',
          ]}
        />
        <p>We do not sell your data and we do not use it for advertising.</p>
      </LegalSection>

      <LegalSection title="4. Who can see your data">
        <LegalList
          items={[
            'You can see your own appointments, invoices and medical records in the portal.',
            'Dentists who treat you can see your appointments and your medical records.',
            'Reception and management staff can see the details needed to schedule appointments and handle billing. They cannot open your medical records.',
            'Administrators manage accounts and clinic settings, and cannot open medical records either.',
          ]}
        />
        <p>
          Access is controlled by role and enforced by the system itself, not only by what is shown
          on screen. Where we use IT or hosting providers, they process data only on our behalf
          and on our instructions. We share data with others only when the law requires it or when
          you ask us to.
        </p>
      </LegalSection>

      <LegalSection title="5. How long we keep your data">
        <LegalList
          items={[
            'Medical records are kept for as long as the law requires for patient records.',
            'Invoices are kept for the period required by tax and accounting rules.',
            'Your account and profile data are kept while you are a patient of the clinic.',
            'Contact form messages are deleted when they are no longer needed to deal with your request.',
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Cookies">
        <p>We use only strictly necessary cookies, so no cookie banner is needed:</p>
        <LegalList
          items={[
            'A session cookie that keeps you signed in. It is not readable by scripts on the page, and the session ends when you sign out or after a period of inactivity.',
            'A security cookie that protects the forms you submit against forged requests.',
          ]}
        />
        <p>We do not use analytics, advertising or tracking cookies.</p>
      </LegalSection>

      <LegalSection title="7. How we protect your data">
        <LegalList
          items={[
            'Passwords are stored hashed and are never visible to staff.',
            'Access to every record is limited by role and checked on the server.',
            'Repeated failed sign-in attempts are slowed down.',
            'When a password is changed, your other signed-in devices are signed out.',
          ]}
        />
        <p>
          No system is perfectly secure. If a data breach affects your rights, we will inform you
          and the authorities as the law requires.
        </p>
      </LegalSection>

      <LegalSection title="8. Your rights">
        <p>You have the right to:</p>
        <LegalList
          items={[
            'see the personal data we hold about you and receive a copy',
            'have incorrect data corrected (you can edit your contact details in your profile)',
            'ask us to erase your data, although we may have to keep medical and billing records because the law requires it',
            'ask us to restrict the use of your data, or object to it',
            'receive your data in a commonly used format',
          ]}
        />
        <p>
          To use any of these rights, contact us using the details in section 1. You also have the
          right to complain to the data protection authority in your country.
        </p>
      </LegalSection>

      <LegalSection title="9. Children">
        <p>
          If you book or manage care for a child, please do so as a parent or legal guardian. We
          ask for a parent or guardian to act on behalf of young children.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to this policy">
        <p>
          We may update this policy from time to time. The date at the top shows when it last
          changed. If we make an important change, we will tell you through the portal or by other
          means.
        </p>
      </LegalSection>
    </LegalPage>
  );
}