import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDialogLogViewerSetting } from './DialogLogViewerSettingProvider';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useEffect } from 'react';
import { useLogViewerSetting } from '../log-view-setting-provider';
import { TagInput } from '@/components/ui/tag-input';

export type LogViewerSettingsForm = {
  filterTexts: string[];
  highlightTexts: string[];
};

export function DialogLogViewerSettings() {
  const { open, onClose, currentLogId } = useDialogLogViewerSetting();
  const { getLogViewerSetting, setLogViewerSetting } = useLogViewerSetting();

  const form = useForm<LogViewerSettingsForm>();

  useEffect(() => {
    if (!currentLogId) return;
    const viewerSetting = getLogViewerSetting(currentLogId);
    form.setValue('filterTexts', viewerSetting.filterTexts);
    form.setValue('highlightTexts', viewerSetting.highlightTexts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLogId]);

  function onSubmit(values: LogViewerSettingsForm) {
    if (!currentLogId) return;
    setLogViewerSetting(currentLogId, values.highlightTexts, values.filterTexts);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Log Viewer Settings</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form>
            <div>
              <FormField
                control={form.control}
                name='highlightTexts'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highlight Texts</FormLabel>
                    <FormControl>
                      <TagInput placeholder='Input and press enter' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='filterTexts'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filter Texts</FormLabel>
                    <FormControl>
                      <TagInput placeholder='Input and press enter' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className='sm:justify-start'>
          <Button onClick={form.handleSubmit(onSubmit)}>Save</Button>
          <DialogClose asChild className='flex gap-2'>
            <Button onClick={onClose} type='button' variant='secondary'>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
