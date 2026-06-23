import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import axios from 'axios';
import { API_BASE_URL } from '../../services/mock-data.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="reset-wrapper">
      <div class="reset-card card-premium">
        
        <!-- Header -->
        <div class="reset-header">
          <img src="logo/app-logo.svg" alt="RE-USE Logo" class="brand-logo" />
          <h2 class="title">Nueva Contraseña</h2>
          <p class="subtitle">Ingresa y confirma tu nueva contraseña para acceder a tu cuenta.</p>
        </div>

        <!-- Reset Form -->
        <form *ngIf="!resetSuccess() && token()" (submit)="onSubmit($event)" class="reset-form">
          
          <!-- New Password -->
          <div class="form-group">
            <label for="new-password">Nueva Contraseña</label>
            <div class="input-wrapper">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" class="input-icon">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input 
                type="password" 
                id="new-password" 
                name="contrasena"
                class="form-control" 
                placeholder="Mínimo 6 caracteres"
                [(ngModel)]="contrasena" 
                required
                minlength="6"
              />
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label for="confirm-password">Confirmar Contraseña</label>
            <div class="input-wrapper">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" class="input-icon">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input 
                type="password" 
                id="confirm-password" 
                name="confirmarContrasena"
                class="form-control" 
                placeholder="Repite la contraseña"
                [(ngModel)]="confirmarContrasena" 
                required
              />
            </div>
            <span *ngIf="errorMessage()" class="error-text-msg">{{ errorMessage() }}</span>
          </div>

          <button type="submit" class="btn-accent" [disabled]="loading()">
            {{ loading() ? 'Guardando...' : 'Cambiar Contraseña' }}
          </button>
        </form>

        <!-- Token Missing or Invalid initially -->
        <div *ngIf="!token()" class="error-box animate-fade">
          <div class="error-icon-circle">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3>Enlace Inválido</h3>
          <p>No se proporcionó ningún token de recuperación o el formato es incorrecto. Por favor solicita un nuevo enlace.</p>
          <button routerLink="/forgot-password" class="btn-primary mt-16">Solicitar Enlace</button>
        </div>

        <!-- Success Message -->
        <div *ngIf="resetSuccess()" class="success-box animate-fade">
          <div class="success-icon-circle">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2.5" class="draw-check">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3>¡Cambio Exitoso!</h3>
          <p>Tu contraseña ha sido actualizada con éxito. En breve serás redirigido al inicio de sesión.</p>
          <button routerLink="/login" class="btn-primary mt-16">Ir al Login</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .reset-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 24px;
      font-family: 'Outfit', sans-serif;
    }

    .reset-card {
      width: 100%;
      max-width: 440px;
      padding: 40px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: column;
      gap: 28px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .reset-header {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .brand-logo {
      width: 60px;
      height: 60px;
      margin-bottom: 4px;
    }

    .title {
      font-size: 1.6rem;
      font-weight: 800;
      color: #003366;
      margin: 0;
    }

    .subtitle {
      font-size: 0.85rem;
      color: #64748b;
      line-height: 1.5;
      margin: 0;
    }

    .reset-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-size: 0.85rem;
      font-weight: 700;
      color: #003366;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 14px;
      color: #64748b;
      pointer-events: none;
    }

    .form-control {
      width: 100%;
      padding: 12px 12px 12px 42px !important;
      font-size: 0.95rem;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background-color: #f8fafc;
      transition: all 0.2s ease;
    }

    .form-control:focus {
      background-color: #ffffff;
      border-color: #0a888a;
      outline: none;
      box-shadow: 0 0 0 3px rgba(10, 136, 138, 0.1);
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

    .btn-accent:hover:not(:disabled) {
      background: #086e70;
      transform: translateY(-2px);
    }

    .btn-accent:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .error-text-msg {
      font-size: 0.8rem;
      color: #ef4444;
      font-weight: 500;
    }

    /* Error box */
    .error-box {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 10px 0;
    }

    .error-icon-circle {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background-color: #fef2f2;
      color: #ef4444;
      border: 2px solid #fca5a5;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }

    .error-box h3 {
      font-size: 1.3rem;
      font-weight: 800;
      color: #dc2626;
      margin: 0;
    }

    .error-box p {
      font-size: 0.9rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    /* Success box */
    .success-box {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 10px 0;
    }

    .success-icon-circle {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background-color: #e0f2f1;
      color: #0a888a;
      border: 2px solid #0a888a;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }

    .success-box h3 {
      font-size: 1.3rem;
      font-weight: 800;
      color: #003366;
      margin: 0;
    }

    .success-box p {
      font-size: 0.9rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    .btn-primary {
      width: 100%;
      padding: 12px;
      font-size: 0.95rem;
      font-weight: 700;
      border-radius: 8px;
      background: #003366;
      color: white;
      border: none;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .btn-primary:hover {
      background: #002244;
      transform: translateY(-2px);
    }

    .mt-16 {
      margin-top: 16px;
    }

    .animate-fade {
      animation: fadeIn 0.4s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .draw-check {
      stroke-dasharray: 100;
      stroke-dashoffset: 100;
      animation: drawStroke 0.6s 0.2s ease-out forwards;
    }

    @keyframes drawStroke {
      to { stroke-dashoffset: 0; }
    }

    @media (max-width: 480px) {
      .reset-wrapper {
        padding: 16px;
      }
      .reset-card {
        padding: 24px;
        gap: 20px;
      }
      .title {
        font-size: 1.4rem;
      }
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  token = signal<string | null>(null);
  contrasena = '';
  confirmarContrasena = '';
  loading = signal(false);
  resetSuccess = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    // Extract token from query params
    const tokenParam = this.route.snapshot.queryParams['token'];
    if (tokenParam) {
      this.token.set(tokenParam);
    }
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    if (!this.contrasena || this.contrasena.length < 6) {
      this.errorMessage.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (this.contrasena !== this.confirmarContrasena) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }

    const currentToken = this.token();
    if (!currentToken) return;

    this.errorMessage.set(null);
    this.loading.set(true);

    try {
      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        token: currentToken,
        contrasena: this.contrasena
      });
      
      this.resetSuccess.set(true);
      
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
      
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.error || err.message || 'Error al restablecer la contraseña';
      this.errorMessage.set(errMsg);
    } finally {
      this.loading.set(false);
    }
  }
}
