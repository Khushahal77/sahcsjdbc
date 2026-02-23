import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.loading = true;
    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = this.getErrorMessage(err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private getErrorMessage(err: unknown): string {
    if (!err || typeof err !== 'object') return 'Registration failed. Please try again.';
    const e = err as { status?: number; error?: unknown; message?: string };
    if (e.status === 0) return 'Unable to reach the server. Please ensure the API is running.';
    const error = e.error;
    if (error && typeof error === 'object' && !(error instanceof ProgressEvent)) {
      const msg = (error as { message?: string }).message;
      if (typeof msg === 'string') return msg;
    }
    if (typeof error === 'string') return error;
    return 'Registration failed. Please try again.';
  }
}
