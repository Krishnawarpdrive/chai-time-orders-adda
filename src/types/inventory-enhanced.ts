
// Enhanced types for the new inventory management system
export interface Outlet {
  id: string;
  name: string;
  franchise_owner_id: string;
  address?: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface VendorProduct {
  id: string;
  vendor_id: string;
  inventory_item_id: string;
  vendor_price: number;
  minimum_order_quantity: number;
  lead_time_days: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  vendor?: Vendor;
  inventory_item?: {
    id: string;
    name: string;
    unit: string;
    category: string;
  };
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  outlet_id: string;
  vendor_id: string;
  franchise_owner_id: string;
  status: 'pending' | 'sent' | 'confirmed' | 'partially_delivered' | 'delivered' | 'cancelled';
  total_amount: number;
  order_date: string;
  expected_delivery_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  outlet?: Outlet;
  vendor?: Vendor;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  inventory_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  inventory_item?: {
    id: string;
    name: string;
    unit: string;
    category: string;
  };
}

export interface Delivery {
  id: string;
  delivery_number: string;
  purchase_order_id: string;
  vendor_id: string;
  outlet_id: string;
  delivery_date?: string;
  received_date?: string;
  status: 'scheduled' | 'in_transit' | 'delivered' | 'received' | 'cancelled';
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  purchase_order?: PurchaseOrder;
  vendor?: Vendor;
  outlet?: Outlet;
  items?: DeliveryItem[];
}

export interface DeliveryItem {
  id: string;
  delivery_id: string;
  inventory_item_id: string;
  ordered_quantity: number;
  delivered_quantity: number;
  received_quantity: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
  inventory_item?: {
    id: string;
    name: string;
    unit: string;
    category: string;
  };
}

export interface EnhancedInventoryRequest {
  id: string;
  inventory_item_id: string;
  staff_entered_quantity: number;
  requested_quantity: number;
  status: 'pending' | 'approved' | 'rejected' | 'converted_to_po';
  notes?: string;
  rejected_reason?: string;
  outlet_id?: string;
  franchise_owner_id?: string;
  purchase_order_id?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by_user_id?: string;
  inventory_item?: {
    id: string;
    name: string;
    unit: string;
    category: string;
    quantity: number;
    reorder_level: number;
  };
  outlet?: Outlet;
  purchase_order?: PurchaseOrder;
}
