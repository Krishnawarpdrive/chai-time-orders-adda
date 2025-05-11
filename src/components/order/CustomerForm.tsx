
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Search, CalendarIcon, User, Phone } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface CustomerFormProps {
  customerName: string;
  setCustomerName: React.Dispatch<React.SetStateAction<string>>;
  phoneNumber: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  dob: string;
  setDob: React.Dispatch<React.SetStateAction<string>>;
  customerBadge: 'New' | 'Frequent' | 'Periodic';
  setCustomerBadge: React.Dispatch<React.SetStateAction<'New' | 'Frequent' | 'Periodic'>>;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customerName,
  setCustomerName,
  phoneNumber,
  setPhoneNumber,
  dob,
  setDob,
  customerBadge,
  setCustomerBadge
}) => {
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(
    dob ? new Date(dob) : undefined
  );

  // Check if customer exists when phone number changes
  useEffect(() => {
    const checkCustomer = async () => {
      if (phoneNumber.length >= 10) {
        try {
          const existingCustomer = await orderService.getCustomerByPhone(phoneNumber);
          
          if (existingCustomer) {
            // Only set the customer name if the input is currently empty
            // This prevents overwriting what the user has already typed
            if (!customerName.trim()) {
              setCustomerName(existingCustomer.name);
            }
            
            if (existingCustomer.dob) {
              setDob(existingCustomer.dob);
              setDate(new Date(existingCustomer.dob));
            }
            
            setCustomerBadge(existingCustomer.badge as 'New' | 'Frequent' | 'Periodic');
            
            toast({
              title: "Existing Customer Found",
              description: `Welcome back, ${existingCustomer.name}!`,
            });
          } 
          // Only reset the fields if the customer name wasn't manually entered
          else if (!customerName.trim()) {
            setCustomerBadge('New');
          }
        } catch (error) {
          console.error("Error checking customer:", error);
        }
      }
    };
    
    checkCustomer();
  }, [phoneNumber, toast, customerName, setCustomerName, setDob, setCustomerBadge]);

  // Handle date change
  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setDob(format(selectedDate, 'yyyy-MM-dd'));
    } else {
      setDob('');
    }
  };

  return (
    <div className="bg-milk-sugar p-6 border-b">
      <h2 className="font-hackney text-2xl text-coffee-green mb-4">
        New Order
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-base">Phone Number</Label>
          <div className="relative">
            <Input 
              id="phoneNumber" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter phone number"
              className="pl-10 h-12 text-base"
            />
            <Phone className="h-5 w-5 text-gray-500 absolute left-3 top-3.5" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="customerName" className="text-base">Customer Name</Label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input 
                id="customerName" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="pl-10 h-12 text-base"
              />
              <User className="h-5 w-5 text-gray-500 absolute left-3 top-3.5" />
            </div>
            {customerBadge && (
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap",
                customerBadge === 'Frequent' ? "bg-green-100 text-green-800" :
                customerBadge === 'Periodic' ? "bg-blue-100 text-blue-800" :
                "bg-gray-100 text-gray-800"
              )}>
                {customerBadge}
              </span>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dob" className="text-base">Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dob"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12 text-base",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {date ? format(date, "dd MMM yyyy") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
