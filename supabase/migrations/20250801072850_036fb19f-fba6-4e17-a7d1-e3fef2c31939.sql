
-- Create staff table
CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  outlet_id UUID REFERENCES public.outlets(id),
  employee_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  position TEXT NOT NULL,
  department TEXT,
  salary NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  address TEXT,
  bank_account_number TEXT,
  bank_name TEXT,
  bank_routing_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create staff performance metrics table
CREATE TABLE public.staff_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  products_sold INTEGER DEFAULT 0,
  total_sales NUMERIC(10,2) DEFAULT 0,
  orders_completed INTEGER DEFAULT 0,
  customer_rating NUMERIC(2,1) DEFAULT 0 CHECK (customer_rating >= 0 AND customer_rating <= 5),
  shift_hours NUMERIC(4,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(staff_id, date)
);

-- Enable RLS on both tables
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_performance ENABLE ROW LEVEL SECURITY;

-- RLS policies for staff table
CREATE POLICY "Authenticated users can view staff" 
  ON public.staff 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create staff" 
  ON public.staff 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update staff" 
  ON public.staff 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- RLS policies for staff performance table
CREATE POLICY "Authenticated users can view staff performance" 
  ON public.staff_performance 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create staff performance" 
  ON public.staff_performance 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update staff performance" 
  ON public.staff_performance 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Insert some sample staff data
INSERT INTO public.staff (
  employee_id, first_name, last_name, email, phone, position, department, salary, status
) VALUES 
('EMP001', 'John', 'Smith', 'john.smith@coasters.com', '+1234567890', 'Barista', 'Operations', 35000.00, 'active'),
('EMP002', 'Sarah', 'Johnson', 'sarah.johnson@coasters.com', '+1234567891', 'Shift Manager', 'Operations', 45000.00, 'active'),
('EMP003', 'Mike', 'Davis', 'mike.davis@coasters.com', '+1234567892', 'Cashier', 'Operations', 32000.00, 'active'),
('EMP004', 'Emily', 'Brown', 'emily.brown@coasters.com', '+1234567893', 'Assistant Manager', 'Operations', 50000.00, 'active'),
('EMP005', 'David', 'Wilson', 'david.wilson@coasters.com', '+1234567894', 'Kitchen Staff', 'Kitchen', 33000.00, 'active');

-- Insert sample performance data
INSERT INTO public.staff_performance (
  staff_id, date, products_sold, total_sales, orders_completed, customer_rating, shift_hours
) VALUES 
((SELECT id FROM public.staff WHERE employee_id = 'EMP001'), CURRENT_DATE, 45, 1250.00, 32, 4.8, 8.0),
((SELECT id FROM public.staff WHERE employee_id = 'EMP002'), CURRENT_DATE, 38, 980.00, 28, 4.6, 8.0),
((SELECT id FROM public.staff WHERE employee_id = 'EMP003'), CURRENT_DATE, 52, 1150.00, 38, 4.9, 8.0),
((SELECT id FROM public.staff WHERE employee_id = 'EMP004'), CURRENT_DATE, 29, 750.00, 22, 4.5, 8.0),
((SELECT id FROM public.staff WHERE employee_id = 'EMP005'), CURRENT_DATE, 0, 0.00, 25, 4.7, 8.0),
((SELECT id FROM public.staff WHERE employee_id = 'EMP001'), CURRENT_DATE - INTERVAL '1 day', 42, 1180.00, 30, 4.7, 8.0),
((SELECT id FROM public.staff WHERE employee_id = 'EMP002'), CURRENT_DATE - INTERVAL '1 day', 35, 920.00, 26, 4.5, 8.0),
((SELECT id FROM public.staff WHERE employee_id = 'EMP003'), CURRENT_DATE - INTERVAL '1 day', 48, 1080.00, 35, 4.8, 8.0);
