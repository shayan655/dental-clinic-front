import type { Metadata } from 'next';
import LegalPage, { ClinicContact, LegalList, LegalSection } from '@/components/legal/LegalPage';
import { getClinicInfo } from '@/lib/clinic';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Terms of Service' };

const UPDATED = '13 November 2026';

export default async function TermsPage() {
  const clinic = await getClinicInfo();

  return (
    <LegalPage
      title="Terms of Service"
      intro="The rules for using our website and patient portal."
      updated={UPDATED}
    >
      <LegalSection title="1. About these terms">
        <p>
          These terms apply when you use the website and patient portal of the clinic below. By
          creating an account or using the portal, you agree to them. If you do not agree, please
          do not use the portal and contact the clinic directly instead.
        </p>
        <ClinicContact clinic={clinic} />
        <p>
          How we handle your personal data is explained in our{' '}
          <Link href="/privacy" className="text-blue-700 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Your account">
        <LegalList
          items={[
            'Patients can register themselves, or the clinic can create a profile or login for you.',
            'If the clinic gave you a temporary password, please change it in your profile the first time you sign in.',
            'Give us accurate details and keep them up to date.',
            'Keep your password confidential and do not share your account. You are responsible for what happens under your account.',
            'Tell us straight away if you think someone else has used your account.',
            'We may suspend an account that is misused, or that we need to protect for security reasons.',
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Appointments">
        <LegalList
          items={[
            'Appointments depend on availability and on the clinic’s opening hours, which are shown when you book.',
            'An appointment you book yourself starts as pending until the clinic confirms it. Appointments booked by the clinic are confirmed straight away.',
            'You can cancel a pending or confirmed appointment in the portal. For anything else, such as changing the time, please contact the clinic.',
            'The clinic may have to change or cancel an appointment, for example when a dentist is unavailable, and will try to offer you another time.',
            'Please arrive on time. The clinic may apply its own cancellation policy, which it will communicate to you.',
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Invoices and payment">
        <p>
          After a treatment, the clinic issues an invoice that you can view in the portal. Payment
          is made in person at the clinic, and the portal only shows whether an invoice is pending,
          paid or cancelled. Online payment is not available.
        </p>
      </LegalSection>

      <LegalSection title="5. Dental emergencies">
        <p>
          The portal is not an emergency service. If you have severe pain, swelling that is
          spreading, bleeding that does not stop, an injury to your face or teeth, or difficulty
          breathing or swallowing, call the clinic directly or your local emergency number. Do not
          wait for a reply through the portal.
        </p>
      </LegalSection>

      <LegalSection title="6. Medical information">
        <p>
          The records you see in the portal are provided for your information. They do not replace
          advice from your dentist. If you have questions about a diagnosis, treatment or
          prescription, ask your dentist.
        </p>
      </LegalSection>

      <LegalSection title="7. Acceptable use">
        <p>You agree not to:</p>
        <LegalList
          items={[
            'try to access accounts, records or parts of the portal that are not yours',
            'give false information or pretend to be someone else',
            'disrupt or overload the portal, or try to bypass its security',
            'use automated tools to book appointments or collect data',
          ]}
        />
      </LegalSection>

      <LegalSection title="8. Availability">
        <p>
          We work to keep the portal available, but we cannot promise it will always run without
          interruption. It may be unavailable for maintenance or because of problems outside our
          control. You can always contact the clinic by phone or in person.
        </p>
      </LegalSection>

      <LegalSection title="9. Liability">
        <p>
          To the extent the law allows, the clinic is not liable for loss caused by the portal
          being unavailable, or by information you entered incorrectly. Nothing in these terms
          limits liability that cannot be limited by law, including liability for death or personal
          injury caused by negligence, or for intentional wrongdoing. These terms do not affect
          your rights as a patient or consumer.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to these terms">
        <p>
          We may update these terms. The date at the top shows the latest version. If you keep
          using the portal after a change, you accept the new terms. We will tell you about
          important changes.
        </p>
      </LegalSection>

      <LegalSection title="11. Governing law and contact">
        <p>
          These terms are governed by the law that applies where the clinic is established, and
          disputes are handled by the courts there, unless mandatory consumer law says otherwise.
          Questions about these terms can be sent to the clinic using the details in section 1.
        </p>
      </LegalSection>
    </LegalPage>
  );
}