import { Component, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/local-storage.service';
import { NgIf } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import moment from 'moment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, MatSnackBarModule],
  providers: [Router],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private storage: StorageService,
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  email: string = '';
  phone: string = '';
  password: string = '';
  errorMessage: string = '';
  showOtpInput: boolean = false;
  otp: number | string = '';
  otpHint: number | string = '';
  response: any = null; // Adjust type as needed
  otpData: any; // Adjust type as needed
  isLoading: boolean = false;
  isLoading2: boolean = false;
  showCode: boolean = false;
  countdown: number = 0;
  formatedTime: string = '';


  ngOnInit(): void {
    // If the current route is /logout, perform logout
    if (this.router.url === '/logout') {
      this.logout();
    }
  }

  onLogin() {
    this.verifyOtp();
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  createOtp(): void {
    this.isLoading = true; // Set loading state to true
    // Logic to fetch all tasks can be implemented here
    console.log('Creating a new OTP');
    if (!this.email && !this.phone) {
      this.errorMessage = 'Please enter your email or phone number.';
      this.isLoading = false; // Reset loading state
      return;
    }

    if (this.email) {
      this.otpData = { email: this.email };
    }
    if (this.phone) {
      this.otpData = { phone: this.phone };
    }

    // This could call a service method to create an OTP
    this.apiService.createOtp(this.otpData).subscribe({
      next: (response) => {
        console.log('OTP created successfully:', response);
        this.countdown = 120;
        setInterval(() => {
          this.countdown--;
          // Format countdown as mm:ss
          const duration = moment.duration(this.countdown, 'seconds');
          const minutes = String(Math.floor(duration.asMinutes())).padStart(2, '0');
          const seconds = String(duration.seconds()).padStart(2, '0');
          // You can use this formatted string as needed, e.g., display it in the template
          this.formatedTime = `${minutes}:${seconds}`;
        }, 1000);
        this.showOtpInput = true; // Show OTP input field
        this.showCode = true; // Show the code input field
        this.response = response; // Assuming 'response' is a property in this component to hold the response
        this.otpHint = response.otp;
        this.isLoading = false; // Reset loading state after the request completes
      },
      error: (error) => {
        console.error('Error creating OTP:', error);
        this.isLoading = false; // Reset loading state after the request completes
      },
    });
  }

  verifyOtp() {
    this.isLoading2 = true;
    this.otpData = { otp: this.otp }; // Assuming 'otp' is the input from the user
    if (this.email) {
      this.otpData.email = this.email; // Include email if provided
    }
    if (this.phone) {
      this.otpData.phone = this.phone; // Include phone if provided
    }
    this.apiService.verifyOtp(this.otpData).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.errorMessage = 'OTP verification success. Log in.';
          this.storage.set('userData', JSON.stringify(response)); // Store token in local storage
          this.isLoading2 = false; // Reset loading state
          this.login();
          return;
        }
        this.isLoading2 = true;
        console.log('The response of otp verification is:', response);
        if (response && response.success) {
          this.router.navigate(['/dashboard']);
        } // Navigate to dashboard on successful OTP verification
        this.showOtpInput = false; // Show OTP input field
        this.response = response.message; // Assuming 'response' is a property in this component to hold the response
      },
      error: (error) => {
        console.error('Error creating OTP:', error);
        if (error.error.message !== 'undefined') {
          this.snackBar.open(error.error.message, 'Close', {
            duration: 3000,
          });
          this.isLoading2 = false;
        }
      },
    });
  }
}
