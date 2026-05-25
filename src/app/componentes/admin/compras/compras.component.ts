import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService } from '../../../servicios/db.servicio';
import { CommonFindPipe } from '../../../filtros/buscar.pipe';

@Component({
  selector: 'app-admin-purchases',
  standalone: true,
  imports: [CommonModule, FormsModule, CommonFindPipe],
  templateUrl: './compras.component.html'
})
export class AdminPurchasesComponent {
  public dbService = inject(DbService);
  @Output() alertTriggered = new EventEmitter<any>();

  public isCreatingOrder = signal<boolean>(false);

  // Form properties
  public formProveedorId = signal<number>(0);
  public formItemId = signal<number>(0);
  public formCantidad = signal<number>(10);
  public formCostoUnitario = signal<number>(15);

  public getSupplierName(id: number): string {
    const p = this.dbService.db().proveedores.find((x: any) => x.id === id);
    return p ? p.razon_social : 'Desconocido';
  }

  public getAvailableItems(): any[] {
    return this.dbService.db().inventario;
  }

  public saveOrder() {
    const db = this.dbService.db();
    const provId = Number(this.formProveedorId());
    const itemId = Number(this.formItemId());
    const qty = Number(this.formCantidad());
    const cost = Number(this.formCostoUnitario());

    if (!provId || !itemId || qty <= 0 || cost <= 0) {
      return this.alertTriggered.emit({ message: 'Por favor, complete todos los campos requeridos', type: 'error' });
    }

    const item = db.inventario.find((x: any) => x.id === itemId);
    if (item) {
      item.stock_actual += qty;
      
      db.historialStock.push({
        id: db.historialStock.length + 1,
        itemId: item.id,
        fecha: new Date().toISOString(),
        tipo_movimiento: 'ENTRADA',
        cantidad: qty
      });
    }

    const totalCost = qty * cost;
    const nextOrderId = db.ordenCompra.length > 0 ? Math.max(...db.ordenCompra.map((o: any) => o.id)) + 1 : 3001;
    
    db.ordenCompra.push({
      id: nextOrderId,
      proveedorId: provId,
      fecha_ingreso: new Date().toISOString().split('T')[0],
      total_costo: totalCost,
      detalles: [{ itemId, cantidad: qty, precio_costo_unitario: cost }]
    });

    this.dbService.saveDB(db);
    this.isCreatingOrder.set(false);
    this.alertTriggered.emit({ message: `Orden de Compra #${nextOrderId} registrada y stock actualizado`, type: 'success' });
  }
}
