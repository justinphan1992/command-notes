import { createContext, useState, useContext } from 'react';

export type DialogLogViewerSettingContextProps = {
  open: boolean;
  onClose: () => void;
  onOpen: (logId?: number) => void;
  currentLogId: number | null;
};

export const DialogLogViewerSettingContext =
  createContext<DialogLogViewerSettingContextProps | null>(null);

export const useDialogLogViewerSetting = () => {
  const context = useContext(DialogLogViewerSettingContext);
  if (!context) {
    throw new Error(
      'useDialogLogViewerSetting must be used within a DialogLogViewerSettingProvider.',
    );
  }
  return context;
};

export function DialogLogViewerSettingProvider({ children }: { children: React.ReactNode }) {
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
    <DialogLogViewerSettingContext.Provider value={{ open, onOpen, onClose, currentLogId }}>
      {children}
    </DialogLogViewerSettingContext.Provider>
  );
}
