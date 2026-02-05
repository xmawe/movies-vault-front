import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertTriangle, X } from 'lucide-angular';

@Component({
  selector: 'app-confirm-modal',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './confirm-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly title = input<string>('Confirm Action');
  readonly message = input.required<string>();
  readonly confirmText = input<string>('Confirm');
  readonly cancelText = input<string>('Cancel');
  readonly confirmButtonClass = input<string>('bg-red-500 hover:bg-red-600');
  readonly loading = input<boolean>(false);
  
  readonly confirm = output<void>();
  readonly cancel = output<void>();

  protected readonly AlertIcon = AlertTriangle;
  protected readonly XIcon = X;

  protected onConfirm(): void {
    this.confirm.emit();
  }

  protected onCancel(): void {
    this.cancel.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.loading()) {
      this.onCancel();
    }
  }
}
