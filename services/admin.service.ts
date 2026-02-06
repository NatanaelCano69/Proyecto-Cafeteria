import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private api = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Registrar usuario
  crearUsuario(data: any) {
    return this.http.post(`${this.api}/usuarios`, data);
  }

  // Obtener usuarios con deuda y consumos
  obtenerUsuarios() {
    return this.http.get<any[]>(`${this.api}/usuarios`);
  }

  // Reporte general
  obtenerReporte() {
    return this.http.get<any>(`${this.api}/reportes`);
  }
}