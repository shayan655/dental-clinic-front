import { User, Role } from '@/types';
import { api } from '@/lib/api';

// Fetch the currently authenticated user from Laravel
// Returns null if not logged in
// export async function getAuthUser(): Promise<User | null> {
//   try {
//     const response = await api.get<{ data: User }>('/api/user');
//     return response.data;
//   } catch {
//     return null;
//   }
// }

export async function getAuthUser(): Promise<User | null> {
  try {
    const response = await api.get<{ data: User }>('/api/user');
    return response.data;
  } catch {
    // DEV ONLY: return a mock user when Laravel is unreachable
    if (process.env.NODE_ENV === 'development') {
      return {
        id: 1,
        name: 'Shayan Rahmati',
        email: 'shayan@clinic.com',
        role: 'clinic_manager',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    return null;
  }
}

// Check if a user has a specific role
export function hasRole(user: User, role: Role): boolean {
  return user.role === role;
}

// Check if a user has any of the given roles
export function hasAnyRole(user: User, roles: Role[]): boolean {
  return roles.includes(user.role);
}

// Role-based helper shortcuts
export const can = {
  manageStaff: (user: User) =>
    hasAnyRole(user, ['super_admin', 'clinic_manager']),

  manageSettings: (user: User) =>
    hasAnyRole(user, ['super_admin', 'clinic_manager']),

  viewAllAppointments: (user: User) =>
    hasAnyRole(user, ['super_admin', 'clinic_manager']),

  managePatients: (user: User) =>
    hasAnyRole(user, ['super_admin', 'clinic_manager', 'receptionist']),

  viewMedicalRecords: (user: User) =>
    hasAnyRole(user, ['doctor', 'patient']),

  handleBilling: (user: User) =>
    hasAnyRole(user, ['super_admin', 'clinic_manager', 'receptionist']),
};