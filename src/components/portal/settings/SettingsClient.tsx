'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClinicSettings, ClinicService, WorkingDay } from '@/app/portal/settings/page';
import { api, ApiError } from '@/lib/api';

interface Props {
  settings: ClinicSettings;
  workingHours: WorkingDay[];
  services: ClinicService[];
}

type ServiceForm = {
  name: string;
  duration_minutes: string;
  price: string;
};

const emptyServiceForm: ServiceForm = {
  name: '',
  duration_minutes: '',
  price: '',
};

export default function SettingsClient({ settings, workingHours, services }: Props) {
  const router = useRouter();

  // General info state
  const [infoForm, setInfoForm] = useState<ClinicSettings>(settings);
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoError, setInfoError] = useState<string | null>(null);
  const [infoSaved, setInfoSaved] = useState(false);

  // Working hours state
  const [hours, setHours] = useState<WorkingDay[]>(workingHours);
  const [hoursLoading, setHoursLoading] = useState(false);
  const [hoursError, setHoursError] = useState<string | null>(null);
  const [hoursSaved, setHoursSaved] = useState(false);

  // Services state
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editServiceForm, setEditServiceForm] = useState<ServiceForm>(emptyServiceForm);
  const [showCreateService, setShowCreateService] = useState(false);
  const [createServiceForm, setCreateServiceForm] = useState<ServiceForm>(emptyServiceForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  function errorMessage(err: unknown, fallback: string) {
    if (err instanceof ApiError) {
      const firstFieldError = err.errors ? Object.values(err.errors)[0]?.[0] : null;
      return firstFieldError ?? err.message;
    }
    return err instanceof Error ? err.message : fallback;
  }

  // General info handlers
  function handleInfoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInfoForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInfoLoading(true);
    setInfoError(null);
    try {
      await api.put('/api/settings', infoForm);
      setEditingInfo(false);
      setInfoSaved(true);
      setTimeout(() => setInfoSaved(false), 3000);
      router.refresh();
    } catch (err) {
      setInfoError(errorMessage(err, 'Failed to update settings.'));
    } finally {
      setInfoLoading(false);
    }
  }

  // Working hours handlers
  function handleHoursChange(index: number, field: keyof WorkingDay, value: string | boolean) {
    setHours((prev) =>
      prev.map((day, i) => (i === index ? { ...day, [field]: value } : day))
    );
  }

  async function handleHoursSubmit(e: React.FormEvent) {
    try {
      await api.put('/api/settings/hours', { hours });
      setHoursSaved(true);
      setTimeout(() => setHoursSaved(false), 3000);
      router.refresh();
    } catch (err) {
      setHoursError(errorMessage(err, 'Failed to update working hours.'));
    } finally {
      setHoursLoading(false);
    }
  }

  // Service handlers
  function handleEditServiceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditServiceForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleCreateServiceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCreateServiceForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function startEditingService(service: ClinicService) {
    setEditingServiceId(service.id);
    setEditServiceForm({
      name: service.name,
      duration_minutes: String(service.duration_minutes),
      price: service.price,
    });
    setServiceError(null);
  }

  async function handleEditServiceSubmit(e: React.FormEvent, serviceId: number) {
    e.preventDefault();
    setServiceLoading(true);
    setServiceError(null);
    try {
      await api.put(`/api/services/${serviceId}`, {
        name: editServiceForm.name,
        duration_minutes: Number(editServiceForm.duration_minutes),
        price: editServiceForm.price,
      });
      setEditingServiceId(null);
      router.refresh();
    } catch (err) {
      setServiceError(errorMessage(err, 'Failed to update service.'));
    } finally {
      setServiceLoading(false);
    }
  }

  async function handleCreateServiceSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServiceLoading(true);
    setServiceError(null);
    try {
      await api.post('/api/services', {
      name: createServiceForm.name,
      duration_minutes: Number(createServiceForm.duration_minutes),
      price: createServiceForm.price,
    });
    setShowCreateService(false);
    setCreateServiceForm(emptyServiceForm);
    router.refresh();
    } catch (err) {
      setServiceError(errorMessage(err, 'Failed to create service.'));
    } finally {
      setServiceLoading(false);
    }
  }

  async function handleDeleteService(serviceId: number) {
    setServiceLoading(true);
    setServiceError(null);
    try {
      await api.delete(`/api/services/${serviceId}`);
      setDeleteConfirmId(null);
      router.refresh();
    } catch (err) {
      setServiceError(errorMessage(err, 'Failed to delete service.'));
    } finally {
      setServiceLoading(false);
    }
  }

  return (
    <div className="space-y-8">

      {/* ── General Info ── */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">General Information</p>
          {!editingInfo && (
            <button
              onClick={() => { setEditingInfo(true); setInfoError(null); }}
              className="text-sm text-blue-700 hover:text-blue-900 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Edit
            </button>
          )}
          {infoSaved && (
            <span className="text-sm text-green-600 font-medium">Saved.</span>
          )}
        </div>

        {!editingInfo ? (
          <dl className="divide-y divide-gray-100">
            <Row label="Clinic Name">{settings.name}</Row>
            <Row label="Address">{settings.address}</Row>
            <Row label="Phone">{settings.phone}</Row>
            <Row label="Email">{settings.email}</Row>
          </dl>
        ) : (
          <form onSubmit={handleInfoSubmit} className="px-6 py-5 space-y-4">
            {[
              { label: 'Clinic Name', name: 'name', type: 'text' },
              { label: 'Address',     name: 'address', type: 'text' },
              { label: 'Phone',       name: 'phone', type: 'tel' },
              { label: 'Email',       name: 'email', type: 'email' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={infoForm[field.name as keyof ClinicSettings]}
                  onChange={handleInfoChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            {infoError && <ErrorBox message={infoError} />}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={infoLoading}
                className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                {infoLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => { setEditingInfo(false); setInfoForm(settings); setInfoError(null); }}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Discard
              </button>
            </div>
          </form>
        )}
      </section>

      {/* ── Working Hours ── */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Working Hours</p>
          {hoursSaved && (
            <span className="text-sm text-green-600 font-medium">Saved.</span>
          )}
        </div>
        <form onSubmit={handleHoursSubmit} className="px-6 py-5 space-y-3">
          {hours.map((day, index) => (
            <div key={day.day} className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Day toggle */}
              <div className="flex items-center gap-3 w-36 shrink-0">
                <button
                  type="button"
                  onClick={() => handleHoursChange(index, 'is_open', !day.is_open)}
                  className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
                    day.is_open ? 'bg-blue-700' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      day.is_open ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${day.is_open ? 'text-gray-900' : 'text-gray-400'}`}>
                  {day.day}
                </span>
              </div>

              {/* Time inputs */}
              {day.is_open ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={day.open_time}
                    onChange={(e) => handleHoursChange(index, 'open_time', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-400 text-sm">to</span>
                  <input
                    type="time"
                    value={day.close_time}
                    onChange={(e) => handleHoursChange(index, 'close_time', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-400 italic">Closed</span>
              )}
            </div>
          ))}

          {hoursError && <ErrorBox message={hoursError} />}

          <div className="pt-3">
            <button
              type="submit"
              disabled={hoursLoading}
              className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              {hoursLoading ? 'Saving...' : 'Save Hours'}
            </button>
          </div>
        </form>
      </section>

      {/* ── Services ── */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Services</p>
          {!showCreateService && (
            <button
              onClick={() => { setShowCreateService(true); setServiceError(null); }}
              className="text-sm text-blue-700 hover:text-blue-900 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              + Add Service
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-100">

          {/* Create service form */}
          {showCreateService && (
            <div className="px-6 py-5 bg-blue-50">
              <p className="text-sm font-semibold text-gray-700 mb-4">New Service</p>
              <form onSubmit={handleCreateServiceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={createServiceForm.name}
                      onChange={handleCreateServiceChange}
                      required
                      placeholder="e.g. Root Canal"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (min) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="duration_minutes"
                      value={createServiceForm.duration_minutes}
                      onChange={handleCreateServiceChange}
                      required
                      min={5}
                      placeholder="60"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (€) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={createServiceForm.price}
                      onChange={handleCreateServiceChange}
                      required
                      min={0}
                      step="0.01"
                      placeholder="150.00"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {serviceError && <ErrorBox message={serviceError} />}
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={serviceLoading}
                    className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                  >
                    {serviceLoading ? 'Adding...' : 'Add Service'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowCreateService(false); setCreateServiceForm(emptyServiceForm); setServiceError(null); }}
                    className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Discard
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Services list */}
          {services.map((service) => {
            const isEditing = editingServiceId === service.id;
            const isConfirmingDelete = deleteConfirmId === service.id;

            return (
              <div key={service.id} className="px-6 py-4">
                {!isEditing ? (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {service.duration_minutes} min · €{service.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditingService(service)}
                        className="text-sm text-blue-700 hover:text-blue-900 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Edit
                      </button>
                      {!isConfirmingDelete ? (
                        <button
                          onClick={() => setDeleteConfirmId(service.id)}
                          className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Sure?</span>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            disabled={serviceLoading}
                            className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {serviceLoading ? 'Deleting...' : 'Yes, delete'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleEditServiceSubmit(e, service.id)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editServiceForm.name}
                          onChange={handleEditServiceChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration (min) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="duration_minutes"
                          value={editServiceForm.duration_minutes}
                          onChange={handleEditServiceChange}
                          required
                          min={5}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (€) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={editServiceForm.price}
                          onChange={handleEditServiceChange}
                          required
                          min={0}
                          step="0.01"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    {serviceError && <ErrorBox message={serviceError} />}
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={serviceLoading}
                        className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                      >
                        {serviceLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditingServiceId(null); setServiceError(null); }}
                        className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Discard
                      </button>
                    </div>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-3 flex items-center justify-between gap-4">
      <dt className="text-sm text-gray-500 shrink-0">{label}</dt>
      <dd className="text-sm font-medium text-gray-900 text-right">{children}</dd>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
      <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
      </svg>
      {message}
    </div>
  );
}