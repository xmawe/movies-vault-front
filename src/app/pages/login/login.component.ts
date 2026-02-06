import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormInputComponent } from '../../components/form-input/form-input.component';
import { LucideAngularModule, AtSign, Lock } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormInputComponent, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  
  protected readonly loginForm: FormGroup;
  protected readonly AtSignIcon = AtSign;
  protected readonly LockIcon = Lock;
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/movies']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Login failed. Please check your credentials.');
      }
    });
  }

  protected getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
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
      email: 'Email',
      password: 'Password',
    };
    return labels[fieldName] || fieldName;
  }

  protected getControl(fieldName: string): FormControl {
    return this.loginForm.get(fieldName) as FormControl;
  }
}
