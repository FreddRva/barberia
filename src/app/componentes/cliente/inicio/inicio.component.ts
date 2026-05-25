import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html'
})
export class ClientHomeComponent {
  @Output() reserveClicked = new EventEmitter<void>();

  public onReserve() {
    this.reserveClicked.emit();
  }
}
