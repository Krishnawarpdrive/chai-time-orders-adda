
import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

type SortField = 'id' | 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

interface OrdersTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  handleSort: (field: SortField) => void;
}

export function OrdersTableHeader({ sortField, sortDirection, handleSort }: OrdersTableHeaderProps) {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="w-10"></th> {/* Expansion column */}
        <th 
          className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
          onClick={() => handleSort('id')}
        >
          <div className="flex items-center">
            Order ID
            {sortField === 'id' && (
              sortDirection === 'asc' ? 
                <ArrowUp className="ml-1 h-3 w-3" /> : 
                <ArrowDown className="ml-1 h-3 w-3" />
            )}
          </div>
        </th>
        <th 
          className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
          onClick={() => handleSort('date')}
        >
          <div className="flex items-center">
            Date
            {sortField === 'date' && (
              sortDirection === 'asc' ? 
                <ArrowUp className="ml-1 h-3 w-3" /> : 
                <ArrowDown className="ml-1 h-3 w-3" />
            )}
          </div>
        </th>
        <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Customer
        </th>
        <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
        <th 
          className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
          onClick={() => handleSort('amount')}
        >
          <div className="flex items-center">
            Amount
            {sortField === 'amount' && (
              sortDirection === 'asc' ? 
                <ArrowUp className="ml-1 h-3 w-3" /> : 
                <ArrowDown className="ml-1 h-3 w-3" />
            )}
          </div>
        </th>
        <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Payment
        </th>
        <th className="table-cell-padding text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );
}

export default OrdersTableHeader;
