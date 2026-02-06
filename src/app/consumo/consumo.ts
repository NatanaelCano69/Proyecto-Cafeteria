import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-consumo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consumo.html',
  styleUrls: ['./consumo.css']
})
export class ConsumoComponent {

  resultado: any = null;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  registrarConsumo(codigo: string) {
    this.resultado = null;
    this.error = null;

    if (!codigo.trim()) return;

    this.http.post<any>('http://localhost:3000/api/consumo', { codigo })
      .subscribe({
        next: res => this.resultado = res,
        error: err => {
          this.error = err.error?.error || 'Error al registrar consumo';
        }
      });
  }
}
