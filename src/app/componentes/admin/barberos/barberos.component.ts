import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService } from '../../../servicios/db.servicio';

@Component({
  selector: 'app-admin-barbers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barberos.component.html'
})
export class AdminBarbersComponent {
  public dbService = inject(DbService);
  @Output() alertTriggered = new EventEmitter<any>();

  public searchQuery = signal<string>('');
  public editingBarber = signal<any | null>(null);

  // Form properties
  public formUserSearch = signal<number>(0);
  public formRucDni = signal<string>('');
  public formSueldo = signal<number>(1200);
  public formComision = signal<number>(20);
  public formEspecialidad = signal<string>('');
  public formEstado = signal<string>('Activo');

  public getBarbersList(): any[] {
    const list = this.dbService.db().barberos;
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return list;
    return list.filter((b: any) => {
      const u = this.dbService.db().users.find((x: any) => x.id === b.usuarioId);
      const name = u ? u.nombre.toLowerCase() : '';
      return name.includes(q) || b.especialidad.toLowerCase().includes(q);
    });
  }

  public getBarberRealName(usuarioId: number): string {
    return this.dbService.db().users.find((x: any) => x.id === usuarioId)?.nombre || 'Barbero';
  }

  public getAvailableUsersForBarbers(): any[] {
    const db = this.dbService.db();
    return db.users.filter((u: any) => u.rolId === 2 && !db.barberos.some((b: any) => b.usuarioId === u.id));
  }

  public openCreateForm() {
    this.editingBarber.set({ id: null }); this.formUserSearch.set(0); this.formRucDni.set('');
    this.formSueldo.set(1200); this.formComision.set(20);
    this.formEspecialidad.set('Cortes Clásicos y Modernos'); this.formEstado.set('Activo');
  }

  public openEditForm(barber: any) {
    this.editingBarber.set(barber); this.formUserSearch.set(barber.usuarioId); this.formRucDni.set(barber.ruc_dni);
    this.formSueldo.set(barber.sueldo_base); this.formComision.set(barber.comision_porcentaje);
    this.formEspecialidad.set(barber.especialidad); this.formEstado.set(barber.estado_laboral);
  }

  public saveBarber() {
    const db = this.dbService.db();
    const isEdit = this.editingBarber()?.id !== null;

    if (isEdit) {
      const b = db.barberos.find((x: any) => x.id === this.editingBarber().id);
      if (b) {
        b.ruc_dni = this.formRucDni();
        b.sueldo_base = Number(this.formSueldo());
        b.comision_porcentaje = Number(this.formComision());
        b.especialidad = this.formEspecialidad();
        b.estado_laboral = this.formEstado();
      }
    } else {
      if (!this.formUserSearch()) {
        return this.alertTriggered.emit({ message: 'Seleccione una cuenta de usuario vinculada', type: 'error' });
      }
      const nextId = db.barberos.length > 0 ? Math.max(...db.barberos.map((x: any) => x.id)) + 1 : 1;
      const newBarber = {
        id: nextId,
        usuarioId: Number(this.formUserSearch()),
        ruc_dni: this.formRucDni(),
        sueldo_base: Number(this.formSueldo()),
        comision_porcentaje: Number(this.formComision()),
        estado_laboral: this.formEstado(),
        especialidad: this.formEspecialidad()
      };
      db.barberos.push(newBarber);
    }

    this.dbService.saveDB(db);
    this.editingBarber.set(null);
    this.alertTriggered.emit({ message: isEdit ? 'Barbero actualizado' : 'Barbero creado', type: 'success' });
  }
}
