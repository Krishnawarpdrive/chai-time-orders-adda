
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingBag } from 'lucide-react';

interface RequestFooterProps {
  totalRequestItems: number;
  onClick: () => void;
}

const RequestFooter = ({ totalRequestItems, onClick }: RequestFooterProps) => {
  return (
    <div className="fixed bottom-0 right-0 w-72 bg-white border-t border-gray-200 p-4 shadow-lg">
      <Button
        onClick={onClick}
        className="w-full py-6 bg-bisi-orange hover:bg-bisi-orange/90 text-white font-medium"
      >
        <ShoppingBag className="mr-2" />
        Request Order ({totalRequestItems} items)
      </Button>
    </div>
  );
};

export default RequestFooter;
