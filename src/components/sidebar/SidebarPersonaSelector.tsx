
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users as StaffIcon, Store, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SidebarPersonaSelectorProps {
  selectedPersona: string;
  collapsed: boolean;
  isMobile: boolean;
  handlePersonaChange: (value: string) => void;
}

export const personas = [
  { value: "customer", label: "Customer", icon: User, homePath: "/" },
  { value: "staff", label: "Staff", icon: StaffIcon, homePath: "/staff" },
  { value: "franchise", label: "Franchise Owner", icon: Store, homePath: "/franchise" },
  { value: "brand", label: "Brand Owner", icon: Shield, homePath: "/brand" },
];

const SidebarPersonaSelector: React.FC<SidebarPersonaSelectorProps> = ({ 
  selectedPersona, 
  collapsed, 
  isMobile, 
  handlePersonaChange 
}) => {
  const navigate = useNavigate();
  
  // Get the current persona icon
  const currentPersona = personas.find(p => p.value === selectedPersona);
  const PersonaIcon = currentPersona ? currentPersona.icon : User;
  
  // Enhanced handler that also navigates to the persona's home page
  const handlePersonaChangeWithNavigation = (value: string) => {
    handlePersonaChange(value);
    
    // Find the persona's home path and navigate to it
    const persona = personas.find(p => p.value === value);
    if (persona) {
      navigate(persona.homePath);
    }
  };

  // Expanded view (desktop)
  if (!collapsed && !isMobile) {
    return (
      <div className="mt-4">
        <Select 
          defaultValue={personas[0].value} 
          value={selectedPersona}
          onValueChange={handlePersonaChangeWithNavigation}
        >
          <SelectTrigger className="w-full bg-coffee-green/50 border-coffee-green/30 text-white">
            <SelectValue placeholder="Select Persona" />
          </SelectTrigger>
          <SelectContent className="bg-coffee-green border-coffee-green/30">
            {personas.map((persona) => {
              const PersonaIconItem = persona.icon;
              return (
                <SelectItem key={persona.value} value={persona.value} className="text-white focus:bg-coffee-green/70 focus:text-white">
                  <div className="flex items-center gap-2">
                    <PersonaIconItem className="h-4 w-4" />
                    <span>{persona.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Collapsed or mobile view
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mt-4 w-8 h-8 flex items-center justify-center bg-coffee-green/50 rounded hover:bg-coffee-green/70 transition-colors">
        <PersonaIcon size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="bg-coffee-green border-coffee-green/30 text-white">
        {personas.map((persona) => {
          const PersonaIconItem = persona.icon;
          return (
            <DropdownMenuItem 
              key={persona.value}
              onClick={() => handlePersonaChangeWithNavigation(persona.value)}
              className="cursor-pointer hover:bg-coffee-green/70 text-white focus:bg-coffee-green/70 focus:text-white"
            >
              <PersonaIconItem className="mr-2 h-4 w-4" />
              <span>{persona.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SidebarPersonaSelector;
