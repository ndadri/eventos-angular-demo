// src/app/componentes/lista-tareas/lista-tareas.ts
import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscadorTareaComponent } from '../buscador-tarea/buscador-tarea';
import { Tarea } from '../../models/tarea.model';

@Component({
  selector: 'app-lista-tareas',
  standalone: true,
  imports: [CommonModule, BuscadorTareaComponent],
  templateUrl: './lista-tareas.html',
  styleUrls: ['./lista-tareas.css']
})
export class ListaTareasComponent {

  // --- Angular Signals ---
  // signal() crea un valor reactivo: cuando cambia, Angular actualiza la UI automáticamente
  tareas = signal<Tarea[]>([
    { id: 1, titulo: 'Estudiar Event Binding en Angular', prioridad: 'Alta', completada: false },
    { id: 2, titulo: 'Practicar @Output y EventEmitter', prioridad: 'Alta', completada: false },
    { id: 3, titulo: 'Leer sobre @HostListener', prioridad: 'Media', completada: false },
    { id: 4, titulo: 'Explorar Angular Signals', prioridad: 'Media', completada: true },
    { id: 5, titulo: 'Revisar stopPropagation', prioridad: 'Baja', completada: false },
  ]);

  filtroTexto = signal('');
  ultimoMensajeGlobal = signal('Ningún evento global registrado aún...');

  // computed() se recalcula automáticamente cuando tareas() o filtroTexto() cambian
  tareasFiltradas = computed(() => {
    const texto = this.filtroTexto().toLowerCase();
    return this.tareas().filter(t =>
      t.titulo.toLowerCase().includes(texto)
    );
  });

  totalCompletadas = computed(() => this.tareas().filter(t => t.completada).length);

  private nextId = 6;

  // Recibe el evento personalizado del componente hijo (BuscadorTarea)
  onAgregarTarea(datos: { titulo: string; prioridad: 'Baja' | 'Media' | 'Alta' }): void {
    const nueva: Tarea = {
      id: this.nextId++,
      titulo: datos.titulo,
      prioridad: datos.prioridad,
      completada: false
    };
    // .update() recibe la lista actual y devuelve la lista nueva
    this.tareas.update(lista => [...lista, nueva]);
  }

  // Recibe el filtro de texto del hijo
  onFiltrar(texto: string): void {
    this.filtroTexto.set(texto);
  }

  // (click) en el <li>: alterna el estado completada/pendiente
  toggleCompletada(id: number): void {
    this.tareas.update(lista =>
      lista.map(t => t.id === id ? { ...t, completada: !t.completada } : t)
    );
  }

  // $event se usa para llamar stopPropagation() y evitar que el clic suba al <li>
  eliminarTarea(id: number, event: MouseEvent): void {
    event.stopPropagation(); // ← EVITA que se dispare toggleCompletada del padre
    this.tareas.update(lista => lista.filter(t => t.id !== id));
  }

  // Evento Global con @HostListener (Escucha la tecla Escape en TODA la ventana)
  @HostListener('window:keydown.escape')
  onEscapeGlobal(): void {
    this.filtroTexto.set('');
    this.ultimoMensajeGlobal.set('Se presionó ESC → Filtro limpiado');
  }

  // Escucha el scroll global
  @HostListener('window:scroll')
  onScrollGlobal(): void {
    const y = Math.round(window.scrollY);
    if (y > 0) {
      this.ultimoMensajeGlobal.set(`Scroll detectado: Y = ${y}px`);
    }
  }
}
