
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Menu as MenuIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarPersonaSelector, { personas } from './sidebar/SidebarPersonaSelector';
import SidebarNavItems from './sidebar/SidebarNavItems';
import CustomerMobileMenu from './sidebar/CustomerMobileMenu';
import { getActiveNavItems } from './sidebar/navItems';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [selectedPersona, setSelectedPersona] = useState<string>("customer");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  // Check for stored persona preference
  useEffect(() => {
    const storedPersona = localStorage.getItem('selected_persona');
    if (storedPersona) {
      setSelectedPersona(storedPersona);
    }
  }, []);

  const handlePersonaChange = (value: string) => {
    setSelectedPersona(value);
    setMobileMenuOpen(false); // Close mobile menu after selection
    
    // Save persona selection to localStorage so it persists and can be accessed by other components
    localStorage.setItem('selected_persona', value);
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
    
    console.log(`Switched to ${value} persona`);
  };

  // Get the current active navigation items based on selected persona
  const activeNavItems = getActiveNavItems(selectedPersona);

  // Special mobile menu for customer persona that matches the screenshots
  if (isMobile && selectedPersona === 'customer' && mobileMenuOpen) {
    return (
      <CustomerMobileMenu 
        navItems={activeNavItems} 
        selectedPersona={selectedPersona} 
        handlePersonaChange={handlePersonaChange} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    );
  }

  // Find the current persona icon
  const currentPersona = personas.find(p => p.value === selectedPersona);
  const PersonaIcon = currentPersona ? currentPersona.icon : null;

  return (
    <aside 
      className={cn(
        'flex flex-col bg-coffee-green text-white transition-all duration-300 ease-in-out relative border-r border-coffee-green/20',
        collapsed ? 'w-16' : 'w-64',
        isMobile && mobileMenuOpen ? 'absolute z-50 h-full' : '',
        isMobile && !mobileMenuOpen && collapsed ? 'w-16' : '',
        className
      )}
    >
      {/* Logo and Persona Selector */}
      <div className="flex flex-col p-4 h-auto">
        <div className="flex items-center h-16">
          {(!collapsed || (isMobile && mobileMenuOpen)) && (
            <div className="font-hackney text-xl tracking-wide">
              <span className="text-white">Parse</span>
              <span className="text-bisi-orange">Nue</span>
            </div>
          )}
          {collapsed && !mobileMenuOpen && (
            <div className="w-8 h-8 bg-gradient-to-r from-bisi-orange to-bisi-orange/80 rounded flex items-center justify-center text-white font-hackney">
              P
            </div>
          )}
          
          {/* Mobile menu button */}
          {isMobile && (
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-auto p-2"
            >
              <MenuIcon size={24} />
            </button>
          )}
        </div>
        
        {/* Persona Selector */}
        <SidebarPersonaSelector 
          selectedPersona={selectedPersona} 
          collapsed={collapsed} 
          isMobile={isMobile} 
          handlePersonaChange={handlePersonaChange} 
        />
      </div>
      
      {/* Toggle button - only show on desktop */}
      {!isMobile && (
        <button 
          className="absolute -right-3 top-16 bg-coffee-green text-white rounded-full p-1 shadow-md hover:bg-coffee-green/90 transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}

      {/* Navigation */}
      <SidebarNavItems 
        navItems={activeNavItems} 
        collapsed={collapsed}
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
        onMobileItemClick={() => isMobile && setMobileMenuOpen(false)}
      />

      {/* Bottom section */}
      <div className="p-4 mt-auto">
        {(!collapsed || (isMobile && mobileMenuOpen)) && (
          <div className="text-white/70 text-xs text-center">
            <p>ಸ್ವಾಗತ!</p>
            <p>Welcome, {selectedPersona.charAt(0).toUpperCase() + selectedPersona.slice(1)}</p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
