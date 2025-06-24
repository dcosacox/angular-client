import { Component, OnDestroy, OnInit } from '@angular/core';
// Update the import path if your AuthService is located elsewhere, for example:
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div>
      <h2>Dashboard (Protected)</h2>
      <p>Welcome to your dashboard!</p>
      <button (click)="logout()">Logout</button>
      <p>
        You are currently:
        <strong>{{ (isLoggedIn$ | async) ? 'Logged In' : 'Logged Out' }}</strong>
      </p>
      <p>Go to <a routerLink="/home">Home</a> (public).</p>
    </div>
  `,
  styles: `
    div {
      width: 400px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      text-align: center;
    }
    button {
      padding: 10px 20px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    button:hover {
      background-color: #c82333;
    }
    strong {
      color: green;
    }
  `,
})
export class DashboardComponent implements OnInit, OnDestroy {
  isLoggedIn$ = this.authService.isLoggedIn$;
  private authSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Optional: Subscribe to changes if you need to react to login/logout events in this component
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (loggedIn) => {
        // console.log('Login status in dashboard:', loggedIn);
      }
    );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

}