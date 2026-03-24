import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-consumo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consumo.html',
  styleUrls: ['./consumo.css']
})
export class ConsumoComponent implements OnInit, AfterViewInit, OnDestroy {

  resultado: any = null;
  error: string | null = null;
  @ViewChild('codigo', { static: true }) codigoInput!: ElementRef<HTMLInputElement>;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.focusCodigo();
  }

  ngOnDestroy(): void {
    // Cleanup is handled by the shared service.
  }

  registrarConsumo(codigo: string) {
    this.resultado = null;
    this.error = null;

    const clean = codigo?.toString().trim();
    console.log('registrarConsumo called with:', JSON.stringify(clean));
    if (!clean) return;

    this.http.post<any>('http://localhost:3001/api/consumo', { codigo: clean })
      .subscribe({
        next: res => {
          console.log('consumo success', res);
          this.resultado = res;
          this.cdr.detectChanges(); // Force UI update
          // refocus hidden input so scanner can continue
          this.focusCodigo();

          // Auto-clear success message after 3 seconds
          setTimeout(() => {
            this.resultado = null;
            this.cdr.detectChanges(); // Update UI to remove message
          }, 3000);
        },
        error: err => {
          console.error('consumo error', err);
          this.error = err.error?.error || 'Error al registrar consumo';
          this.cdr.detectChanges(); // Force UI update
          this.focusCodigo();

          // Auto-clear error message after 3 seconds
          setTimeout(() => {
            this.error = null;
            this.cdr.detectChanges(); // Update UI to remove error
          }, 3000);
        }
      });
  }

  private focusCodigo() {
    try {
      if (this.codigoInput?.nativeElement) {
        this.codigoInput.nativeElement.focus();
      }
    } catch (e) {
      // ignore
    }
  }

  onBlur() {
    // Keep focus on input for scanner
    setTimeout(() => this.focusCodigo(), 100);
  }

  reportarError() {
    this.webSocketService.emit('reportar_error', {});
    
    // Configura un mensaje en la UI para darle feedback al usuario
    this.error = "Reporte enviado a administración correctamente.";
    this.resultado = null;
    this.cdr.detectChanges();
    this.focusCodigo();

    setTimeout(() => {
      if (this.error === "Reporte enviado a administración correctamente.") {
        this.error = null;
        this.cdr.detectChanges();
      }
    }, 4000);
  }
}
