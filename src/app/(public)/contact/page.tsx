'use client';

import { useState } from 'react';
import Link from 'next/link';

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialForm: ContactForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const CLINIC_INFO = [
  {
    icon: '📍',
    label: 'Address',
    value: 'Hoofdstraat 12, 1234 AB Amsterdam',
    href: 'https://maps.google.com/?q=Hoofdstraat+12+Amsterdam',
  },
  {
    icon: '📞',
    label: 'Phone',
    value: '+31 20 123 4567',
    href: 'tel:+31201234567',
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'info@dentalcare.nl',
    href: 'mailto:info@dentalcare.nl',
  },
  {
    icon: '🕐',
    label: 'Working Hours',
    value: 'Mon–Fri: 08:00–17:00\nFri: 08:00–15:00\nWeekends: Closed',
    href: null,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? 'Failed to send message. Please try again.');
      }

      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Contact Us
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            We`d Love to Hear<br className="hidden sm:block" /> From You
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Have a question, need to reschedule, or want to learn more about our services? Reach out and we`ll get back to you shortly.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Clinic info */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Clinic Information</h2>
            {CLINIC_INFO.map((info) => (
              <div
                key={info.label}
                className="bg-white border border-gray-200 rounded-2xl p-5 flex gap-4"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    {info.label}
                  </p>
                  {info.href ? (
                    <Link
                      href={info.href}
                      target={info.href.startsWith('http') ? '_blank' : undefined}
                      rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm text-blue-700 hover:text-blue-900 font-medium transition-colors whitespace-pre-line"
                    >
                      {info.value}
                    </Link>
                  ) : (
                    <p className="text-sm text-gray-700 whitespace-pre-line">{info.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Send Us a Message</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    ✅
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Thank you for reaching out. We`ll get back to you within one business day.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-blue-700 hover:text-blue-900 font-medium transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Emma Johnson"
                        className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="emma@example.com"
                        className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+31 6 12345678"
                      className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                      <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    We typically respond within one business day.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}