import { Injectable, signal, effect } from '@angular/core';
import * as defs from './db-valores';

const KEYS = ['users', 'roles', 'clientes', 'barberos', 'servicios', 'inventario', 'proveedores', 'citas', 'pagos', 'historialPuntos', 'historialCitas', 'historialStock', 'ordenCompra'];

@Injectable({
  providedIn: 'root'
})
export class DbService {
  public db = signal<any>({
    users: [], roles: [], clientes: [], barberos: [], servicios: [], inventario: [],
    proveedores: [], citas: [], pagos: [], historialPuntos: [], historialCitas: [],
    historialStock: [], ordenCompra: []
  });

  public currentUser = signal<any>(null);
  public currentClient = signal<any>(null);

  constructor() {
    this.loadDatabase();

    effect(() => {
      const state = this.db();
      if (state.users && state.users.length > 0) {
        KEYS.forEach(key => {
          localStorage.setItem('elite_' + key, JSON.stringify(state[key]));
        });
      }
    });
  }

  private loadDatabase() {
    const loaded: any = {};
    const defaults: any = defs;
    KEYS.forEach(k => {
      const v = localStorage.getItem('elite_' + k);
      const defKey = 'DEFAULT_' + k.replace(/([A-Z])/g, "_$1").toUpperCase();
      loaded[k] = v ? JSON.parse(v) : defaults[defKey];
    });

    this.db.set(loaded);

    const session = localStorage.getItem('elitesession');
    if (session) {
      const user = JSON.parse(session);
      this.currentUser.set(user);
      if (user.rolId === 3) {
        this.currentClient.set(loaded.clientes.find((c: any) => c.usuarioId === user.id));
      }
    }
  }

  public saveDB(data: any) {
    this.db.set({ ...data });
  }

  public resetAll() {
    localStorage.clear();
    this.currentUser.set(null);
    this.currentClient.set(null);
    this.loadDatabase();
  }
}
