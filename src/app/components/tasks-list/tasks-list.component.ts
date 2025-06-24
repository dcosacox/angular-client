import { Component, inject } from '@angular/core';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/local-storage.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports:[MatSnackBarModule, FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
})
export class TasksListComponent {
  title = 'Tasks List';
  tasks: any[] = []; // Add this line to declare the tasks property
  searchText: string = '';
  filteredTasks: any[] = [];
  statusesArray = [
    { title: 'Pending', color: 'warning' },
    { title: 'In Progress', color: 'primary' },
    { title: 'Completed', color: 'success' },
    { title: 'Canceled', color: 'danger' },
  ];

  constructor(private router: Router, private storage: StorageService, private snackBar:MatSnackBar) {}

  apiService = inject(ApiService);
  userData: any;

  ngOnInit(): void {
    // Initialization logic can go here
    this.userData = JSON.parse(this.storage.get('userData') ?? '{}' ) ;

    this.getUserTasks();

  }

  now(): string {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  getUserTasks(): void {
    // Logic to fetch all tasks can be implemented here
    console.log('Fetching all tasks...');
    // This could call a service method to get tasks from an API
    this.apiService.getUserTasks(this.userData.user.id).subscribe({
      next: (data) => {
        console.log('Tasks fetched successfully:', data);
        this.snackBar.open('Tasks fetched successfully!', 'Close', {
          duration: 3000,
        });
        this.tasks = data; // Assuming 'tasks' is a property in this component to hold the tasks
        this.filterTasks();
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
        this.snackBar.open('Error fetching tasks!', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  filterTasks() {
    if (!this.searchText) {
      this.filteredTasks = this.tasks;
    } else {
      const lowerSearch = this.searchText.toLowerCase();
      this.filteredTasks = this.tasks.filter((task) =>
        Object.values(task).some((val) =>
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
    }
  }

  onSearchTextChange() {
    this.filterTasks();
  }

  // Add this method to your DashboardComponent class
  onStatusChange(task: any, newStatus: string): void {
    this.apiService.updateTask({id: task.id, status:newStatus}).subscribe({
      next: (response) => {
        console.log('Task status updated successfully:', response);
        this.snackBar.open('Task status updated successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Error updating task status:', error);
        this.snackBar.open('Error updating task status!', 'Close', {
          duration: 3000,
        });

      },
    });
    // Optionally, add logic to persist the change (e.g., call
  }
  
  addTask() {
    // Logic to add a task can be implemented here
    console.log('Add Task button clicked');
    this.router.navigate(['/task/add']);
  }
  
  taskEdit(taskId: string) {
    // Logic to add a task can be implemented here
    console.log('Add Task button clicked');
    this.router.navigate(['/task/edit', taskId]);
  }
  
  taskDelete(taskId: string) {
    // Logic to add a task can be implemented here
    console.log('Add Task button clicked');
    this.apiService.deleteTask(taskId).subscribe({
      next: (response) => {
        console.log('Task deleted successfully:', response);
        this.snackBar.open('Task deleted successfully!', 'Close', {
          duration: 3000,
        });
        this.getUserTasks(); // Refresh the task list after deletion
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.snackBar.open('Error deleting task!', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
