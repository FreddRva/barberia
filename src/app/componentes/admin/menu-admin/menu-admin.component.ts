import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService } from '../../../servicios/db.servicio';
import { AdminDashboardComponent } from '../resumen/resumen.component';
import { AdminUsersComponent } from '../usuarios/usuarios.component';
import { AdminBarbersComponent } from '../barberos/barberos.component';
import { AdminServicesComponent } from '../servicios/servicios.component';
import { AdminInventoryComponent } from '../inventario/inventario.component';
import { AdminPurchasesComponent } from '../compras/compras.component';
import { AdminReportsComponent } from '../reportes/reportes.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminBarbersComponent,
    AdminServicesComponent,
    AdminInventoryComponent,
    AdminPurchasesComponent,
    AdminReportsComponent
  ],
  templateUrl: './menu-admin.component.html'
})
export class AdminLayoutComponent {
  public dbService = inject(DbService);

  @Output() viewChanged = new EventEmitter<string>();
  @Output() alertTriggered = new EventEmitter<any>();

  public adminTab = signal<string>('dashboard');

  public switchAdminTab(tab: string) {
    this.adminTab.set(tab);
  }

  public logout() {
    localStorage.removeItem('elitesession');
    this.dbService.currentUser.set(null);
    this.viewChanged.emit('login');
    this.alertTriggered.emit({ message: 'Sesión cerrada con éxito', type: 'success' });
  }

  public getInitials(name: string): string {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  public getMenuClass(tab: string): string {
    const base = 'flex items-center gap-3 py-2 px-3 rounded hover:bg-white/5 hover:text-white transition text-left cursor-pointer w-full';
    return `${base} ${this.adminTab() === tab ? 'bg-gold/10 text-gold font-bold' : 'text-zinc-400'}`;
  }
}
