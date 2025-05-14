
import React, { useState, useEffect } from 'react';
import { InventoryRequest, useInventoryRequests } from '@/hooks/useInventoryRequests';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const InventoryRequestsManager = () => {
  const { requests, loading, error, updateRequestStatus, fetchRequestHistory } = useInventoryRequests();
  const [selectedRequest, setSelectedRequest] = useState<InventoryRequest | null>(null);
  const [activeDialog, setActiveDialog] = useState<'approve' | 'reject' | 'history' | null>(null);
  const [notes, setNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [requestHistory, setRequestHistory] = useState<any[]>([]);
  
  // Filter requests by status
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const approvedRequests = requests.filter(req => req.status === 'approved');
  const rejectedRequests = requests.filter(req => req.status === 'rejected');
  
  // Load history when opening the history dialog
  useEffect(() => {
    if (activeDialog === 'history' && selectedRequest) {
      loadRequestHistory(selectedRequest.id);
    }
  }, [activeDialog, selectedRequest]);
  
  const loadRequestHistory = async (requestId: string) => {
    const history = await fetchRequestHistory(requestId);
    setRequestHistory(history);
  };
  
  const handleApprove = async () => {
    if (!selectedRequest) return;
    
    await updateRequestStatus(selectedRequest.id, 'approved', notes);
    setActiveDialog(null);
    setNotes('');
  };
  
  const handleReject = async () => {
    if (!selectedRequest) return;
    
    await updateRequestStatus(selectedRequest.id, 'rejected', notes, rejectReason);
    setActiveDialog(null);
    setNotes('');
    setRejectReason('');
  };
  
  const openDialog = (request: InventoryRequest, dialogType: 'approve' | 'reject' | 'history') => {
    setSelectedRequest(request);
    setActiveDialog(dialogType);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-yellow-400 text-yellow-900">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateStr;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee-green"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={16} />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const renderRequestCard = (request: InventoryRequest) => (
    <Card key={request.id} className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg text-coffee-green">
              {request.inventory_item?.name || 'Unknown Item'}
            </h3>
            <p className="text-sm text-gray-600">
              Request made on {formatDate(request.created_at)}
            </p>
          </div>
          {getStatusBadge(request.status)}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Staff Entered Quantity</p>
            <p className="font-medium">
              {request.staff_entered_quantity} {request.inventory_item?.unit || 'units'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Requested Quantity</p>
            <p className="font-medium">
              {request.requested_quantity} {request.inventory_item?.unit || 'units'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Inventory</p>
            <p className="font-medium">
              {request.inventory_item?.quantity || 0} {request.inventory_item?.unit || 'units'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Reorder Level</p>
            <p className="font-medium">
              {request.inventory_item?.reorder_level || 0} {request.inventory_item?.unit || 'units'}
            </p>
          </div>
        </div>
        
        {request.notes && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Notes</p>
            <p className="text-sm bg-gray-50 p-2 rounded">{request.notes}</p>
          </div>
        )}
        
        {request.status === 'rejected' && request.rejected_reason && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Rejection Reason</p>
            <p className="text-sm bg-red-50 text-red-700 p-2 rounded">{request.rejected_reason}</p>
          </div>
        )}
        
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => openDialog(request, 'history')}
          >
            View History
          </Button>
          
          {request.status === 'pending' && (
            <>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => openDialog(request, 'reject')}
              >
                <X className="h-4 w-4 mr-1" /> Reject
              </Button>
              <Button 
                variant="default" 
                size="sm"
                className="bg-coffee-green hover:bg-coffee-green/80"
                onClick={() => openDialog(request, 'approve')}
              >
                <Check className="h-4 w-4 mr-1" /> Approve
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingRequests.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center bg-bisi-orange text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1">
                {pendingRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length > 0 ? (
            pendingRequests.map(renderRequestCard)
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No pending inventory requests.
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="space-y-4">
          {approvedRequests.length > 0 ? (
            approvedRequests.map(renderRequestCard)
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No approved inventory requests.
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          {rejectedRequests.length > 0 ? (
            rejectedRequests.map(renderRequestCard)
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No rejected inventory requests.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Approve Dialog */}
      <Dialog open={activeDialog === 'approve'} onOpenChange={() => activeDialog === 'approve' && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Inventory Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this request for {selectedRequest?.requested_quantity} {selectedRequest?.inventory_item?.unit} of {selectedRequest?.inventory_item?.name}?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this approval"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} className="bg-coffee-green hover:bg-coffee-green/80">
              <Check className="h-4 w-4 mr-1" /> Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={activeDialog === 'reject'} onOpenChange={() => activeDialog === 'reject' && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Inventory Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request for {selectedRequest?.requested_quantity} {selectedRequest?.inventory_item?.unit} of {selectedRequest?.inventory_item?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="reject-reason" className="text-sm font-medium">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="reject-reason"
                placeholder="Explain why this request is being rejected"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="text-sm font-medium">
                Additional Notes (Optional)
              </label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>
              <X className="h-4 w-4 mr-1" /> Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* History Dialog */}
      <Dialog open={activeDialog === 'history'} onOpenChange={() => activeDialog === 'history' && setActiveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request History</DialogTitle>
            <DialogDescription>
              History for request of {selectedRequest?.inventory_item?.name}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[300px] w-full pr-4">
            {requestHistory.length > 0 ? (
              <div className="space-y-4">
                {requestHistory.map((history) => (
                  <div key={history.id} className="border-b pb-3">
                    <div className="flex justify-between">
                      <div className="font-medium">
                        Status changed: {history.previous_status} → {history.new_status}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(history.created_at)}
                      </div>
                    </div>
                    {history.notes && (
                      <p className="text-sm mt-1 bg-gray-50 p-2 rounded">{history.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No history available</p>
            )}
          </ScrollArea>
          
          <DialogFooter>
            <Button onClick={() => setActiveDialog(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryRequestsManager;
