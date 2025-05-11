
import React from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface OutletAuditAlertProps {
  showAuditAlert: boolean;
  setShowAuditAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const OutletAuditAlert = ({ showAuditAlert, setShowAuditAlert }: OutletAuditAlertProps) => {
  if (!showAuditAlert) return null;
  
  return (
    <Alert className="bg-coffee-green/10 border-coffee-green">
      <AlertCircle className="h-4 w-4 text-coffee-green" />
      <AlertTitle className="text-coffee-green">Scheduled Audits</AlertTitle>
      <AlertDescription className="text-coffee-green/90">
        There are 2 outlets due for audit this week. Click to see details.
      </AlertDescription>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-2" 
        onClick={() => setShowAuditAlert(false)}
      >
        <Check className="h-4 w-4" />
      </Button>
    </Alert>
  );
};

export default OutletAuditAlert;
