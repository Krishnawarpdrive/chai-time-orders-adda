
import { format } from 'date-fns';

// Format date for display
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'dd MMM yyyy');
};

// Format currency amount
export const formatAmount = (amount: number) => {
  return `₹${amount.toFixed(2)}`;
};

// Generate random rating based on order ID hash
export const getRating = (orderId: string) => {
  // Using a hash of the orderId to generate a consistent rating between 3 and 5
  const hash = orderId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return (Math.abs(hash) % 3) + 3; // Rating between 3 and 5
};

// Format item names for display
export const formatItemNames = (items: any[]) => {
  if (!items || items.length === 0) return 'No items';
  
  // Get first two item names
  const firstTwoItems = items
    .slice(0, 2)
    .map(item => `${item.quantity}x ${item.item?.name || 'Unknown Item'}`)
    .join(', ');
  
  // Add ellipsis if there are more items
  return items.length > 2 
    ? `${firstTwoItems}...` 
    : firstTwoItems;
};
