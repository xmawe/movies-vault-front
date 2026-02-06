import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormInputComponent } from '../../components/form-input/form-input.component';
import { LucideAngularModule, AtSign, Lock, User } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormInputComponent, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  
  protected readonly registerForm: FormGroup;
  protected readonly AtSignIcon = AtSign;
  protected readonly LockIcon = Lock;
  protected readonly UserIcon = User;
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  protected onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/movies']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Registration failed. Please try again.');
      }
    });
  }

  protected getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
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
      username: 'Username',
      email: 'Email',
      password: 'Password',
    };
    return labels[fieldName] || fieldName;
  }

  protected getControl(fieldName: string): FormControl {
    return this.registerForm.get(fieldName) as FormControl;
  }
}
