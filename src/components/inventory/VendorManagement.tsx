
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Vendor {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Coffee Bean Suppliers',
    contact_person: 'John Smith',
    email: 'john@suppliers.com',
    phone: '+1-555-0456',
    address: '456 Supplier Ave',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Dairy Products Inc',
    contact_person: 'Jane Doe',
    email: 'jane@dairy.com',
    phone: '+1-555-0789',
    address: '789 Dairy Lane',
    status: 'inactive',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const VendorManagement = () => {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: Vendor['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'suspended':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleStatusChange = (vendorId: string, newStatus: Vendor['status']) => {
    setVendors(prev => 
      prev.map(vendor => 
        vendor.id === vendorId 
          ? { ...vendor, status: newStatus, updated_at: new Date().toISOString() }
          : vendor
      )
    );
    
    toast({
      title: "Success",
      description: "Vendor status updated successfully.",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-coffee-green border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading vendors...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-coffee-green">Vendor Management</h3>
          <p className="text-sm text-gray-600">Manage your suppliers and vendors</p>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.contact_person}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.phone}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vendor.status)}>
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorManagement;
