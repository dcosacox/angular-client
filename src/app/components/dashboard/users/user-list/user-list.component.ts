    // user-list.component.ts
    import { Component, OnInit } from '@angular/core';
    import { ApiService } from '../../../../services/api.service'; // Assuming you have a user service

    @Component({
      selector: 'app-user-list',
      templateUrl: './user-list.component.html',
      styleUrls: ['./user-list.component.css']
    })
    export class UserListComponent implements OnInit {
      users: any[] = [];

      constructor(private apiService: ApiService) { }

      ngOnInit(): void {
        this.apiService.getUsers().subscribe(data => {
          this.users = data;
        });
      }

      deleteUser(id: number): void {
        this.apiService.deleteUser(id).subscribe(() => {
          this.users = this.users.filter(user => user.id !== id);
        });
      }
    }