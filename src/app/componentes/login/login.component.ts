import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService } from '../../servicios/db.servicio';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  public dbService = inject(DbService);

  @Output() viewChanged = new EventEmitter<string>();
  @Output() alertTriggered = new EventEmitter<any>();

  public email = signal<string>('');
  public password = signal<string>('');

  public handleLogin() {
    const users = this.dbService.db().users;
    const match = users.find((u: any) => u.email === this.email() && u.password_hash === this.password());
    
    if (match) {
      if (!match.activo) {
        this.alertTriggered.emit({ message: 'Usuario desactivado', type: 'error' });
        return;
      }
      this.dbService.currentUser.set(match);
      localStorage.setItem('elitesession', JSON.stringify(match));

      if (match.rolId === 3) {
        const client = this.dbService.db().clientes.find((c: any) => c.usuarioId === match.id);
        this.dbService.currentClient.set(client);
        this.viewChanged.emit('client');
      } else {
        this.viewChanged.emit('admin');
      }
      this.alertTriggered.emit({ message: `¡Bienvenido, ${match.nombre}!`, type: 'success' });
    } else {
      this.alertTriggered.emit({ message: 'Credenciales inválidas', type: 'error' });
    }
  }

  public quickLogin(email: string, pass: string) {
    this.email.set(email);
    this.password.set(pass);
    this.handleLogin();
  }
}
