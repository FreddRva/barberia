import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService } from '../../../servicios/db.servicio';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen.component.html'
})
export class AdminDashboardComponent {
  public dbService = inject(DbService);

  public getTotalRevenue(): number {
    return this.dbService.db().pagos
      .filter((p: any) => p.estado_pago === 'Completado')
      .reduce((sum: number, p: any) => sum + p.monto_total, 0);
  }

  public getActiveAppointmentsCount(): number {
    return this.dbService.db().citas
      .filter((c: any) => c.estado_actual === 'Confirmada' || c.estado_actual === 'Pendiente')
      .length;
  }

  public getLowStockCount(): number {
    return this.dbService.db().inventario
      .filter((i: any) => i.stock_actual <= i.stock_minimo)
      .length;
  }

  public getTopBarberName(): string {
    const counts: any = {};
    this.dbService.db().citas.forEach((c: any) => {
      if (c.estado_actual === 'Completada' || c.estado_actual === 'Confirmada') {
        counts[c.barberoId] = (counts[c.barberoId] || 0) + 1;
      }
    });

    let topId: number | null = null;
    let max = -1;
    Object.keys(counts).forEach(id => {
      if (counts[id] > max) {
        max = counts[id];
        topId = Number(id);
      }
    });

    if (!topId) return 'Ninguno';
    const b = this.dbService.db().barberos.find((x: any) => x.id === topId);
    const u = b ? this.dbService.db().users.find((x: any) => x.id === b.usuarioId) : null;
    return u ? u.nombre.split(' ')[0] : 'Barbero';
  }
}
