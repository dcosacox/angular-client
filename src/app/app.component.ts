import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'My Task Manager';
  userData: any; // To hold user data from local storage
  isLoggedIn:boolean = false;

  constructor(private storage: StorageService) {
    // You can initialize any properties or services here if needed
    console.log('AppComponent initialized');
  }

  ngOnInit() {
    this.isLoggedIn = !!this.storage.get('isLoggedIn');
    console.log('Is logged in:', this.isLoggedIn);
    this.userData = this.storage.get('userData') ?? [];
    this.userData = JSON.parse(this.storage.get('userData') ?? '{}' ) ;
    this.userData = this.userData.user;

  }

  ngOnDestroy(){
    this.userData = [];
  }
}
