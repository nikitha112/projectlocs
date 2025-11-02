export type ItemType = 'lost' | 'found';

export type Category = 
  | 'Electronics'
  | 'Clothing'
  | 'Bags'
  | 'Jewelry'
  | 'Documents'
  | 'Keys'
  | 'Books'
  | 'Sports Equipment'
  | 'Other';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  type: ItemType;
  location: string;
  dateReported: string;
  contactEmail: string;
  contactPhone?: string;
  imageUrl?: string;
  reward?: number;
  status: 'active' | 'claimed';
  latitude?: number;
  longitude?: number;
  locationCoords?: [number, number] | null;
}

export interface PotentialMatch {
  item: Item;
  similarity: number;
  matchReasons: string[];
}