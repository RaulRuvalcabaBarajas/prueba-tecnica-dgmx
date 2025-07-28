import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  hide = true; // Para toggle de visibilidad de contraseña
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    // Inicializar formulario
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    // Obtener URL de retorno desde parámetros de ruta o usar valor predeterminado
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  ngOnInit(): void {
    // Comprobar si el usuario ya está autenticado
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate([this.returnUrl]);
      }
    });
  }

  // Getter para acceso fácil a los campos del formulario
  get f() {
    return this.loginForm.controls;
  }

  async onSubmit(): Promise<void> {
    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    try {
      await this.authService.signIn(
        this.f['username'].value,
        this.f['password'].value
      );

      // Mostrar mensaje de éxito
      this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });

      // Redireccionar a la página solicitada originalmente
      this.router.navigate([this.returnUrl]);
    } catch (error: any) {
      let errorMessage = 'Error al iniciar sesión';

      // Mensajes personalizados según el tipo de error
      if (error.code === 'UserNotConfirmedException') {
        errorMessage = 'Por favor confirma tu cuenta primero';
        this.router.navigate(['/confirm'], {
          queryParams: { username: this.f['username'].value },
        });
      } else if (error.code === 'NotAuthorizedException') {
        errorMessage = 'Usuario o contraseña incorrectos';
      } else if (error.code === 'UserNotFoundException') {
        errorMessage = 'El usuario no existe';
      }

      this.snackBar.open(errorMessage, 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar'],
      });
    } finally {
      this.loading = false;
    }
  }

  forgotPassword(): void {
    // Implementar flujo de "olvidé mi contraseña" si es necesario
    this.router.navigate(['/forgot-password']);
  }
}
