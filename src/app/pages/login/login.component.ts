import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.loading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/home']);
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
    if (!err || typeof err !== 'object') return 'Invalid email or password.';
    const e = err as { status?: number; error?: unknown };
    if (e.status === 0) return 'Unable to reach the server. Please ensure the API is running.';
    const error = e.error;
    if (error && typeof error === 'object' && !(error instanceof ProgressEvent)) {
      const msg = (error as { message?: string }).message;
      if (typeof msg === 'string') return msg;
    }
    if (typeof error === 'string') return error;
    return 'Invalid email or password.';
  }
}
