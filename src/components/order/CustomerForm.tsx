
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Search, CalendarIcon } from 'lucide-react';
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
            setCustomerName(existingCustomer.name);
            if (existingCustomer.dob) {
              setDob(existingCustomer.dob);
              setDate(new Date(existingCustomer.dob));
            }
            setCustomerBadge(existingCustomer.badge as 'New' | 'Frequent' | 'Periodic');
            
            toast({
              title: "Existing Customer Found",
              description: `Welcome back, ${existingCustomer.name}!`,
            });
          } else {
            // Reset fields if no match found and fields are populated
            if (customerName) {
              setCustomerName('');
              setDob('');
              setDate(undefined);
              setCustomerBadge('New');
            }
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
      <h2 className="font-hackney text-2xl text-coffee-green mb-2">
        New Order
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="customerName" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
            {customerBadge && (
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap",
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
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <div className="relative">
            <Input 
              id="phoneNumber" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter phone number"
              className="pl-10"
            />
            <Search className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dob"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
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
