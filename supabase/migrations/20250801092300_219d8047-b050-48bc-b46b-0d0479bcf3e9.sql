
-- Add working_days, shift_start_time, and shift_end_time to the staff table
ALTER TABLE public.staff 
ADD COLUMN working_days text DEFAULT 'Monday-Friday',
ADD COLUMN shift_start_time time DEFAULT '09:00:00',
ADD COLUMN shift_end_time time DEFAULT '17:00:00';

-- Update the staff_performance table to ensure we have the fields we need
-- (products_sold and total_sales already exist, but let's make sure working_days is tracked there too)
ALTER TABLE public.staff_performance 
ADD COLUMN working_days_count integer DEFAULT 0;
