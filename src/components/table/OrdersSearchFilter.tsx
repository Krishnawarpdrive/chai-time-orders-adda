
import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterDropdown } from '@/components/FilterDropdown';
import { Order } from '@/lib/data';

interface OrdersSearchFilterProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filterValue: string;
  setFilterValue: React.Dispatch<React.SetStateAction<string>>;
  resetOrders: () => void;
}

export function OrdersSearchFilter({
  searchQuery,
  setSearchQuery,
  filterValue,
  setFilterValue,
  resetOrders
}: OrdersSearchFilterProps) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      {/* Search and Filter Section */}
      <div className="relative flex items-center w-full sm:w-auto">
        <Search className="absolute left-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full sm:w-64"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <FilterDropdown value={filterValue} onValueChange={setFilterValue} />
        <Button
          variant="outline"
          size="icon"
          onClick={resetOrders}
          className="bg-white"
          title="Refresh orders"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default OrdersSearchFilter;
