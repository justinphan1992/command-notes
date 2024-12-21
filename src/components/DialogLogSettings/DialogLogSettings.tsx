import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDialogLogSettings } from './DialogLogSettingProvider';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateLogSchema } from '@/db/log.model';
import { useLogContext } from '../log-provider';
import { useEffect } from 'react';
import { Textarea } from '../ui/textarea';

export function DialogLogSettings() {
  const { open, onClose, currentLogId } = useDialogLogSettings();
  const { logs, createLog, updateLog } = useLogContext();

  const form = useForm<z.infer<typeof CreateLogSchema>>({
    resolver: zodResolver(CreateLogSchema),
  });

  const currentLog = logs.find((log) => log.id === currentLogId);

  useEffect(() => {
    form.setValue('name', currentLog ? currentLog.name : '');
    form.setValue('description', currentLog ? currentLog.description : '');
    form.setValue('command', currentLog ? currentLog.command : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLog]);

  function onSubmit(values: z.infer<typeof CreateLogSchema>) {
    currentLog ? updateLog(currentLog.id, values) : createLog(values);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{currentLog ? currentLog.name : 'Add Log'}</DialogTitle>
          <DialogDescription>Log Settings</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form>
            <div>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter Description' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='command'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Command</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Enter Command' {...field} />
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
