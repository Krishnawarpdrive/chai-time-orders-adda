
import React from 'react';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface OutletViewSwitcherProps {
  viewMode: 'grid' | 'table';
  setViewMode: React.Dispatch<React.SetStateAction<'grid' | 'table'>>;
}

const OutletViewSwitcher = ({ viewMode, setViewMode }: OutletViewSwitcherProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-muted rounded-md p-1 flex">
        <Button 
          size="sm" 
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          className={viewMode === 'grid' ? 'bg-coffee-green text-white' : ''}
          onClick={() => setViewMode('grid')}
        >
          <LayoutGrid size={16} />
        </Button>
        <Button 
          size="sm" 
          variant={viewMode === 'table' ? 'default' : 'ghost'}
          className={viewMode === 'table' ? 'bg-coffee-green text-white' : ''}
          onClick={() => setViewMode('table')}
        >
          <TableIcon size={16} />
        </Button>
      </div>
      <Button size="sm" variant="outline" className="border-coffee-green text-coffee-green hover:bg-coffee-green/10">
        Schedule Audit
      </Button>
    </div>
  );
};

export default OutletViewSwitcher;
