
import React from 'react';
import { cn } from "@/lib/utils";
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StarRatingProps {
  rating: number;
}

const StarRating = ({ rating }: StarRatingProps) => {
  // Function to determine background color based on rating
  const getRatingColor = (rating: number): string => {
    if (rating >= 4.5) return 'bg-[#F2FCE2] text-green-800'; // Soft Green for excellent ratings
    if (rating >= 4) return 'bg-[#FEF7CD] text-amber-800';   // Soft Yellow for very good ratings
    if (rating >= 3.5) return 'bg-[#FDE1D3] text-orange-800'; // Soft Peach for good ratings
    if (rating >= 3) return 'bg-[#FEC6A1] text-orange-900';  // Soft Orange for average ratings
    return 'bg-[#FFDEE2] text-red-800';                      // Soft Pink for below average ratings
  };

  return (
    <div className="flex items-center">
      <Badge className={cn(
        "font-medium px-2 py-1", 
        getRatingColor(rating)
      )}>
        {rating.toFixed(1)}/5
        <Star className="ml-1 h-3 w-3 fill-current" />
      </Badge>
    </div>
  );
};

export default StarRating;
