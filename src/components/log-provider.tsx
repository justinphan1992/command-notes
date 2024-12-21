import * as model from '@/db/log.model';
import { useToast } from '@/hooks/use-toast';
import { Log } from '@/types';
import { createContext, useState, useContext, useEffect } from 'react';
import { z } from 'zod';

interface LogContextProps {
  logs: Log[];
  selectedLog: Log | null;
  setSelectedLog: (log: Log | null) => void;
  createLog: (log: z.infer<typeof model.CreateLogSchema>) => Promise<void>;
  updateLog: (id: number, log: z.infer<typeof model.CreateLogSchema>) => Promise<void>;
  deleteLog: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const LogContext = createContext<LogContextProps | null>(null);

export function LogProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    const logs = await model.getLogs();
    setLogs(logs);
  };

  const createLog = async (log: z.infer<typeof model.CreateLogSchema>) => {
    try {
      await model.createLog(log);
      refresh();
      toast({ title: 'Log created successfully' });
    } catch (e) {
      toast({
        title: 'Failed to create log',
        description: (e as Error).message,
        variant: 'destructive',
      });
    }
  };

  const updateLog = async (id: number, log: z.infer<typeof model.CreateLogSchema>) => {
    try {
      await model.updateLog(id, log);
      refresh();
      toast({ title: 'Log updated successfully' });
    } catch (e) {
      toast({
        title: 'Failed to update log',
        description: (e as Error).message,
        variant: 'destructive',
      });
    }
  };

  const deleteLog = async (id: number) => {
    try {
      await model.deleteLog(id);
      setLogs((prev) => prev.filter((log) => log.id !== id));
      toast({ title: 'Log deleted successfully' });
    } catch (e) {
      toast({
        title: 'Failed to delete log',
        description: (e as Error).message,
        variant: 'destructive',
      });
    }
  };

  return (
    <LogContext.Provider
      value={{
        logs,
        selectedLog,
        setSelectedLog,
        refresh,
        createLog,
        updateLog,
        deleteLog,
      }}
    >
      {children}
    </LogContext.Provider>
  );
}

export function useLogContext() {
  const context = useContext(LogContext);
  if (!context) throw new Error('useLog must be used within a LogProvider');
  return context;
}
