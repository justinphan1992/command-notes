import Layout from './layout';
import { ThemeProvider } from './components/theme-provider';
import { DialogLogSettingsProvider } from './components/DialogLogSettings/DialogLogSettingProvider';
import { DialogLogSettings } from './components/DialogLogSettings/DialogLogSettings';
import { LogProvider } from './components/log-provider';
import { LogViewer } from './components/LogViewer/LogViewer';
import { LogViewerSettingProvider } from './components/log-view-setting-provider';
import { DialogLogViewerSettingProvider } from './components/DialogLogViewerSetting/DialogLogViewerSettingProvider';
import { DialogLogViewerSettings } from './components/DialogLogViewerSetting/DialogLogViewerSettings';

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <LogProvider>
        <LogViewerSettingProvider>
          <DialogLogSettingsProvider>
            <DialogLogViewerSettingProvider>
              <Layout>
                <LogViewer />
                <DialogLogSettings />
                <DialogLogViewerSettings />
              </Layout>
            </DialogLogViewerSettingProvider>
          </DialogLogSettingsProvider>
        </LogViewerSettingProvider>
      </LogProvider>
    </ThemeProvider>
  );
}

export default App;
