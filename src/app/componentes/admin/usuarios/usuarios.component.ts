import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService } from '../../../servicios/db.servicio';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html'
})
export class AdminUsersComponent {
  public dbService = inject(DbService);
  @Output() alertTriggered = new EventEmitter<any>();

  public searchQuery = signal<string>('');
  public editingUser = signal<any | null>(null);

  // Form properties
  public formUsername = signal<string>('');
  public formNombre = signal<string>('');
  public formEmail = signal<string>('');
  public formTelefono = signal<string>('');
  public formPassword = signal<string>('');
  public formRolId = signal<number>(3);

  public getUsersList(): any[] {
    const list = this.dbService.db().users;
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return list;
    return list.filter((u: any) => u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  public toggleUserStatus(userId: number) {
    const db = this.dbService.db();
    const u = db.users.find((x: any) => x.id === userId);
    if (u) {
      u.activo = !u.activo;
      this.dbService.saveDB(db);
      this.alertTriggered.emit({ message: `Estado de ${u.nombre} modificado`, type: 'success' });
    }
  }

  public openCreateForm() {
    this.editingUser.set({ id: null }); this.formUsername.set(''); this.formNombre.set('');
    this.formEmail.set(''); this.formTelefono.set(''); this.formPassword.set(''); this.formRolId.set(3);
  }

  public openEditForm(user: any) {
    this.editingUser.set(user); this.formUsername.set(user.username); this.formNombre.set(user.nombre);
    this.formEmail.set(user.email); this.formTelefono.set(user.telefono || '');
    this.formPassword.set(user.password_hash); this.formRolId.set(user.rolId);
  }

  public saveUser() {
    const db = this.dbService.db();
    const isEdit = this.editingUser()?.id !== null;

    if (isEdit) {
      const u = db.users.find((x: any) => x.id === this.editingUser().id);
      if (u) {
        u.username = this.formUsername();
        u.nombre = this.formNombre();
        u.email = this.formEmail();
        u.telefono = this.formTelefono();
        u.password_hash = this.formPassword();
        u.rolId = Number(this.formRolId());
      }
    } else {
      const nextId = db.users.length > 0 ? Math.max(...db.users.map((x: any) => x.id)) + 1 : 1;
      const newUser = {
        id: nextId,
        username: this.formUsername(),
        nombre: this.formNombre(),
        email: this.formEmail(),
        telefono: this.formTelefono(),
        password_hash: this.formPassword(),
        rolId: Number(this.formRolId()),
        activo: true
      };
      db.users.push(newUser);

      if (newUser.rolId === 3) {
        db.clientes.push({
          id: db.clientes.length > 0 ? Math.max(...db.clientes.map((c: any) => c.id)) + 1 : 1,
          usuarioId: newUser.id,
          fecha_registro: new Date().toISOString().split('T')[0],
          puntos_saldo: 0
        });
      }
    }

    this.dbService.saveDB(db);
    this.editingUser.set(null);
    this.alertTriggered.emit({ message: isEdit ? 'Usuario modificado' : 'Usuario creado', type: 'success' });
  }
}
