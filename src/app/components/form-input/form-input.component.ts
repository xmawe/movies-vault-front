import { Component, input, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeClosed } from 'lucide-angular';

@Component({
  selector: 'app-form-input',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './form-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormInputComponent {
  readonly label = input.required<string>();
  readonly id = input.required<string>();
  readonly control = input.required<FormControl>();
  readonly type = input<any>('text');
  readonly placeholder = input<string>('');
  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);
  readonly step = input<number | null>(null);
  readonly errorMessage = input<string>('');
  readonly icon = input<any>(null);
  readonly password = input<boolean>(false);
  readonly showPassword = signal(false);
  readonly eyeIcon = signal(Eye);
  readonly inputType = signal<string>('password');

  protected get isInvalid(): boolean {
    return !!(this.control().invalid && (this.control().dirty || this.control().touched));
  }

  protected toggleEye(): void {
    this.showPassword.update((prev: boolean) => !prev);
    this.eyeIcon.update((prev) => prev === Eye ? EyeClosed : Eye);
    this.inputType.update(() => this.showPassword() ? 'text': 'password');
  }
}
