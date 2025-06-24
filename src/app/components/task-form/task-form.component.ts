import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-task-form', // <-- This is where the error points, but it's okay for @Component
  standalone: true, // <--- THIS IS THE CRUCIAL LINE. Ensure it's true.
  imports: [
    MatSnackBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    FormsModule, // Add FormsModule if you use forms in the template
    // Add any other standalone components, directives, pipes, or NgModules
    // that TaskFormComponent directly uses in its template.
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  task = {
    title: '',
    description: '',
    dueAt: null as Date | null,
    status: '',
    userId: 0
  };
  isLoading: boolean = false; // For loading
  response: any; // Adjust type as needed
  isEditMode: boolean = false; // Flag to check if in edit mode
  taskId: string | null = null; // To hold the task ID if editing
  userData: any;

  statusesArray = [
    { title: 'Pending', color: 'warning' },
    { title: 'In Progress', color: 'primary' },
    { title: 'Completed', color: 'success' },
    { title: 'Canceled', color: 'danger' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;
    this.userData = JSON.parse(this.storage.get('userData') ?? '{}' ) ;
    if(this.userData.user.id){
      this.task.userId = this.userData.user.id;
    }
    if (this.isEditMode) {
      // Fetch the task by ID and populate the form
      this.apiService
        .getTask(this.taskId)
        .subscribe((task) => (this.task = task));
    } else {
      // New task logic
      this.task.status = 'Pending';
    }
  }

  createTask() {

    if (this.task.dueAt && new Date(this.task.dueAt) < new Date()) {
      this.snackBar.open('The date of the task must be in the future', 'Close', {
        duration: 3000,
      });
      return;
    }
  
    if (this.task.title && this.task.title == '') {
      this.snackBar.open('The task title cannot be empty', 'Close', {
        duration: 3000,
      });
      return;
    }

    // Logic to create a new task
    if (this.isEditMode) {
      // If in edit mode, update the task
      this.updateTask();
    } else {
      // Otherwise, create a new task
      this.addTask();
    }
  }

  updateTask() {
    // Logic to update an existing task
    this.isLoading = true;
    this.apiService.updateTask(this.task).subscribe({
      next: (response) => {
        this.snackBar.open('Task updated successfully!', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
        this.router.navigate(['/tasks']); // Redirect to /tasks
      },
      error: (error) => {
        this.snackBar.open('Error updating the task.', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  addTask() {
    this.isLoading = true;
    this.apiService.addTask(this.task).subscribe({
      next: (response) => {
        this.snackBar.open('Task added successfully!', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
        this.router.navigate(['/tasks']); // Redirect to /tasks
      },
      error: (error) => {
        this.snackBar.open('Error adding the task.', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  onSubmit() {
    // Handle form submission
    // For now, just log the task data
    console.log('Task submitted:', this.task);
  }

  onReset() {
    // Reset the form to initial state
    this.task = {
      title: '',
      description: '',
      dueAt: null,
      status: '',
      userId: 0
    };
  }
  // ... your component logic
}
export class TaskFormModule {
  __constructors() {}


  OnInit() {
    
  }
}
