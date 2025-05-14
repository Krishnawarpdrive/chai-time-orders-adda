
export interface InventoryItemBase {
  name: string;
  quantity: number;
  reorder_level: number;
  price_per_unit: number;
  unit: string;
  category?: string;
}

export interface InventoryItem extends InventoryItemBase {
  id: string;
  created_at: string;
  updated_at: string;
  last_restocked?: string;
}

export interface InventoryRequestBase {
  inventory_item_id: string;
  staff_entered_quantity: number;
  requested_quantity: number;
  notes?: string;
  status: InventoryRequestStatus;
}

export interface InventoryRequest extends InventoryRequestBase {
  id: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by_user_id?: string;
  rejected_reason?: string;
  inventory_item?: InventoryItem;
}

export type InventoryRequestStatus = 
  | 'pending'
  | 'approved'
  | 'rejected';

export interface InventoryRequestHistoryEntry {
  id: string;
  inventory_request_id: string;
  previous_status: InventoryRequestStatus;
  new_status: InventoryRequestStatus;
  notes?: string;
  created_at: string;
  user_id?: string;
}
