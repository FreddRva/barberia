import { Component, inject, signal, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService } from '../../../servicios/db.servicio';
import { CommonFindPipe } from '../../../filtros/buscar.pipe';

@Component({
  selector: 'app-client-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, CommonFindPipe],
  templateUrl: './reserva.component.html'
})
export class ClientBookingComponent {
  public dbService = inject(DbService);
  @Output() alertTriggered = new EventEmitter<any>();

  @Input() set preselectedBarberId(id: number | null) {
    if (id) this.selectedBarberId.set(id);
  }

  public step = signal<number>(1);
  public selectedServices = signal<number[]>([]);
  public selectedBarberId = signal<number | null>(null);
  public selectedDate = signal<string>(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  public selectedTime = signal<string>('');
  public paymentMethod = signal<string>('Yape');
  public receiptData = signal<any | null>(null);
  public tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  public getBarberRealName(id: number): string {
    const b = this.dbService.db().barberos.find((x: any) => x.id === id);
    return this.dbService.db().users.find((x: any) => x.id === b?.usuarioId)?.nombre || 'Barbero';
  }

  public getBookingSumTotal(): number {
    return this.selectedServices().reduce((sum, id) => sum + (this.dbService.db().servicios.find((x: any) => x.id === id)?.precio || 0), 0);
  }

  public toggleService(id: number) {
    const list = this.selectedServices();
    this.selectedServices.set(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  }

  public selectBarber(id: number) {
    this.selectedBarberId.set(id); this.selectedTime.set('');
  }

  public getBarberTimeSlots(barberId: number, date: string) {
    const hours = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'];
    const reserved = this.dbService.db().citas.filter((c: any) => c.barberoId === barberId && c.fecha_programada === date && c.estado_actual !== 'Cancelada').map((c: any) => c.hora_programada);
    return hours.map(h => ({ time: h, disabled: reserved.includes(h) }));
  }

  public nextStep(target: number) {
    if (target === 2 && this.selectedServices().length === 0) {
      return this.alertTriggered.emit({ message: 'Elija al menos un servicio', type: 'error' });
    }
    if (target === 3 && (!this.selectedBarberId() || !this.selectedTime())) {
      return this.alertTriggered.emit({ message: 'Elija barbero y horario disponible', type: 'error' });
    }
    this.step.set(target);
  }

  public confirmBooking() {
    const db = this.dbService.db(), client = this.dbService.currentClient();
    if (!client) return;
    const newId = db.citas.length > 0 ? Math.max(...db.citas.map((c: any) => c.id)) + 1 : 1001;
    const sumTotal = this.getBookingSumTotal(), adelanto = sumTotal * 0.20;
    const newCita = {
      id: newId, clienteId: client.id, barberoId: this.selectedBarberId(),
      fecha_reserva: new Date().toISOString(), fecha_programada: this.selectedDate(),
      hora_programada: this.selectedTime(), serviciosIds: [...this.selectedServices()],
      estado_actual: 'Confirmada', monto_adelanto: adelanto, total: sumTotal, metodo_pago: this.paymentMethod()
    };
    db.citas.push(newCita);
    const pagId = db.pagos.length > 0 ? Math.max(...db.pagos.map((p: any) => p.id)) + 1 : 2001;
    const compNum = 'B001-' + String(pagId).padStart(7, '0');
    db.pagos.push({ id: pagId, citaId: newId, fecha: new Date().toISOString(), monto_total: adelanto, metodo_pago: this.paymentMethod(), comprobante: compNum, estado_pago: 'Completado' });
    const pts = Math.floor(sumTotal * 0.15);
    client.puntos_saldo += pts;
    db.historialPuntos.push({ id: db.historialPuntos.length + 1, clienteId: client.id, fecha: new Date().toISOString(), cantidad: pts, motivo: `Reserva Cita #${newId}` });
    this.dbService.saveDB(db);
    this.receiptData.set({ cita: newCita, comprobante: compNum, adelanto, puntosGanados: pts });
    this.alertTriggered.emit({ message: '¡Cita agendada exitosamente!', type: 'success' });
  }

  public closeReceipt() {
    this.receiptData.set(null); this.step.set(1); this.selectedServices.set([]);
    this.selectedBarberId.set(null); this.selectedTime.set('');
  }
}
