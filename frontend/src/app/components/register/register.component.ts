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

  private router = inject(Router);
  private mockService = inject(MockDataService);

  onRegister(event: Event) {
    event.preventDefault();
    if (!this.email || !this.name || !this.boleta || !this.password) return;

    let emailStr = this.email;
    if (!emailStr.includes('@')) {
      emailStr = `${emailStr}@alumno.ipn.mx`;
    }

    this.mockService.currentUser.set({
      name: this.name,
      email: emailStr,
      boleta: this.boleta,
      phone: '5500000000',
      reputation: 5.0
    });

    this.router.navigate(['/catalog']);
  }
}
