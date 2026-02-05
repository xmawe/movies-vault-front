import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, CreateMovieDto, UpdateMovieDto } from '../models/movie.model';
import { MovieStats } from '../models/movie-stats.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5224/api/movies';

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  searchMovies(keyword: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/search`, {
      params: { keyword }
    });
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  createMovie(movie: CreateMovieDto): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie);
  }

  updateMovie(id: number, movie: UpdateMovieDto): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/${id}`, movie);
  }

  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<MovieStats> {
    return this.http.get<MovieStats>(`${this.apiUrl}/stats`);
  }
}
