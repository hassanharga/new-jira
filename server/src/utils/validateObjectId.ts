import { isValidObjectId } from 'mongoose';

export const validateObjectId = (id: string) => isValidObjectId(id);
