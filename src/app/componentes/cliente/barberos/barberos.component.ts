import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService } from '../../../servicios/db.servicio';

@Component({
  selector: 'app-client-barbers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barberos.component.html'
})
export class ClientBarbersComponent {
  public dbService = inject(DbService);

  @Output() selectBarberToBook = new EventEmitter<number>();

  public searchQuery = signal<string>('');
  public specFilter = signal<string>('Todas');

  public getBarbers(): any[] {
    const list = this.dbService.db().barberos.filter((b: any) => b.estado_laboral === 'Activo');
    const q = this.searchQuery().toLowerCase().trim();
    const spec = this.specFilter();

    return list.filter((b: any) => {
      const u = this.dbService.db().users.find((x: any) => x.id === b.usuarioId);
      const name = u ? u.nombre.toLowerCase() : '';
      const matchesSearch = name.includes(q) || b.especialidad.toLowerCase().includes(q);
      const matchesSpec = spec === 'Todas' || b.especialidad.includes(spec);
      return matchesSearch && matchesSpec;
    });
  }

  public getBarberRealName(usuarioId: number): string {
    const u = this.dbService.db().users.find((x: any) => x.id === usuarioId);
    return u ? u.nombre : 'Barbero';
  }

  public getBarberTitle(id: number): string {
    return id === 1 ? 'Barbero Senior' : id === 2 ? 'Barbero Profesional' : 'Barbero Master';
  }

  public getBarberExp(id: number): number {
    return id === 1 ? 5 : id === 2 ? 3 : 7;
  }

  public getBarberRating(id: number): string {
    return id === 1 ? '4.9 (128 reseñas)' : id === 2 ? '4.8 (96 reseñas)' : '5.0 (210 reseñas)';
  }

  public getBarberSpecs(spec: string): string[] {
    return spec.split(' y ').map(s => s.trim());
  }

  public getBarberImage(id: number): string {
    return id === 1 ? 'service_classic.png' : id === 2 ? 'service_beard.png' : 'service_facial.png';
  }

  public quickBook(barberId: number) {
    this.selectBarberToBook.emit(barberId);
  }
}
