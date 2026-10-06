export interface Movie {
  id: string;
  title: string;
  genre: string;
  year: number;
  rating: number;
  poster: string;
  isWatched: boolean;
}

export interface MovieCardProps {
  movie: Movie;
  layout?: "row" | "tile";
  onSelect: (id: string) => void;
}