import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;

  loginForm = this.fb.group({
    login: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { login, password } = this.loginForm.value;

    this.authService.login(login!, password!).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.success) {
          const token = res.data.token;
          this.authService.saveToken(token);
          this.router.navigate(['/employees']);
        } else {
          alert(res.message);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('Login failed');
      }
    });
  }
}