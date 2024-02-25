import { IAdmin } from '../models/admin.model';

type AdminProfile = Pick<IAdmin, 'id' | 'email' | 'name' | 'createdAt' | 'lastAccessedAt' | 'updatedAt' | 'role'>;

export type { AdminProfile };
