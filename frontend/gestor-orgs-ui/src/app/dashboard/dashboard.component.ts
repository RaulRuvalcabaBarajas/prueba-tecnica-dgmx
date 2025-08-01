import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  username: string = '';
  userAttributes: any = {};
  loading: boolean = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  async getUserInfo(): Promise<void> {
    try {
      this.loading = true;
      const user = await this.authService.currentUser();
      console.log('Usuario obtenido:', user);
      this.username = user.username;
      this.userAttributes = await this.authService.getUserAttributes();
      console.log('Atributos en componente:', this.userAttributes);
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
    } finally {
      this.loading = false;
    }
  }

  async onLogout(): Promise<void> {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
