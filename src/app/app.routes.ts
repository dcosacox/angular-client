import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { authGuard } from './guards/auth.guard';
import { UserFormComponent } from './components/user-form/user-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'logout', component: LoginComponent},
  { path: 'register', component: UserFormComponent},
  { path: 'tasks', component: TasksListComponent , canActivate: [authGuard]}, 
  { path: 'task/add', component: TaskFormComponent , canActivate: [authGuard]}, 
  { path: 'task/edit/:id', component: TaskFormComponent , canActivate: [authGuard]}, 
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/home' },
];

