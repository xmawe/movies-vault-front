export interface Movie {
  id: number;
  title: string;
  director: string;
  genre: string;
  releaseYear: number;
  rating: number;
}

export interface CreateMovieDto {
  title: string;
  director: string;
  genre: string;
  releaseYear: number;
  rating: number;
}

export interface UpdateMovieDto {
  title: string;
  director: string;
  genre: string;
  releaseYear: number;
  rating: number;
}
