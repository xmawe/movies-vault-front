import { Component, input, output, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { LucideAngularModule, X, Film, User, Tag, Calendar, Star } from 'lucide-angular';
import { FormInputComponent } from '../form-input/form-input.component';

@Component({
  selector: 'app-movie-modal',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, FormInputComponent],
  templateUrl: './movie-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly movieId = input<number | null>(null);
  readonly movieData = input<any>(null);
  readonly loading = input<boolean>(false);
  
  readonly close = output<void>();
  readonly save = output<any>();

  protected readonly XIcon = X;
  protected readonly FilmIcon = Film;
  protected readonly UserIcon = User;
  protected readonly TagIcon = Tag;
  protected readonly CalendarIcon = Calendar;
  protected readonly StarIcon = Star;
  protected readonly movieForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.movieForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      director: ['', [Validators.required, Validators.maxLength(100)]],
      genre: ['', [Validators.required, Validators.maxLength(50)]],
      releaseYear: [null, [Validators.required, Validators.min(1888), Validators.max(2100)]],
      rating: [null, [Validators.required, Validators.min(0), Validators.max(10)]]
    });

    effect(() => {
      const data = this.movieData();
      if (data) {
        this.movieForm.patchValue(data);
      } else {
        this.movieForm.reset();
      }
    });
  }

  protected onSubmit(): void {
    if (this.movieForm.invalid) {
      this.movieForm.markAllAsTouched();
      return;
    }

    this.save.emit(this.movieForm.value);
  }

  protected onClose(): void {
    this.movieForm.reset();
    this.close.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  protected getFieldError(fieldName: string): string {
    const field = this.movieForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field?.hasError('maxLength')) {
      return `${this.getFieldLabel(fieldName)} is too long`;
    }
    if (field?.hasError('min')) {
      return `${this.getFieldLabel(fieldName)} is too low`;
    }
    if (field?.hasError('max')) {
      return `${this.getFieldLabel(fieldName)} is too high`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      title: 'Title',
      director: 'Director',
      genre: 'Genre',
      releaseYear: 'Release Year',
      rating: 'Rating'
    };
    return labels[fieldName] || fieldName;
  }

  protected isFieldInvalid(fieldName: string): boolean {
    const field = this.movieForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  protected getControl(fieldName: string): FormControl {
    return this.movieForm.get(fieldName) as FormControl;
  }
}
