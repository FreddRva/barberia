import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService } from '../../../servicios/db.servicio';
import { ClientHomeComponent } from '../inicio/inicio.component';
import { ClientBookingComponent } from '../reserva/reserva.component';
import { ClientHistoryComponent } from '../historial/historial.component';
import { ClientProfileComponent } from '../perfil/perfil.component';
import { ClientBarbersComponent } from '../barberos/barberos.component';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [
    CommonModule,
    ClientHomeComponent,
    ClientBookingComponent,
    ClientHistoryComponent,
    ClientProfileComponent,
    ClientBarbersComponent
  ],
  templateUrl: './menu-cliente.component.html'
})
export class ClientLayoutComponent {
  public dbService = inject(DbService);

  @Output() viewChanged = new EventEmitter<string>();
  @Output() alertTriggered = new EventEmitter<any>();

  public clientTab = signal<string>('inicio');
  public selectedBarberId = signal<number | null>(null);

  public switchClientTab(tab: string) {
    this.clientTab.set(tab);
    if (tab !== 'reserva') {
      this.selectedBarberId.set(null);
    }
  }

  public handleBarberSelectToBook(barberId: number) {
    this.selectedBarberId.set(barberId);
    this.clientTab.set('reserva');
  }

  public getInitials(name: string): string {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  public logout() {
    localStorage.removeItem('elitesession');
    this.dbService.currentUser.set(null);
    this.dbService.currentClient.set(null);
    this.viewChanged.emit('login');
    this.alertTriggered.emit({ message: 'Sesión cerrada con éxito', type: 'success' });
  }
}
