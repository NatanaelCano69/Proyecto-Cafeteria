import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  usuarios: any[] = [];
  reporte: any = null;

  nuevoUsuario = {
    nombre: '',
    codigo_barra: ''
  };

  constructor(private adminService: AdminService) {
    this.cargarUsuarios();
    this.cargarReporte();
  }

  cargarUsuarios() {
    this.adminService.obtenerUsuarios()
      .subscribe(res => this.usuarios = res);
  }

  cargarReporte() {
    this.adminService.obtenerReporte()
      .subscribe(res => this.reporte = res);
  }

  crearUsuario() {
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.codigo_barra) return;

    this.adminService.crearUsuario(this.nuevoUsuario)
      .subscribe(() => {
        this.nuevoUsuario = { nombre: '', codigo_barra: '' };
        this.cargarUsuarios();
      });
  }
}
