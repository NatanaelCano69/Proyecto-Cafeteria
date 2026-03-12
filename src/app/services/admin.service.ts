import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  // Registrar usuario
  crearUsuario(data: any) {
    return this.http.post(`${environment.API_URL}/usuarios`, data);
  }

  // Obtener usuarios con deuda y consumos
  obtenerUsuarios() {
    return this.http.get<any[]>(`${environment.API_URL}/usuarios`);
  }

  // Reporte general
  obtenerReporte(): Observable<any> { // Modified return type
    // Assuming `this.API_URL` should be `this.api` based on existing code pattern
    // and `/admin/reporte` is the new endpoint.
    // If `API_URL` is a new variable, it needs to be declared.
    // For now, I'll use `this.api` and the new path from the instruction.
    return this.http.get(`${environment.API_URL}/reportes`); // Modified URL and removed <any>
  }

  obtenerUltimosConsumos(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/consumo/ultimos`);
  }

  obtenerHistorialUsuario(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/consumo?usuario=${usuarioId}`);
  }
}
