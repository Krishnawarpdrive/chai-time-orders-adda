
import React from 'react';
import CoffeeCard from '@/components/CoffeeCard';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface MenuSectionProps {
  menuItems: MenuItem[];
}

const MenuSection = ({ menuItems }: MenuSectionProps) => {
  return (
    <div className="px-4 pb-24">
      {menuItems.map((item) => (
        <CoffeeCard key={item.id} coffee={item} />
      ))}
    </div>
  );
};

export default MenuSection;
