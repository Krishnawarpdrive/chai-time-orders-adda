
import React from 'react';

export function OrdersEmptyState() {
  return (
    <tr>
      <td colSpan={8} className="table-cell-padding text-center text-sm text-gray-500 py-8">
        <div className="flex flex-col items-center">
          <p className="mb-1">No orders found</p>
          <p className="text-xs">Try adjusting your search or filter</p>
        </div>
      </td>
    </tr>
  );
}

export default OrdersEmptyState;
