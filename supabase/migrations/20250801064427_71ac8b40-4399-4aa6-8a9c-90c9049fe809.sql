
-- Create outlets table for franchise locations
CREATE TABLE public.outlets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  franchise_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor_products table for products available from vendors
CREATE TABLE public.vendor_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  inventory_item_id UUID REFERENCES public.inventory(id) ON DELETE CASCADE NOT NULL,
  vendor_price DECIMAL(10,2) NOT NULL,
  minimum_order_quantity INTEGER DEFAULT 1,
  lead_time_days INTEGER DEFAULT 7,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, inventory_item_id)
);

-- Create purchase_orders table
CREATE TABLE public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  po_number TEXT NOT NULL UNIQUE,
  outlet_id UUID REFERENCES public.outlets(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  franchise_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'confirmed', 'partially_delivered', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) DEFAULT 0,
  order_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expected_delivery_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase_order_items table
CREATE TABLE public.purchase_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE CASCADE NOT NULL,
  inventory_item_id UUID REFERENCES public.inventory(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deliveries table
CREATE TABLE public.deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  delivery_number TEXT NOT NULL UNIQUE,
  purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  outlet_id UUID REFERENCES public.outlets(id) ON DELETE CASCADE NOT NULL,
  delivery_date TIMESTAMP WITH TIME ZONE,
  received_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_transit', 'delivered', 'received', 'cancelled')),
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delivery_items table
CREATE TABLE public.delivery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  delivery_id UUID REFERENCES public.deliveries(id) ON DELETE CASCADE NOT NULL,
  inventory_item_id UUID REFERENCES public.inventory(id) ON DELETE CASCADE NOT NULL,
  ordered_quantity INTEGER NOT NULL,
  delivered_quantity INTEGER DEFAULT 0,
  received_quantity INTEGER DEFAULT 0,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update user_roles enum to include new roles
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'franchise_owner';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'vendor';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'brand_owner';

-- Add outlet_id to inventory_requests table
ALTER TABLE public.inventory_requests 
ADD COLUMN outlet_id UUID REFERENCES public.outlets(id) ON DELETE CASCADE,
ADD COLUMN franchise_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE SET NULL;

-- Add outlet_id to inventory table for outlet-specific inventory
ALTER TABLE public.inventory 
ADD COLUMN outlet_id UUID REFERENCES public.outlets(id) ON DELETE CASCADE;

-- Enable RLS on new tables
ALTER TABLE public.outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for outlets
CREATE POLICY "Franchise owners can manage their outlets" 
  ON public.outlets 
  FOR ALL 
  USING (auth.uid() = franchise_owner_id);

CREATE POLICY "Brand owners can view all outlets" 
  ON public.outlets 
  FOR SELECT 
  USING (has_role('brand_owner'));

CREATE POLICY "Staff can view their outlet" 
  ON public.outlets 
  FOR SELECT 
  USING (
    id IN (
      SELECT outlet_id 
      FROM public.inventory_requests 
      WHERE inventory_requests.inventory_item_id IN (
        SELECT id FROM public.inventory WHERE outlet_id = outlets.id
      )
    )
  );

-- RLS policies for vendors
CREATE POLICY "Vendors can manage their own data" 
  ON public.vendors 
  FOR ALL 
  USING (true); -- Vendors will be managed by brand owners initially

CREATE POLICY "Franchise owners can view vendors" 
  ON public.vendors 
  FOR SELECT 
  USING (has_role('franchise_owner') OR has_role('brand_owner'));

-- RLS policies for vendor_products
CREATE POLICY "Vendors can manage their products" 
  ON public.vendor_products 
  FOR ALL 
  USING (true); -- Will be refined based on vendor user implementation

CREATE POLICY "Franchise owners can view vendor products" 
  ON public.vendor_products 
  FOR SELECT 
  USING (has_role('franchise_owner') OR has_role('brand_owner'));

-- RLS policies for purchase_orders
CREATE POLICY "Franchise owners can manage their purchase orders" 
  ON public.purchase_orders 
  FOR ALL 
  USING (auth.uid() = franchise_owner_id);

CREATE POLICY "Brand owners can view all purchase orders" 
  ON public.purchase_orders 
  FOR SELECT 
  USING (has_role('brand_owner'));

CREATE POLICY "Vendors can view their purchase orders" 
  ON public.purchase_orders 
  FOR SELECT 
  USING (
    vendor_id IN (
      SELECT id FROM public.vendors 
      WHERE vendors.id = purchase_orders.vendor_id
    )
  );

-- RLS policies for purchase_order_items
CREATE POLICY "Users can access purchase order items based on purchase order access" 
  ON public.purchase_order_items 
  FOR ALL 
  USING (
    purchase_order_id IN (
      SELECT id FROM public.purchase_orders 
      WHERE purchase_orders.franchise_owner_id = auth.uid() 
      OR has_role('brand_owner')
    )
  );

-- RLS policies for deliveries
CREATE POLICY "Franchise owners can manage their deliveries" 
  ON public.deliveries 
  FOR ALL 
  USING (
    outlet_id IN (
      SELECT id FROM public.outlets 
      WHERE outlets.franchise_owner_id = auth.uid()
    )
  );

CREATE POLICY "Brand owners can view all deliveries" 
  ON public.deliveries 
  FOR SELECT 
  USING (has_role('brand_owner'));

CREATE POLICY "Vendors can manage their deliveries" 
  ON public.deliveries 
  FOR ALL 
  USING (
    vendor_id IN (
      SELECT id FROM public.vendors 
      WHERE vendors.id = deliveries.vendor_id
    )
  );

-- RLS policies for delivery_items
CREATE POLICY "Users can access delivery items based on delivery access" 
  ON public.delivery_items 
  FOR ALL 
  USING (
    delivery_id IN (
      SELECT id FROM public.deliveries 
      WHERE deliveries.outlet_id IN (
        SELECT id FROM public.outlets 
        WHERE outlets.franchise_owner_id = auth.uid()
      ) 
      OR has_role('brand_owner')
    )
  );

-- Create indexes for performance
CREATE INDEX idx_outlets_franchise_owner ON public.outlets(franchise_owner_id);
CREATE INDEX idx_vendor_products_vendor ON public.vendor_products(vendor_id);
CREATE INDEX idx_vendor_products_inventory ON public.vendor_products(inventory_item_id);
CREATE INDEX idx_purchase_orders_outlet ON public.purchase_orders(outlet_id);
CREATE INDEX idx_purchase_orders_vendor ON public.purchase_orders(vendor_id);
CREATE INDEX idx_purchase_orders_franchise_owner ON public.purchase_orders(franchise_owner_id);
CREATE INDEX idx_deliveries_purchase_order ON public.deliveries(purchase_order_id);
CREATE INDEX idx_deliveries_outlet ON public.deliveries(outlet_id);
CREATE INDEX idx_inventory_requests_outlet ON public.inventory_requests(outlet_id);
CREATE INDEX idx_inventory_outlet ON public.inventory(outlet_id);

-- Function to auto-generate PO numbers
CREATE OR REPLACE FUNCTION generate_po_number() 
RETURNS TEXT AS $$
DECLARE
    po_number TEXT;
BEGIN
    po_number := 'PO-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('po_sequence')::TEXT, 4, '0');
    RETURN po_number;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for PO numbers
CREATE SEQUENCE IF NOT EXISTS po_sequence START 1;

-- Function to auto-generate delivery numbers
CREATE OR REPLACE FUNCTION generate_delivery_number() 
RETURNS TEXT AS $$
DECLARE
    delivery_number TEXT;
BEGIN
    delivery_number := 'DEL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('delivery_sequence')::TEXT, 4, '0');
    RETURN delivery_number;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for delivery numbers
CREATE SEQUENCE IF NOT EXISTS delivery_sequence START 1;

-- Update purchase orders to auto-generate PO numbers
ALTER TABLE public.purchase_orders 
ALTER COLUMN po_number SET DEFAULT generate_po_number();

-- Update deliveries to auto-generate delivery numbers
ALTER TABLE public.deliveries 
ALTER COLUMN delivery_number SET DEFAULT generate_delivery_number();
