// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this._isLoggedIn.asObservable();

  constructor(private router: Router, private storage: StorageService) {
    // Check for a stored token or user session on service initialization
    const loggedIn = this.storage.get('isLoggedIn') === 'true';
    this._isLoggedIn.next(loggedIn);
  }

  login() {
    // Simulate a successful login
    this.storage.set('isLoggedIn', 'true');
    this._isLoggedIn.next(true);
    this.router.navigate(['/tasks']); // Redirect to a protected route after login
  }

  logout() {
    // Simulate a logout
    this.storage.remove('isLoggedIn');
    this.storage.remove('userData');
    this._isLoggedIn.next(false);
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  isAuthenticated(): boolean {
    return this._isLoggedIn.getValue();
  }

  saveToken(token: string) {
    this.storage.set('token', token);
  }
}
