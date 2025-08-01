import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Módulos de Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';

// Módulos y componentes propios
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { DashboardComponent } from './dashboard/dashboard.component';

// Páginas
import { AddMemberComponent } from './pages/add-member/add-member.component';
import { OrgDetailComponent } from './pages/org-detail/org-detail.component';
import { OrgFormComponent } from './pages/org-form/org-form.component';
import { OrgListComponent } from './pages/org-list/org-list.component';

// Diálogos
import { DeleteOrgDialogComponent } from './dialogs/delete-org/delete-org.component';
import { MemberRoleDialogComponent } from './dialogs/member-role/member-role.component';
import { RemoveMemberDialogComponent } from './dialogs/remove-member/remove-member.component';

@NgModule({
  declarations: [
    AppComponent, 
    DashboardComponent,
    AddMemberComponent,
    OrgDetailComponent,
    OrgFormComponent,
    OrgListComponent,
    DeleteOrgDialogComponent,
    MemberRoleDialogComponent,
    RemoveMemberDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule,
    // Módulos Material
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatDialogModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
