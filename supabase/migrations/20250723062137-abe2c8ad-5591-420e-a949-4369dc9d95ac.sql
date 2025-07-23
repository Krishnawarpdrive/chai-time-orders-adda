
-- Enable Row Level Security on the inventory table
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read inventory data
CREATE POLICY "Everyone can view inventory" 
ON public.inventory 
FOR SELECT 
USING (true);

-- Create policy to allow authenticated users to update inventory
CREATE POLICY "Authenticated users can update inventory" 
ON public.inventory 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create policy to allow authenticated users to insert inventory items
CREATE POLICY "Authenticated users can create inventory items" 
ON public.inventory 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Enable realtime for inventory table
ALTER TABLE public.inventory REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.inventory;
