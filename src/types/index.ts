// ============================================================
// USERS & AUTH
// ============================================================

export type Role =
  | 'super_admin'
  | 'clinic_manager'
  | 'doctor'
  | 'receptionist'
  | 'patient';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

// ============================================================
// PATIENTS
// ============================================================

export interface Patient {
  id: number;
  user_id: number | null; // null if staff-created, not yet claimed
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// APPOINTMENTS
// ============================================================

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  service_id: number;
  status: AppointmentStatus;
  scheduled_at: string;
  notes: string | null;
  patient?: Patient;
  doctor?: User;
  service?: Service;
  created_at: string;
  updated_at: string;
}

// ============================================================
// SERVICES
// ============================================================

export interface Service {
  id: number;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  created_at: string;
  updated_at: string;
}

// ============================================================
// MEDICAL RECORDS (doctor <-> patient only)
// ============================================================

export interface MedicalRecord {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_id: number | null;
  diagnosis: string;
  treatment: string;
  prescription: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// INVOICES
// ============================================================

export type InvoiceStatus = 'pending' | 'paid' | 'cancelled';

export interface Invoice {
  id: number;
  patient_id: number;
  appointment_id: number | null;
  amount: number;
  status: InvoiceStatus;
  issued_at: string;
  paid_at: string | null;
  patient?: Patient;
  created_at: string;
  updated_at: string;
}

// ============================================================
// API RESPONSES
// ============================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ============================================================
// Dashboard types
// ============================================================

export type DashboardStats = {
  appointmentsToday: number
  totalPatients: number
  pendingInvoices: number
  doctorsOnDuty: number
}

export type DashboardAppointment = {
  id: number
  patientName: string
  time: string
  service: string
  status: AppointmentStatus
}

export type DashboardData = {
  stats: DashboardStats
  todaysAppointments: DashboardAppointment[]
}

export type DoctorStats = {
  myAppointmentsToday: number
  myTotalPatients: number
  completedToday: number
  pendingToday: number
}

export type DoctorDashboardData = {
  stats: DoctorStats
  todaysAppointments: DashboardAppointment[]
}

export type ReceptionistStats = {
  appointmentsToday: number
  checkedInCount: number
  pendingInvoices: number
  newPatientsToday: number
}

export type ReceptionistDashboardData = {
  stats: ReceptionistStats
  todaysAppointments: DashboardAppointment[]
}

export type PatientUpcomingAppointment = {
  id: number
  date: string
  time: string
  service: string
  doctorName: string
  status: AppointmentStatus
}

export type PatientRecentVisit = {
  id: number
  date: string
  service: string
  notes: string
}

export type PatientDashboardData = {
  nextAppointment: PatientUpcomingAppointment | null
  recentVisits: PatientRecentVisit[]
}