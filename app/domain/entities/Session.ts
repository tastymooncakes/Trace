export interface DrawingSession {
  id?: number;
  sessionId: string;
  createdAt: string;
  lastModified: string;
  actions: number[];
  checkpoints: SessionCheckpoint[];
}

export interface SessionCheckpoint {
  actionId: number;
  nid: string;
  timestamp: string;
  canvasDataUrl?: string;
}