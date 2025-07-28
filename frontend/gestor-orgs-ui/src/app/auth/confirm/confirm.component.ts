import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent implements OnInit {
  confirmForm: FormGroup;
  loading = false;
  username: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.confirmForm = this.formBuilder.group({
      code: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });
  }

  ngOnInit(): void {
    // Obtener username de los parámetros de ruta
    this.route.queryParams.subscribe((params) => {
      this.username = params['username'] || '';
    });

    // Redirigir si no hay username
    if (!this.username) {
      this.router.navigate(['/register']);
    }
  }

  // Getter para acceso fácil a los campos del formulario
  get f() {
    return this.confirmForm.controls;
  }

  async onSubmit(): Promise<void> {
    if (this.confirmForm.invalid || !this.username) {
      return;
    }

    this.loading = true;

    try {
      await this.authService.confirmSignUp(this.username, this.f['code'].value);

      this.snackBar.open(
        'Cuenta confirmada exitosamente. Ahora puedes iniciar sesión.',
        'Cerrar',
        {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        }
      );

      this.router.navigate(['/login']);
    } catch (error: any) {
      let errorMessage = 'Error al confirmar la cuenta';

      if (error.code === 'CodeMismatchException') {
        errorMessage = 'El código de verificación es incorrecto';
      } else if (error.code === 'ExpiredCodeException') {
        errorMessage = 'El código ha expirado, solicita uno nuevo';
      } else if (error.message) {
        errorMessage = error.message;
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

  // Solicitar un nuevo código de verificación
  async resendCode(): Promise<void> {
    if (!this.username) {
      return;
    }

    try {
      // Implementar método en el servicio si es necesario
      // await this.authService.resendConfirmationCode(this.username);

      this.snackBar.open(
        'Se ha enviado un nuevo código a tu correo',
        'Cerrar',
        {
          duration: 3000,
        }
      );
    } catch (error: any) {
      this.snackBar.open(
        'Error al enviar el código: ' + (error.message || error),
        'Cerrar',
        {
          duration: 5000,
          panelClass: ['error-snackbar'],
        }
      );
    }
  }
}
