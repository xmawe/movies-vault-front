import { Component, inject, signal, OnInit, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, Pencil, Trash2, Search, Plus, Star, LogOut } from 'lucide-angular';
import { Movie } from '../../models/movie.model';
import { MovieStats } from '../../models/movie-stats.model';
import { MovieModalComponent } from '../movie-modal/movie-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { FormInputComponent } from '../form-input/form-input.component';
import { DashboardMetricsComponent } from "../dashobard-metrics/dasuboard-metrics.component";

@Component({
  selector: 'app-movie-list',
  imports: [LucideAngularModule, CommonModule, MovieModalComponent, ConfirmModalComponent, FormInputComponent, ReactiveFormsModule, DashboardMetricsComponent],
  templateUrl: './movie-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  protected readonly authService = inject(AuthService);

  protected readonly movies = signal<Movie[]>([]);
  protected readonly stats = signal<MovieStats | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly modalOpen = signal(false);
  protected readonly modalLoading = signal(false);
  protected readonly editingMovieId = signal<number | null>(null);
  protected readonly editingMovieData = signal<any>(null);
  protected readonly deleteConfirmOpen = signal(false);
  protected readonly deleteLoading = signal(false);
  protected readonly movieToDelete = signal<{ id: number; title: string } | null>(null);
  protected readonly searchControl = new FormControl('');
  protected readonly PencilIcon = Pencil;
  protected readonly TrashIcon = Trash2;
  protected readonly SearchIcon = Search;
  protected readonly PlusIcon = Plus;
  protected readonly StarIcon = Star;
  protected readonly LogOutIcon = LogOut;

  constructor() {
    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((keyword) => {
        this.performSearch(keyword || '');
      });
  }

  ngOnInit(): void {
    this.loadMovies();
    this.loadStats();
  }

  protected loadMovies(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movies.set(movies);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load movies. Please try again.');
        this.loading.set(false);
        console.error('Error loading movies:', err);
      }
    });
  }

  private loadStats(): void {
    this.movieService.getStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
      },
      error: (err) => {
        console.error('Error loading stats:', err);
      }
    });
  }

  private performSearch(keyword: string): void {
    if (!keyword.trim()) {
      this.loadMovies();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.movieService.searchMovies(keyword).subscribe({
      next: (movies) => {
        this.movies.set(movies);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to search movies. Please try again.');
        this.loading.set(false);
        console.error('Error searching movies:', err);
      }
    });
  }

  protected deleteMovie(data: { id: number; title: string }): void {
    this.movieToDelete.set(data);
    this.deleteConfirmOpen.set(true);
  }

  protected confirmDelete(): void {
    const movie = this.movieToDelete();
    if (!movie) return;

    this.deleteLoading.set(true);
    this.movieService.deleteMovie(movie.id).subscribe({
      next: () => {
        this.deleteLoading.set(false);
        this.deleteConfirmOpen.set(false);
        this.movieToDelete.set(null);
        this.loadMovies();
        this.loadStats();
      },
      error: (err) => {
        this.deleteLoading.set(false);
        alert('Failed to delete movie. Please try again.');
        console.error('Error deleting movie:', err);
      }
    });
  }

  protected cancelDelete(): void {
    this.deleteConfirmOpen.set(false);
    this.movieToDelete.set(null);
  }

  protected editMovie(id: number): void {
    const movie = this.movies().find(m => m.id === id);
    if (movie) {
      this.editingMovieId.set(id);
      this.editingMovieData.set({
        title: movie.title,
        director: movie.director,
        genre: movie.genre,
        releaseYear: movie.releaseYear,
        rating: movie.rating
      });
      this.modalOpen.set(true);
    }
  }

  protected createMovie(): void {
    this.editingMovieId.set(null);
    this.editingMovieData.set(null);
    this.modalOpen.set(true);
  }

  protected closeModal(): void {
    this.modalOpen.set(false);
    this.editingMovieId.set(null);
    this.editingMovieData.set(null);
  }

  protected saveMovie(movieData: any): void {
    this.modalLoading.set(true);

    const request = this.editingMovieId()
      ? this.movieService.updateMovie(this.editingMovieId()!, movieData)
      : this.movieService.createMovie(movieData);

    request.subscribe({
      next: () => {
        this.modalLoading.set(false);
        this.closeModal();
        this.loadMovies();
        this.loadStats();
      },
      error: (err) => {
        this.modalLoading.set(false);
        alert('Failed to save movie. Please try again.');
        console.error('Error saving movie:', err);
      }
    });
  }
}
