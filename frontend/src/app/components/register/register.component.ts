import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  email = '';
  confirmEmail = '';
  name = '';
  boleta = '';
  password = '';
  confirmPassword = '';

  errorMessage = '';
  successMessage = '';

  private router = inject(Router);
  private mockService = inject(MockDataService);

  async onRegister(event: Event) {
    event.preventDefault();
    if (!this.email || !this.name || !this.boleta || !this.password) return;

    if (this.email !== this.confirmEmail) {
      this.errorMessage = 'Los correos electrónicos no coinciden.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    let emailStr = this.email;
    if (!emailStr.includes('@')) {
      emailStr = `${emailStr}@alumno.ipn.mx`;
    }

    const parts = this.name.trim().split(/\s+/);
    let nombre = parts[0] || '';
    let apellido_paterno = parts[1] || '';
    let apellido_materno = parts.slice(2).join(' ') || '';

    if (parts.length === 4) {
      nombre = `${parts[0]} ${parts[1]}`;
      apellido_paterno = parts[2];
      apellido_materno = parts[3];
    } else if (parts.length > 4) {
      nombre = parts.slice(0, parts.length - 2).join(' ');
      apellido_paterno = parts[parts.length - 2];
      apellido_materno = parts[parts.length - 1];
    }

    try {
      this.errorMessage = '';
      this.successMessage = '';
      
      localStorage.setItem('boleta_simulated', this.boleta);

      const res = await this.mockService.register({
        nombre,
        apellido_paterno,
        apellido_materno,
        correo: emailStr,
        contrasena: this.password
      });

      this.successMessage = res.message || 'Registro exitoso. Se ha generado un enlace de activación.';
    } catch (err: any) {
      console.error(err);
      this.errorMessage = err.error || 'Error al registrar el usuario.';
    }
  }
}
