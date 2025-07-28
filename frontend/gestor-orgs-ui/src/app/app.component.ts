import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Gestor de Organizaciones y Miembros';
  isAuthenticated = false;
  username = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Suscribirse a los cambios en el estado de autenticación
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;

      if (isAuthenticated) {
        this.getUserInfo();
      } else {
        this.username = '';
      }
    });
  }

  async getUserInfo() {
    try {
      const user = await this.authService.currentUser();
      this.username = user.username;
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
    }
  }

  async logout() {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
