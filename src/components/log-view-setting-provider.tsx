import { useState, createContext, useContext } from 'react';

export interface LogViewerSettingContextProps {
  setLogViewerSetting: (logId: number, highlightTexts: string[], filterTexts: string[]) => void;
  getLogViewerSetting: (logId: number) => { highlightTexts: string[]; filterTexts: string[] };
}

const LogViewerSettingContext = createContext<LogViewerSettingContextProps | null>(null);

export const LogViewerSettingProvider = ({ children }: { children: React.ReactNode }) => {
  const [highlightTexts, setHighlightTexts] = useState<Record<number, string[]>>({});
  const [filterTexts, setFilterTexts] = useState<Record<number, string[]>>({});

  const getLogViewerSetting = (logId: number) => {
    return {
      highlightTexts: highlightTexts[logId] || [],
      filterTexts: filterTexts[logId] || [],
    };
  };

  const setLogViewerSetting = (logId: number, highlightTexts: string[], filterTexts: string[]) => {
    setHighlightTexts((prev) => ({ ...prev, [logId]: highlightTexts }));
    setFilterTexts((prev) => ({ ...prev, [logId]: filterTexts }));
  };

  return (
    <LogViewerSettingContext.Provider
      value={{
        getLogViewerSetting,
        setLogViewerSetting,
      }}
    >
      {children}
    </LogViewerSettingContext.Provider>
  );
};

export const useLogViewerSetting = () => {
  const context = useContext(LogViewerSettingContext);
  if (!context) {
    throw new Error('useLogViewerSetting must be used within a LogViewerSettingProvider.');
  }
  return context;
};
