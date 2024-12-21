import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from './components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from './components/ui/breadcrumb';
import { Toaster } from '@/components/ui/toaster';
import { useLogContext } from './components/log-provider';
import { Settings } from 'lucide-react';
import { Button } from './components/ui/button';
import { useDialogLogViewerSetting } from './components/DialogLogViewerSetting/DialogLogViewerSettingProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { selectedLog } = useLogContext();
  const { onOpen } = useDialogLogViewerSetting();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <div className='flex items-center gap-1'>
                    {selectedLog?.name || ''}
                    <Button onClick={() => onOpen(selectedLog?.id)} variant='link' size='icon'>
                      <Settings className='h-4 w-4' />
                    </Button>
                  </div>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className='flex flex-1 flex-col gap-4 p-4'>{children}</main>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
