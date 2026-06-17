import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="forgot-wrapper">
      <div class="forgot-card card-premium">
        
        <!-- Header -->
        <div class="forgot-header">
          <img src="logo/app-logo.svg" alt="RE-USE Logo" class="brand-logo" />
          <h2 class="title">Recuperar Contraseña</h2>
          <p class="subtitle">Ingresa tu correo institucional para recibir un enlace de recuperación.</p>
        </div>

        <!-- Request Form -->
        <form *ngIf="!emailSent()" (submit)="onSubmit($event)" class="forgot-form">
          <div class="form-group">
            <label for="recovery-email">Correo Institucional</label>
            <div class="input-wrapper">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" class="input-icon">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input 
                type="email" 
                id="recovery-email" 
                name="email"
                class="form-control" 
                placeholder="usuario@alumno.ipn.mx"
                [(ngModel)]="email" 
                required
              />
            </div>
            <span *ngIf="errorMessage()" class="error-text-msg">{{ errorMessage() }}</span>
          </div>

          <button type="submit" class="btn-accent" [disabled]="loading()">
            {{ loading() ? 'Enviando...' : 'Enviar Enlace' }}
          </button>
        </form>

        <!-- Success Message -->
        <div *ngIf="emailSent()" class="success-box animate-fade">
          <div class="success-icon-circle">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2.5" class="draw-check">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3>¡Enlace Enviado!</h3>
          <p>Si el correo <strong>{{ email }}</strong> está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.</p>
          <button routerLink="/login" class="btn-primary mt-16">Volver al Login</button>
        </div>

        <!-- Footer -->
        <div class="forgot-footer">
          <a routerLink="/login" class="back-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Volver al inicio de sesión
          </a>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .forgot-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 24px;
      font-family: 'Outfit', sans-serif;
    }

    .forgot-card {
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

    .forgot-header {
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

    .forgot-form {
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

    /* Footer */
    .forgot-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
      text-align: center;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      color: #0a888a;
      font-weight: 700;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .back-link:hover {
      color: #086e70;
    }

    .back-link svg {
      transition: transform 0.25s ease;
    }

    .back-link:hover svg {
      transform: translateX(-4px);
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
  `]
})
export class ForgotPasswordComponent {
  email = '';
  loading = signal(false);
  emailSent = signal(false);
  errorMessage = signal<string | null>(null);

  async onSubmit(event: Event) {
    event.preventDefault();
    if (!this.email || !this.email.endsWith('@alumno.ipn.mx')) {
      this.errorMessage.set('Solo se permiten correos institucionales @alumno.ipn.mx');
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    try {
      await axios.post('http://localhost:3000/api/auth/forgot-password', { correo: this.email });
      this.emailSent.set(true);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.error || err.message || 'Error al enviar el enlace';
      this.errorMessage.set(errMsg);
    } finally {
      this.loading.set(false);
    }
  }
}
