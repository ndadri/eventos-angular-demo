// src/app/componentes/buscador-tarea/buscador-tarea.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buscador-tarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buscador-tarea.html',
  styleUrls: ['./buscador-tarea.css']
})
export class BuscadorTareaComponent {
  // Evento personalizado emitido hacia el componente padre
  @Output() nuevaTareaEvent = new EventEmitter<{ titulo: string; prioridad: 'Baja' | 'Media' | 'Alta' }>();
  @Output() filtrarEvent = new EventEmitter<string>();

  prioridadSeleccionada: 'Baja' | 'Media' | 'Alta' = 'Media';

  // Manejador del cambio de selector (input event)
  onSeleccionarPrioridad(e: Event): void {
    const select = e.target as HTMLSelectElement;
    this.prioridadSeleccionada = select.value as 'Baja' | 'Media' | 'Alta';
  }

  // Emite el evento al presionar Enter o hacer clic en el botón
  emitirNuevaTarea(inputElement: HTMLInputElement): void {
    const texto = inputElement.value.trim();
    if (texto) {
      this.nuevaTareaEvent.emit({
        titulo: texto,
        prioridad: this.prioridadSeleccionada
      });
      inputElement.value = ''; // Limpia la caja de texto
    }
  }

  // Captura escritura en tiempo real
  onInputFiltrar(e: Event): void {
    const texto = (e.target as HTMLInputElement).value;
    this.filtrarEvent.emit(texto);
  }
}
