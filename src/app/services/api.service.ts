import { HttpClient } from '@angular/common/http';
import moment from 'moment';
import { map, Observable, tap } from 'rxjs';
import { Injectable, Inject } from '@angular/core'; 

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl = '/api/'; // Use proxy for API calls during development
  userData: any;

  constructor(private http: HttpClient) {}

  // For Tasks
  getAllTasks(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}tasks`).pipe(
      // Transform the response to format dates and times
      map((tasks) =>
        tasks.map((task: any) => ({
          ...task,
          dueAt: task.dueAt
            ? moment(task.dueAt).format('YYYY-MM-DD HH:mm:ss')
            : null,
          createdAt: task.createdAt
            ? moment(task.createdAt).format('YYYY-MM-DD HH:mm:ss')
            : null,
          updatedAt: task.updatedAt
            ? moment.utc(task.updatedAt).format('YYYY-MM-DD HH:mm:ss')
            : null,
        }))
      )
    );
  }
  
  getUserTasks(userId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}tasks/${userId}`).pipe(
      // Transform the response to format dates and times
      map((tasks) =>
        tasks.map((task: any) => ({
          ...task,
          dueAt: task.dueAt
            ? moment(task.dueAt).format('YYYY-MM-DD HH:mm:ss')
            : null,
          createdAt: task.createdAt
            ? moment(task.createdAt).format('YYYY-MM-DD HH:mm:ss')
            : null,
          updatedAt: task.updatedAt
            ? moment.utc(task.updatedAt).format('YYYY-MM-DD HH:mm:ss')
            : null,
        }))
      )
    );
  }

  addTask(data: any): Observable<any> {
    const headers = { 'Developer-Name': 'Diego' };
    const url = `${this.apiUrl}task/add`;
    return this.http.post(url, data, { headers });
  }

  getTask(taskId: any): Observable<any> {
    const headers = { 'Developer-Name': 'Diego' };
    const url = `${this.apiUrl}task/${taskId}`;
    return this.http.get(url, { headers });
  }

  updateTask(data: any): Observable<any> {
    console.log(data);
    const headers = { 'Developer-Name': 'Diego' };
    const url = `${this.apiUrl}task/${data.id}`;
    return this.http.put(url, data, { headers });
  }

  deleteTask(taskId: any): Observable<any> {
    const headers = { 'Developer-Name': 'Diego' };
    const url = `${this.apiUrl}task/${taskId}`;
    return this.http.delete(url, { headers });
  }

  // for Users
  createOtp(data: any): Observable<any> {
    const headers = { 'Developer-Name': 'Diego' };
    const url = `${this.apiUrl}user/create-otp`;
    return this.http.post(url, data, { headers });
  }

  verifyOtp(data: any): Observable<any> {
    const headers = { 'Developer-Name': 'Diego' };
    const url = `${this.apiUrl}user/verify-otp`;
    return this.http.post(url, data, { headers });
  }

  createOtpByPhone(phone: string): Observable<any> {
    let data = { "phone": phone };
    return this.http.post(`${this.apiUrl}create-otp-phone`, { data });
  }

  createOtpByEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}create-otp-email`, { email }).pipe(
      tap({
        next: (response) => console.log('OTP response:', response),
        error: (err) => console.error('OTP error:', err),
      })
    );
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addUser(data: any): Observable<any> {
    const headers = { 'Developer-Name': 'Diego' };
    const url = `${this.apiUrl}user/add`;
    return this.http.post(url, data, { headers });
  }

  getUser(taskId: any): Observable<any> {
    const headers = { 'Developer-Name': 'Diego' };
    const url = `${this.apiUrl}user/${taskId}`;
    return this.http.get(url, { headers });
  }

  updateUser(data: any): Observable<any> {
    const headers = { 'Developer-Name': 'Diego' };
    const url = `${this.apiUrl}user/${data.id}`;
    return this.http.put(url, data, { headers });
  }

}
