import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;

  signupForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  signup(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { username, email, password } = this.signupForm.value;

    this.authService.signup(username!, email!, password!).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.success) {
          alert('Signup successful');
          this.router.navigate(['/login']);
        } else {
          alert(res.message);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('Signup failed');
      }
    });
  }
}