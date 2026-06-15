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

  private router = inject(Router);
  private mockService = inject(MockDataService);

  onLogin(event: Event) {
    event.preventDefault();
    if (!this.email || !this.password) return;

    // Login logic - simple mock
    let emailStr = this.email;
    if (!emailStr.includes('@')) {
      emailStr = `${emailStr}@alumno.ipn.mx`;
    }

    this.mockService.currentUser.set({
      name: 'Juan Pérez López',
      email: emailStr,
      boleta: '2020081399',
      phone: '5544332211',
      reputation: 4.5
    });

    // Navigate to catalog
    this.router.navigate(['/catalog']);
  }
}
