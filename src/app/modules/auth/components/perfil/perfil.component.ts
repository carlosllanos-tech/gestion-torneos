import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Usuario } from '../../../../core/models/usuario.model';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  // Usuario actual
  usuario: Usuario | null = null;
  
  // Estado de carga
  loading = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  // Carga los datos del perfil desde el backend
  cargarPerfil(): void {
    this.loading = true;

    this.authService.getPerfil().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.loading = false;
      },
      error: (error) => {
        // El error ya se maneja en el servicio
        this.loading = false;
      }
    });
  }

  // Cierra la sesión del usuario
  cerrarSesion(): void {
    Swal.fire({
      icon: 'question',
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro que deseas salir?',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  // Obtiene el badge del rol (color según tipo)
  getRoleBadgeClass(): string {
    const roleName = this.usuario?.rol.nombre;
    
    switch (roleName) {
      case 'admin':
        return 'bg-danger';
      case 'organizador':
        return 'bg-primary';
      case 'delegado':
        return 'bg-success';
      case 'participante':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  // Formatea una fecha ISO a formato legible
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
