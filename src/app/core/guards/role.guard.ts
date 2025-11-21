import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtener los roles permitidos de la configuración de la ruta
  const allowedRoles = route.data['roles'] as string[];

  // Verificar si está autenticado
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  // Verificar si tiene el rol requerido
  if (authService.hasRole(allowedRoles)) {
    return true; // Permitir acceso
  }

  // No tiene el rol requerido
  Swal.fire({
    icon: 'warning',
    title: 'Acceso Denegado',
    text: 'No tienes permisos para acceder a esta sección.',
    confirmButtonColor: '#ffc107'
  });

  // Redirigir al home
  router.navigate(['/']);
  return false;
};
