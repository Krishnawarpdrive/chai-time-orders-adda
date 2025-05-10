
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  indexOfFirstOrder: number;
  indexOfLastOrder: number;
  totalOrders: number;
  setCurrentPage: (page: number) => void;
}

export function OrdersPagination({ 
  currentPage, 
  totalPages, 
  indexOfFirstOrder, 
  indexOfLastOrder, 
  totalOrders,
  setCurrentPage 
}: OrdersPaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-gray-600">
        Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, totalOrders)} of {totalOrders} orders
      </p>
      
      <div className="flex space-x-1">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={cn(
            "flex items-center px-2 py-1 text-sm rounded",
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "bg-white"
          )}
        >
          Previous
        </Button>
        
        {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
          // Logic to show pages around the current page
          let pageNum;
          if (totalPages <= 3) {
            pageNum = i + 1;
          } else if (currentPage <= 2) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 1) {
            pageNum = totalPages - 2 + i;
          } else {
            pageNum = currentPage - 1 + i;
          }
          
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(pageNum)}
              className={cn(
                "px-3 py-1 text-sm rounded",
                currentPage === pageNum ? "bg-coffee-green text-white" : "bg-white"
              )}
            >
              {pageNum}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={cn(
            "flex items-center px-2 py-1 text-sm rounded",
            currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : "bg-white"
          )}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default OrdersPagination;
