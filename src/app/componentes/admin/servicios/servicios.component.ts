import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService } from '../../../servicios/db.servicio';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios.component.html'
})
export class AdminServicesComponent {
  public dbService = inject(DbService);
  @Output() alertTriggered = new EventEmitter<any>();

  public searchQuery = signal<string>('');
  public editingService = signal<any | null>(null);

  // Form properties
  public formNombre = signal<string>('');
  public formDescripcion = signal<string>('');
  public formPrecio = signal<number>(40);
  public formDuracion = signal<number>(30);
  public formPerfil = signal<string>('Caballeros');

  public getServicesList(): any[] {
    const list = this.dbService.db().servicios;
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return list;
    return list.filter((s: any) => s.nombre.toLowerCase().includes(q) || s.descripcion.toLowerCase().includes(q));
  }

  public openCreateForm() {
    this.editingService.set({ id: null });
    this.formNombre.set('');
    this.formDescripcion.set('');
    this.formPrecio.set(40);
    this.formDuracion.set(30);
    this.formPerfil.set('Caballeros');
  }

  public openEditForm(service: any) {
    this.editingService.set(service);
    this.formNombre.set(service.nombre);
    this.formDescripcion.set(service.descripcion);
    this.formPrecio.set(service.precio);
    this.formDuracion.set(service.duracion_minutos);
    this.formPerfil.set(service.perfil_cliente);
  }

  public saveService() {
    const db = this.dbService.db();
    const isEdit = this.editingService()?.id !== null;

    if (isEdit) {
      const s = db.servicios.find((x: any) => x.id === this.editingService().id);
      if (s) {
        s.nombre = this.formNombre();
        s.descripcion = this.formDescripcion();
        s.precio = Number(this.formPrecio());
        s.duracion_minutos = Number(this.formDuracion());
        s.perfil_cliente = this.formPerfil();
      }
    } else {
      const nextId = db.servicios.length > 0 ? Math.max(...db.servicios.map((x: any) => x.id)) + 1 : 1;
      db.servicios.push({
        id: nextId,
        nombre: this.formNombre(),
        descripcion: this.formDescripcion(),
        precio: Number(this.formPrecio()),
        duracion_minutos: Number(this.formDuracion()),
        perfil_cliente: this.formPerfil(),
        imagen: 'service_classic.png'
      });
    }

    this.dbService.saveDB(db);
    this.editingService.set(null);
    this.alertTriggered.emit({ message: isEdit ? 'Servicio modificado' : 'Servicio creado', type: 'success' });
  }

  public deleteService(serviceId: number) {
    const db = this.dbService.db();
    db.servicios = db.servicios.filter((x: any) => x.id !== serviceId);
    this.dbService.saveDB(db);
    this.alertTriggered.emit({ message: 'Servicio eliminado con éxito', type: 'success' });
  }
}
