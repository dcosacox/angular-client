import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  user = {
    username: '',
    email: '',
    phone: '',
  };
  isLoading: boolean = false; // For loading
  response: any; // Adjust type as needed
  isEditMode: boolean = false; // Flag to check if in edit mode
  userId: string | null = null; // To hold the user ID if editing

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  createUser() {
    // Logic to create a new user
    if (this.isEditMode) {
      // If in edit mode, update the user
      this.updateUser();
    } else {
      // Otherwise, create a new user
      this.addUser();
    }
  }

  updateUser() {
    // Logic to update an existing user
    this.isLoading = true;
    this.apiService.updateUser(this.user).subscribe({
      next: (response) => {
        this.snackBar.open('User updated successfully!', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
        this.router.navigate(['/users']); // Redirect to /users
      },
      error: (error) => {
        this.snackBar.open('Error updating the user.', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  validateEmail(email: any) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  validatePhone(phone: any) {
    const phonePattern = /^\+?\d{10,15}$/;
    return phonePattern.test(phone);
  }

  addUser() {
    if (!this.validateEmail(this.user.email)) {
      this.snackBar.open('Please enter a valid email address.', 'Close', {
        duration: 3000,
      });
      return;
    }
    if (!this.validatePhone(this.user.phone)) {
      this.snackBar.open('Please enter a valid phone number.', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.isLoading = true;
    this.apiService.addUser(this.user).subscribe({
      next: (response) => {
        this.snackBar.open('User added successfully!', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
        this.router.navigate(['/login']); // Redirect to /users
      },
      error: (error) => {
        this.snackBar.open('Error adding the user.', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }
}
