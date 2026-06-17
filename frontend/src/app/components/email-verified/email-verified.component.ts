import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-verified',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="verified-wrapper">
      <div class="verified-card card-premium">
        <!-- Success State -->
        <ng-container *ngIf="status() === 'success'">
          <div class="icon-circle success animate-scale">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2.5" class="svg-animate">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 class="title success-text animate-fade">¡Cuenta Validada!</h2>
          <p class="desc animate-fade">Tu correo institucional ha sido verificado con éxito. Ya puedes iniciar sesión y comenzar a compartir componentes.</p>
          <button routerLink="/login" class="btn-accent animate-fade">Iniciar Sesión</button>
        </ng-container>

        <!-- Error State -->
        <ng-container *ngIf="status() === 'error'">
          <div class="icon-circle error animate-scale">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2.5" class="svg-animate">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 class="title error-text animate-fade">Error de Verificación</h2>
          <p class="desc animate-fade">{{ errorMessage() }}</p>
          <div class="action-buttons-row animate-fade">
            <button routerLink="/register" class="btn-secondary">Registrarse de nuevo</button>
            <button routerLink="/login" class="btn-primary">Ir al Login</button>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .verified-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 24px;
      font-family: 'Outfit', sans-serif;
    }

    .verified-card {
      width: 100%;
      max-width: 480px;
      padding: 48px 40px;
      border-radius: 16px;
      text-align: center;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .icon-circle {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }

    .icon-circle.success {
      background-color: #e0f2f1;
      color: #0a888a;
      border: 2px solid #0a888a;
    }

    .icon-circle.error {
      background-color: #fef2f2;
      color: #ef4444;
      border: 2px solid #fca5a5;
    }

    .title {
      font-size: 1.8rem;
      font-weight: 800;
      margin: 0;
    }

    .success-text {
      color: #003366;
    }

    .error-text {
      color: #dc2626;
    }

    .desc {
      font-size: 0.95rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    .btn-accent {
      width: 100%;
      padding: 14px;
      font-size: 1rem;
      font-weight: 700;
      border-radius: 8px;
      background: #0a888a;
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(10, 136, 138, 0.25);
      transition: all 0.25s ease;
    }

    .btn-accent:hover {
      background: #086e70;
      transform: translateY(-2px);
    }

    .action-buttons-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      width: 100%;
    }

    .btn-primary, .btn-secondary {
      padding: 12px;
      font-size: 0.9rem;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .btn-primary {
      background: #003366;
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background: #002244;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #e2e8f0;
    }

    .btn-secondary:hover {
      background: #e2e8f0;
      transform: translateY(-2px);
    }

    /* Animations */
    .animate-scale {
      animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .animate-fade {
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes scaleIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .svg-animate {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      animation: drawStroke 0.6s 0.2s ease-out forwards;
    }

    @keyframes drawStroke {
      to { stroke-dashoffset: 0; }
    }
  `]
})
export class EmailVerifiedComponent implements OnInit {
  private route = inject(ActivatedRoute);
  
  status = signal<string>('success');
  errorMessage = signal<string>('Token inválido o expirado. Solicita un nuevo enlace.');

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const statusParam = params['status'];
      if (statusParam === 'error') {
        this.status.set('error');
        this.errorMessage.set(params['message'] || 'Token inválido o expirado. Solicita un nuevo enlace.');
      } else {
        this.status.set('success');
      }
    });
  }
}
