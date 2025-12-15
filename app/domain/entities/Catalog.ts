import { Registration } from './Registration';

export interface Catalog {
  registrations: Registration[];
  totalCount: number;
  createdAt: string;
}