
import React from 'react';
import { Spinner } from '@/components/ui/spinner';

const CustomerOrderTableLoading = () => {
  return (
    <div className="w-full flex justify-center items-center h-64">
      <Spinner />
    </div>
  );
};

export default CustomerOrderTableLoading;
