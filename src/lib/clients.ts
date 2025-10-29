import { promises as fs } from 'fs';
import path from 'path';
import type { ClientRecord } from '@/types/client';

const DATA_DIRECTORY = path.join(process.cwd(), 'data');
const CLIENTS_FILE = path.join(DATA_DIRECTORY, 'clients.json');

async function ensureDataFile() {
  try {
    await fs.access(CLIENTS_FILE);
  } catch {
    await fs.mkdir(DATA_DIRECTORY, { recursive: true });
    await fs.writeFile(CLIENTS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

export async function readClients(): Promise<ClientRecord[]> {
  await ensureDataFile();
  const raw = await fs.readFile(CLIENTS_FILE, 'utf8');
  return JSON.parse(raw) as ClientRecord[];
}

export async function writeClients(clients: ClientRecord[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(CLIENTS_FILE, JSON.stringify(clients, null, 2), 'utf8');
}

export async function addClient(client: ClientRecord): Promise<void> {
  const clients = await readClients();
  clients.push(client);
  await writeClients(clients);
}

export async function findClientById(id: string): Promise<ClientRecord | null> {
  const clients = await readClients();
  return clients.find((client) => client.id === id) ?? null;
}
