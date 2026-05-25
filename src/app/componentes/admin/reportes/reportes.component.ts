import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html'
})
export class AdminReportsComponent {
  public reportType = signal<string>('ventas');
  public startDate = signal<string>('2026-05-01');
  public endDate = signal<string>('2026-05-31');

  public exportReport(format: string) {
    alert(`[Simulación] Exportando reporte de ${this.reportType().toUpperCase()} en formato ${format.toUpperCase()} desde ${this.startDate()} hasta ${this.endDate()}`);
  }
}
