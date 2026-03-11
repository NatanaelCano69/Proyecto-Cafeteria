import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private api = 'http://localhost:3001/api';

  constructor(private http: HttpClient) { }

  // Registrar usuario
  crearUsuario(data: any) {
    return this.http.post(`${this.api}/usuarios`, data);
  }

  // Obtener usuarios con deuda y consumos
  obtenerUsuarios() {
    return this.http.get<any[]>(`${this.api}/usuarios`);
  }

  // Reporte general
  obtenerReporte(): Observable<any> { // Modified return type
    // Assuming `this.API_URL` should be `this.api` based on existing code pattern
    // and `/admin/reporte` is the new endpoint.
    // If `API_URL` is a new variable, it needs to be declared.
    // For now, I'll use `this.api` and the new path from the instruction.
    return this.http.get(`${this.api}/reportes`); // Modified URL and removed <any>
  }

  obtenerUltimosConsumos(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3001/api/consumo/ultimos');
  }

  obtenerHistorialUsuario(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${this.api}/consumo?usuario=${usuarioId}`);
  }
}
