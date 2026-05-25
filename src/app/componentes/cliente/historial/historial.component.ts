import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService } from '../../../servicios/db.servicio';
import { CommonFindPipe } from '../../../filtros/buscar.pipe';

@Component({
  selector: 'app-client-history',
  standalone: true,
  imports: [CommonModule, CommonFindPipe],
  templateUrl: './historial.component.html'
})
export class ClientHistoryComponent {
  public dbService = inject(DbService);
  @Output() alertTriggered = new EventEmitter<any>();

  public getClientAppointments(): any[] {
    const client = this.dbService.currentClient();
    if (!client) return [];
    return this.dbService.db().citas.filter((c: any) => c.clienteId === client.id);
  }

  public getBarberRealName(barberId: number): string {
    const b = this.dbService.db().barberos.find((x: any) => x.id === barberId);
    const u = b ? this.dbService.db().users.find((x: any) => x.id === b.usuarioId) : null;
    return u ? u.nombre : 'Barbero';
  }

  public cancelAppointment(citaId: number) {
    const db = this.dbService.db();
    const cita = db.citas.find((c: any) => c.id === citaId);
    
    if (cita) {
      const prevEstado = cita.estado_actual;
      cita.estado_actual = 'Cancelada';
      
      db.historialCitas.push({
        id: db.historialCitas.length + 1,
        citaId: cita.id,
        fecha_cambio: new Date().toISOString(),
        estado_anterior: prevEstado,
        estado_nuevo: 'Cancelada'
      });

      this.dbService.saveDB(db);
      this.alertTriggered.emit({ message: 'Su cita ha sido cancelada exitosamente', type: 'success' });
    }
  }
}
