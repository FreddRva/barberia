import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Subcomponentes Modulares en Español
import { LoginComponent } from './componentes/login/login.component';
import { ClientLayoutComponent } from './componentes/cliente/menu-cliente/menu-cliente.component';
import { AdminLayoutComponent } from './componentes/admin/menu-admin/menu-admin.component';
import { DbService } from './servicios/db.servicio';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    ClientLayoutComponent,
    AdminLayoutComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public dbService = inject(DbService);

  // Router interno de la SPA
  public activeView = signal<string>('login');

  // Alertas flotantes
  public alertState = signal<any>({
    message: '',
    type: 'success',
    active: false
  });

  public triggerAlert(alert: any) {
    this.alertState.set({
      message: alert.message,
      type: alert.type || 'success',
      active: true
    });

    setTimeout(() => {
      this.alertState.update((state: any) => ({ ...state, active: false }));
    }, 3500);
  }

  public handleViewChange(view: string) {
    this.activeView.set(view);
  }
}
