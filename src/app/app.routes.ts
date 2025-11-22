import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth-routing.module').then(m => m.AuthRoutingModule)
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadChildren: () => import('./modules/modules-routing.module').then(m => m.ModulesRoutingModule)
    }
];
