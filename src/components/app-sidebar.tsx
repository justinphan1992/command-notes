import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { MoreHorizontal, Plus } from 'lucide-react';
import { useDialogLogSettings } from './DialogLogSettings/DialogLogSettingProvider';
import { useLogContext } from './log-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function AppSidebar() {
  const { onOpen } = useDialogLogSettings();
  const { logs, setSelectedLog, deleteLog } = useLogContext();

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Logs</SidebarGroupLabel>
          <SidebarGroupAction title='Add Log' onClick={() => onOpen()}>
            <Plus /> <span className='sr-only'>Add Log</span>
          </SidebarGroupAction>
          <SidebarMenu>
            {logs.map((log) => (
              <SidebarMenuItem key={log.id}>
                <SidebarMenuButton onClick={() => setSelectedLog(log)}>
                  <span>{log.name}</span>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction>
                      <MoreHorizontal />
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side='right' align='start'>
                    <DropdownMenuItem onClick={() => onOpen(log.id)}>
                      <span>Edit Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteLog(log.id)}>
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
