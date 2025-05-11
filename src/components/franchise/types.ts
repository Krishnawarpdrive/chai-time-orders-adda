
export interface OutletMetrics {
  id: string;
  name: string;
  location: string;
  orderVolume: number;
  pendingOrders: number;
  completedOrders: number;
  inventoryStatus: 'Good' | 'Warning' | 'Critical';
  customerRating: number;
  hasScheduledAudit: boolean;
  lastAuditDate: string;
  auditScore?: number;
}

export const mockOutletData: OutletMetrics[] = [
  {
    id: '1',
    name: 'Coasters Indiranagar',
    location: 'Indiranagar, Bangalore',
    orderVolume: 145,
    pendingOrders: 12,
    completedOrders: 133,
    inventoryStatus: 'Good',
    customerRating: 4.7,
    hasScheduledAudit: true,
    lastAuditDate: '2025-04-02',
    auditScore: 92
  },
  {
    id: '2',
    name: 'Coasters Koramangala',
    location: 'Koramangala, Bangalore',
    orderVolume: 98,
    pendingOrders: 8,
    completedOrders: 90,
    inventoryStatus: 'Warning',
    customerRating: 4.3,
    hasScheduledAudit: false,
    lastAuditDate: '2025-03-15',
    auditScore: 85
  },
  {
    id: '3',
    name: 'Coasters HSR Layout',
    location: 'HSR Layout, Bangalore',
    orderVolume: 76,
    pendingOrders: 15,
    completedOrders: 61,
    inventoryStatus: 'Critical',
    customerRating: 3.9,
    hasScheduledAudit: false,
    lastAuditDate: '2025-02-28',
    auditScore: 78
  },
  {
    id: '4',
    name: 'Coasters Whitefield',
    location: 'Whitefield, Bangalore',
    orderVolume: 112,
    pendingOrders: 7,
    completedOrders: 105,
    inventoryStatus: 'Good',
    customerRating: 4.5,
    hasScheduledAudit: true,
    lastAuditDate: '2025-04-08',
    auditScore: 88
  }
];

export const getInventoryStatusColor = (status: string) => {
  switch(status) {
    case 'Good': return 'bg-green-100 text-green-800';
    case 'Warning': return 'bg-yellow-100 text-yellow-800';
    case 'Critical': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
