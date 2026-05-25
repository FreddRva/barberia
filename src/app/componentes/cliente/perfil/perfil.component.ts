import { Component, inject, signal, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService } from '../../../servicios/db.servicio';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html'
})
export class ClientProfileComponent implements OnInit {
  public dbService = inject(DbService);
  @Output() alertTriggered = new EventEmitter<any>();

  public name = signal<string>('');
  public phone = signal<string>('');
  public password = signal<string>('');

  public ngOnInit() {
    const u = this.dbService.currentUser();
    if (u) {
      this.name.set(u.nombre);
      this.phone.set(u.telefono || '');
      this.password.set(u.password_hash);
    }
  }

  public saveProfile() {
    const db = this.dbService.db();
    const u = this.dbService.currentUser();
    if (!u) return;

    const userInDb = db.users.find((x: any) => x.id === u.id);
    if (userInDb) {
      userInDb.nombre = this.name();
      userInDb.telefono = this.phone();
      userInDb.password_hash = this.password();

      this.dbService.currentUser.set({ ...userInDb });
      localStorage.setItem('elitesession', JSON.stringify(userInDb));
      this.dbService.saveDB(db);

      this.alertTriggered.emit({ message: 'Perfil actualizado exitosamente', type: 'success' });
    }
  }
}
