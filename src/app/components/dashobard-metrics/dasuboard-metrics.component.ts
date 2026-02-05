import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit, ChangeDetectionStrategy, effect, input } from '@angular/core';
import { MovieStats } from '../../models/movie-stats.model';
import { LucideAngularModule, Star } from 'lucide-angular/src/icons';

@Component({
  selector: 'app-dashboard-metrics',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './dashboard-metrics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardMetricsComponent {
    readonly stats = input<MovieStats | null>(null)
    protected readonly StarIcon = Star;

}