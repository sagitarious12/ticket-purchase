
export interface Concert {
  id: number;
  price: number;
  date: number;
  title: string;
  description: string;
  additionalArtists: string[];
  sellerNotes: string;
  artistImage: string;
  city: string;
  venue: string;
}