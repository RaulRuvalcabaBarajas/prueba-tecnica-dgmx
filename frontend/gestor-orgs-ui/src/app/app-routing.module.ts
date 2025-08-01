import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ConfirmComponent } from './auth/confirm/confirm.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrgListComponent } from './pages/org-list/org-list.component';
import { OrgFormComponent } from './pages/org-form/org-form.component';
import { OrgDetailComponent } from './pages/org-detail/org-detail.component';
import { AddMemberComponent } from './pages/add-member/add-member.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirm', component: ConfirmComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  // Rutas para organizaciones
  {
    path: 'orgs',
    component: OrgListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orgs/new',
    component: OrgFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orgs/:id',
    component: OrgDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orgs/:id/edit',
    component: OrgFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orgs/:id/add-member',
    component: AddMemberComponent,
    canActivate: [AuthGuard],
  },
  // Ruta comodín para redirigir a login
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
