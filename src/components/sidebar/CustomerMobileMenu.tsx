
import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { personas } from './SidebarPersonaSelector';

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

interface CustomerMobileMenuProps {
  navItems: NavItem[];
  selectedPersona: string;
  handlePersonaChange: (value: string) => void;
  onClose: () => void;
}

const CustomerMobileMenu: React.FC<CustomerMobileMenuProps> = ({
  navItems,
  selectedPersona,
  handlePersonaChange,
  onClose
}) => {
  const navigate = useNavigate();

  // Listen for toggle events from other components
  useEffect(() => {
    const handleToggleMenu = () => {
      onClose();
    };
    
    window.addEventListener('toggle-mobile-menu', handleToggleMenu);
    return () => {
      window.removeEventListener('toggle-mobile-menu', handleToggleMenu);
    };
  }, [onClose]);

  // Handle navigation and close the menu
  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };
  
  // Enhanced handler for persona changes with navigation
  const handlePersonaChangeWithNavigation = (value: string) => {
    // First change the persona
    handlePersonaChange(value);
    
    // Find the persona's home path and navigate to it
    const persona = personas.find(p => p.value === value);
    if (persona) {
      navigate(persona.homePath);
      onClose(); // Close the menu after navigation
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1e483c] text-white z-50 flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-white/20">
        <div className="text-2xl font-bold">Menu</div>
        <button onClick={onClose} className="text-white p-2">
          <span className="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <ul className="py-4">
          {navItems.map((item) => {
            const ItemIcon = item.icon;
            return (
              <li key={item.title} className="px-4 py-3">
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => 
                    `flex items-center text-xl ${isActive ? 'text-[#e9c766]' : 'text-white'}`
                  }
                >
                  <ItemIcon className="mr-4 h-6 w-6" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto bg-[#e46546] text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}

          <li className="px-4 py-3">
            <button className="flex items-center text-xl text-white w-full">
              <LogOut className="mr-4 h-6 w-6" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="border-t border-white/20 p-4">
        <p className="text-sm text-white/70 mb-2">Switch Persona:</p>
        {personas.map((persona) => {
          const PersonaIcon = persona.icon;
          return (
            <button
              key={persona.value}
              onClick={() => handlePersonaChangeWithNavigation(persona.value)}
              className={`flex items-center w-full p-2 rounded-md ${
                selectedPersona === persona.value 
                  ? 'bg-[#e9c766] text-[#1e483c]' 
                  : 'text-white/80 hover:bg-[#1e483c]/60'
              }`}
            >
              <PersonaIcon className="mr-3 h-5 w-5" />
              <span>{persona.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerMobileMenu;
