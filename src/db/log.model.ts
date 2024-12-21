import { Log } from '@/types';
import Database from '@tauri-apps/plugin-sql';
import { z } from 'zod';

export const SQL_CONNECTION = 'sqlite:mydatabase.db';

export const LogSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  command: z.string().min(3),
});

export const CreateLogSchema = LogSchema.omit({ id: true });

export const getLogs = async () => {
  const db = await Database.load(SQL_CONNECTION);
  return db.select<Log[]>('SELECT * FROM logs');
};

export const createLog = async (log: z.infer<typeof CreateLogSchema>) => {
  const db = await Database.load(SQL_CONNECTION);
  return db.execute('INSERT INTO logs (name, description, command) VALUES ($1, $2, $3)', [
    log.name,
    log.description,
    log.command,
  ]);
};

export const deleteLog = async (id: number) => {
  const db = await Database.load(SQL_CONNECTION);
  return db.execute('DELETE FROM logs WHERE id = $1', [id]);
};

export const updateLog = async (id: number, log: z.infer<typeof CreateLogSchema>) => {
  const db = await Database.load(SQL_CONNECTION);
  return db.execute('UPDATE logs SET name = $1, description = $2, command = $3 WHERE id = $4', [
    log.name,
    log.description,
    log.command,
    id,
  ]);
};

export const getLog = async (id: number) => {
  const db = await Database.load(SQL_CONNECTION);
  return db.select<Log>('SELECT * FROM logs WHERE id = $1', [id]);
};
