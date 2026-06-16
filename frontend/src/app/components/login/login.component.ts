import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent {
  email = '';
  password = '';

  errorMessage = '';

  private router = inject(Router);
  private mockService = inject(MockDataService);

  async onLogin(event: Event) {
    event.preventDefault();
    if (!this.email || !this.password) return;

    let emailStr = this.email;
    if (!emailStr.includes('@')) {
      emailStr = `${emailStr}@alumno.ipn.mx`;
    }

    try {
      this.errorMessage = '';
      await this.mockService.login(emailStr, this.password);
      this.router.navigate(['/catalog']);
    } catch (err: any) {
      console.error(err);
      this.errorMessage = err.error || 'Credenciales incorrectas o cuenta no verificada.';
    }
  }
}
