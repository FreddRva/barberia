import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService } from '../../../servicios/db.servicio';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html'
})
export class AdminInventoryComponent {
  public dbService = inject(DbService);
  @Output() alertTriggered = new EventEmitter<any>();

  public searchQuery = signal<string>('');
  public editingItem = signal<any | null>(null);
  public movementItem = signal<any | null>(null);

  // Form properties
  public formNombre = signal<string>('');
  public formTipo = signal<string>('Venta');
  public formStockActual = signal<number>(10);
  public formStockMin = signal<number>(3);
  public formPrecioVenta = signal<number>(35);
  public formPuntos = signal<number>(10);
  public formUnidad = signal<string>('Unidades');

  // Movement Form
  public movTipo = signal<string>('ENTRADA');
  public movCant = signal<number>(1);

  public getInventoryList(): any[] {
    const list = this.dbService.db().inventario;
    const q = this.searchQuery().toLowerCase().trim();
    return q ? list.filter((i: any) => i.nombre.toLowerCase().includes(q) || i.tipo.toLowerCase().includes(q)) : list;
  }

  public openForm(item: any = null) {
    this.editingItem.set(item || { id: null });
    this.formNombre.set(item ? item.nombre : '');
    this.formTipo.set(item ? item.tipo : 'Venta');
    this.formStockActual.set(item ? item.stock_actual : 10);
    this.formStockMin.set(item ? item.stock_minimo : 3);
    this.formPrecioVenta.set(item ? (item.precio_venta || 0) : 35);
    this.formPuntos.set(item ? (item.puntos_que_otorga || 0) : 10);
    this.formUnidad.set(item ? (item.unidad_medida || 'Unidades') : 'Unidades');
  }

  public saveItem() {
    const db = this.dbService.db();
    const isEdit = this.editingItem()?.id !== null;
    const itemData = {
      nombre: this.formNombre(), tipo: this.formTipo(),
      stock_actual: Number(this.formStockActual()), stock_minimo: Number(this.formStockMin()),
      precio_venta: this.formTipo() === 'Venta' ? Number(this.formPrecioVenta()) : 0,
      puntos_que_otorga: this.formTipo() === 'Venta' ? Number(this.formPuntos()) : 0,
      unidad_medida: this.formTipo() === 'Insumo' ? this.formUnidad() : ''
    };
    if (isEdit) {
      const i = db.inventario.find((x: any) => x.id === this.editingItem().id);
      if (i) Object.assign(i, itemData);
    } else {
      const nextId = db.inventario.length > 0 ? Math.max(...db.inventario.map((x: any) => x.id)) + 1 : 1;
      db.inventario.push({ id: nextId, ...itemData });
    }
    this.dbService.saveDB(db);
    this.editingItem.set(null);
    this.alertTriggered.emit({ message: isEdit ? 'Producto modificado' : 'Producto creado', type: 'success' });
  }

  public deleteItem(id: number) {
    const db = this.dbService.db();
    db.inventario = db.inventario.filter((x: any) => x.id !== id);
    this.dbService.saveDB(db);
    this.alertTriggered.emit({ message: 'Producto eliminado', type: 'success' });
  }

  public openMovementForm(item: any) {
    this.movementItem.set(item); this.movTipo.set('ENTRADA'); this.movCant.set(1);
  }

  public applyMovement() {
    const db = this.dbService.db();
    const item = db.inventario.find((x: any) => x.id === this.movementItem().id);
    if (item) {
      const qty = Number(this.movCant());
      if (this.movTipo() === 'SALIDA' && item.stock_actual < qty) {
        return this.alertTriggered.emit({ message: 'Stock insuficiente', type: 'error' });
      }
      item.stock_actual += this.movTipo() === 'ENTRADA' ? qty : -qty;
      db.historialStock.push({ id: db.historialStock.length + 1, itemId: item.id, fecha: new Date().toISOString(), tipo_movimiento: this.movTipo(), cantidad: qty });
      this.dbService.saveDB(db);
      this.movementItem.set(null);
      this.alertTriggered.emit({ message: 'Movimiento registrado', type: 'success' });
    }
  }
}
