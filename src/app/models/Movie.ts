export interface Movie {
  id: number;
  title?: string | null;
  year?: string | null; // stored as varchar(4)
  watched: boolean; // defaults to false in DB
  rating?: number | null;
  comments?: string | null;
  poster?: string | null;
  summary?: string | null;
  available?: boolean | null; // not stored in DB
  requested?: boolean | null; // not stored in DB
  critic?: string | null;
  backdrop?: string | null;
  added?: boolean | null;
}
