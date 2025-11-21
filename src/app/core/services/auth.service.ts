import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { LoginRequest, LoginResponse } from '../models/auth-response.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials)
        .pipe(
          map(response => response.data),
          tap(data => {
            this.storageService.setItem(environment.tokenKey, data.token);
            this.storageService.setItem(environment.userKey, data.usuario);
          }),
          catchError(this.handleError)
        );
  }

  getPerfil(): Observable<Usuario> {
    const token = this.getToken();
    const headersAuth = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/perfil`, {headers: headersAuth})
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  // Obtiene el token actual guardado
  getToken(): string | null {
    return this.storageService.getItem<string>(environment.tokenKey);
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Verifica si el usuario tiene un rol específico
  hasRole(roles: string[]): boolean {
    const user: any = this.storageService.getItem(environment.userKey);
    if (!user || !user.rol) {
      return false;
    }
    return roles.includes(user.rol.nombre);
  }


  logout() {
    this.storageService.clear();
    this.router.navigate(['/auth/login'])
  }

  private handleError(error: HttpErrorResponse) {

    console.log('Error', error);
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.status === 400) {
      errorMessage = error.error.errors.map((err: any) => err.msg).join('\n') || 'Errores de validación';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#dc3545'
      });
    } else {
      errorMessage = error.error.message;
      if (error.status === 401) this.logout();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#dc3545'
      });
    }
    // Propagar el error para que el servicio pueda manejarlo si es necesario
    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      errors: error.error?.errors
    }));
  }
}
