import Dexie, { Table } from 'dexie';
import { DrawingAction, DrawingSession } from '@/app/domain/entities';

class TraceDatabase extends Dexie {
  actions!: Table<DrawingAction, number>;
  sessions!: Table<DrawingSession, number>;

  constructor() {
    super('TraceDB');
    
    this.version(1).stores({
      actions: '++id, type, timestamp, parentActionId',
      sessions: '++id, sessionId, lastModified'
    });
  }
}

export const db = new TraceDatabase();