import { Document } from 'mongoose';

// Define interfaces for inner schemas
interface Quality extends Document{
    values: {
      key_en: string;
      key_ar: string;
      value_en: string;
      value_ar: string;
      color?: string;
    }[];
    quantity: number;
    price?: number;
    image?: string[];
  }
  

export { Quality };
