
import React from 'react';

const Products = () => {
  return (
    <div className="flex-1 p-6 bg-milk-sugar overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-hackney text-3xl text-coffee-green mb-6">Products Management</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-lg text-gray-600">
            Manage your product inventory using the sidebar on the right.
          </p>
          <p className="mt-2 text-gray-600">
            You can update inventory levels, check reorder levels, and calculate costs for new orders.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Products;
