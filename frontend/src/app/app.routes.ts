import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup.component').then((m) => m.SignupComponent)
  },
  {
    path: 'employees',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/employees/employee-list.component').then((m) => m.EmployeeListComponent)
  },
  {
    path: 'employees/add',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/employees/employee-add.component').then((m) => m.EmployeeAddComponent)
  },

  { path: '**', redirectTo: 'login' }
];