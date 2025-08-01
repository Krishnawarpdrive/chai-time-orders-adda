
export interface Staff {
  id: string;
  outlet_id?: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  date_of_birth?: string;
  hire_date: string;
  position: string;
  department?: string;
  salary?: number;
  status: 'active' | 'inactive' | 'terminated';
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  bank_account_number?: string;
  bank_name?: string;
  bank_routing_number?: string;
  working_days?: string;
  shift_start_time?: string;
  shift_end_time?: string;
  created_at: string;
  updated_at: string;
}

export interface StaffPerformance {
  id: string;
  staff_id?: string;
  date: string;
  products_sold?: number;
  total_sales?: number;
  orders_completed?: number;
  customer_rating?: number;
  shift_hours?: number;
  working_days_count?: number;
  created_at: string;
  updated_at: string;
}

export interface StaffWithPerformance extends Staff {
  performance?: StaffPerformance;
}

export interface CreateStaffData {
  employee_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  date_of_birth?: string;
  hire_date?: string;
  position: string;
  department?: string;
  salary?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  bank_account_number?: string;
  bank_name?: string;
  bank_routing_number?: string;
  working_days?: string;
  shift_start_time?: string;
  shift_end_time?: string;
  outlet_id?: string;
}
