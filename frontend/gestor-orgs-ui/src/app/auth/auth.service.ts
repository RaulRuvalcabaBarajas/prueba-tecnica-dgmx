import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> =
    this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {
    this.checkAuthStatus();
  }

  /**
   * Verifica el estado de autenticación al iniciar la aplicación
   */
  private async checkAuthStatus(): Promise<void> {
    try {
      await this.currentUser();
      this.isAuthenticatedSubject.next(true);
    } catch (error) {
      this.isAuthenticatedSubject.next(false);
    }
  }

  /**
   * Registra un nuevo usuario en Cognito
   */
  async signUp(
    username: string,
    password: string,
    email: string,
    givenName: string,
    familyName: string
  ): Promise<any> {
    try {
      const result = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
          given_name: givenName,
          family_name: familyName,
        },
      });
      return result;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  /**
   * Confirma el registro de un usuario con el código enviado por email
   */
  async confirmSignUp(username: string, code: string): Promise<any> {
    try {
      return await Auth.confirmSignUp(username, code);
    } catch (error) {
      console.error('Error al confirmar registro:', error);
      throw error;
    }
  }

  /**
   * Inicia sesión de un usuario
   */
  async signIn(username: string, password: string): Promise<any> {
    try {
      const user = await Auth.signIn(username, password);
      this.isAuthenticatedSubject.next(true);
      return user;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  /**
   * Cierra sesión del usuario actual
   */
  async signOut(): Promise<void> {
    try {
      await Auth.signOut();
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  /**
   * Obtiene el usuario actualmente autenticado
   */
  async currentUser(): Promise<any> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      throw error;
    }
  }

  /**
   * Obtiene los atributos del usuario actual
   */
  async getUserAttributes(): Promise<any> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user.attributes;
    } catch (error) {
      console.error('Error al obtener atributos del usuario:', error);
      throw error;
    }
  }

  /**
   * Envía un código para restablecer la contraseña
   */
  async forgotPassword(username: string): Promise<any> {
    try {
      return await Auth.forgotPassword(username);
    } catch (error) {
      console.error(
        'Error al solicitar restablecimiento de contraseña:',
        error
      );
      throw error;
    }
  }

  /**
   * Confirma la nueva contraseña con el código recibido
   */
  async forgotPasswordSubmit(
    username: string,
    code: string,
    newPassword: string
  ): Promise<any> {
    try {
      return await Auth.forgotPasswordSubmit(username, code, newPassword);
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      throw error;
    }
  }
}
