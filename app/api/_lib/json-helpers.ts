import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { z } from 'zod';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function readJsonFile<T>(
  filename: string,
  schema: z.ZodSchema<T[]>
): Promise<T[]> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    return schema.parse(parsed);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return schema.parse([]);
    }
    throw error;
  }
}

export async function writeJsonFile<T>(
  filename: string,
  data: T[],
  schema?: z.ZodSchema<T[]>
): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  const validatedData = schema ? schema.parse(data) : data;
  await fs.writeFile(filePath, JSON.stringify(validatedData, null, 2), 'utf-8');
}

export async function addToJsonFile<T extends { id: string; createdAt: string }>(
  filename: string,
  schema: z.ZodSchema<T[]>,
  data: Omit<T, 'id' | 'createdAt'>
): Promise<T> {
  const items = await readJsonFile<T>(filename, schema);
  
  const newItem = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  } as T;

  items.push(newItem);
  await writeJsonFile(filename, items, schema);

  return newItem;
}
