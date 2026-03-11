import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from "../services/admin.service";
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  usuarios: any[] = [];
  reporte: any = null;
  loading: boolean = false;
  errorMessage: string = '';

  nuevoUsuario = {
    nombre: '',
    codigo_barra: ''
  };

  private evtSource?: EventSource;

  constructor(
    private adminService: AdminService,
    private ngZone: NgZone,
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('[Admin] ngOnInit started');
    // Force a small delay to ensure view is ready
    setTimeout(() => {
      this.cargarDatos();
    }, 100);
    this.conectarSSE();
  }

  ngOnDestroy(): void {
    // Socket cleanup handled by service or not necessary here if service is singleton
  }

  cargarDatos() {
    this.loading = true;
    this.errorMessage = '';
    this.cargarUsuarios();
    this.cargarReporte();
  }

  private conectarSSE(): void {
    try {
      console.log('[Admin] Conectando a Socket.IO...');
      this.webSocketService.listen('consumo').subscribe((payload) => {
        this.ngZone.run(() => {
          console.log('[Admin] Socket.IO evento recibido:', payload);
          if (payload?.type === 'consumo') {
            console.log('[Admin] Consumo evento detectado, recargando datos...');

            // Small delay to ensure DB update is complete before reloading totals
            setTimeout(() => {
              this.cargarDatos();
            }, 100);
          }
        });
      });
      console.log('[Admin] Socket.IO suscripción iniciada');
    } catch (e) {
      console.error('[Admin] Socket.IO subscription error', e);
    }
  }

  cargarUsuarios() {
    console.log('[Admin] Cargando usuarios...');
    this.adminService.obtenerUsuarios()
      .subscribe({
        next: (val: any[]) => {
          console.log('[Admin] Usuarios cargados:', val);
          this.usuarios = val;
          this.loading = false;
          this.cdr.detectChanges(); // Force update
        },
        error: (err) => {
          console.error('[Admin] Error cargando usuarios:', err);
          this.errorMessage = 'Error cargando usuarios: ' + (err.message || 'Error desconocido');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  cargarReporte() {
    console.log('[Admin] Cargando reporte...');
    this.adminService.obtenerReporte()
      .subscribe({
        next: (val: any) => {
          console.log('[Admin] Reporte cargado:', val);
          this.reporte = val;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('[Admin] Error cargando reporte:', err);
          this.errorMessage = 'Error cargando reporte';
          this.cdr.detectChanges();
        }
      });
  }

  crearUsuario() {
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.codigo_barra) return;

    this.adminService.crearUsuario(this.nuevoUsuario)
      .subscribe(() => {
        this.nuevoUsuario = { nombre: '', codigo_barra: '' };
        this.cargarDatos();
      });
  }

  usuarioExpandido: number | null = null;
  historialUsuario: any[] = [];

  toggleHistorial(usuario: any) {
    if (this.usuarioExpandido === usuario.id) {
      this.usuarioExpandido = null;
      this.historialUsuario = [];
    } else {
      this.usuarioExpandido = usuario.id;
      this.historialUsuario = [];
      this.loading = true;

      this.adminService.obtenerHistorialUsuario(usuario.id).subscribe({
        next: (res) => {
          this.historialUsuario = res.historial;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('[Admin] Error cargando historial:', err);
          this.errorMessage = 'No se pudo cargar el historial';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
