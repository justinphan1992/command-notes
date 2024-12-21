import { createContext, useState, useContext } from 'react';

export type DialogLogSettingContextProps = {
  open: boolean;
  onClose: () => void;
  onOpen: (logId?: number) => void;
  currentLogId: number | null;
};

export const DialogLogSettingContext = createContext<DialogLogSettingContextProps | null>(null);

export const useDialogLogSettings = () => {
  const context = useContext(DialogLogSettingContext);
  if (!context) {
    throw new Error('useDialogLogSettings must be used within a DialogLogSettingsProvider.');
  }
  return context;
};

export function DialogLogSettingsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [currentLogId, setCurrentLogId] = useState<number | null>(null);

  const onOpen = (logId?: number) => {
    setOpen(true);
    setCurrentLogId(logId || null);
  };

  const onClose = () => {
    setOpen(false);
    setCurrentLogId(null);
  };

  return (
    <DialogLogSettingContext.Provider value={{ open, onOpen, onClose, currentLogId }}>
      {children}
    </DialogLogSettingContext.Provider>
  );
}
