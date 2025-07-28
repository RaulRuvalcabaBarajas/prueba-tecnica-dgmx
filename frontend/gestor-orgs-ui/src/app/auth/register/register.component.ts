import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  hide = true;
  hideConfirm = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.formBuilder.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        givenName: ['', Validators.required],
        familyName: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.mustMatch('password', 'confirmPassword'),
      }
    );
  }

  ngOnInit(): void {
    // Verificar si el usuario ya está autenticado
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  // Getter para acceso fácil a los campos del formulario
  get f() {
    return this.registerForm.controls;
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    try {
      const result = await this.authService.signUp(
        this.f['username'].value,
        this.f['password'].value,
        this.f['email'].value,
        this.f['givenName'].value,
        this.f['familyName'].value
      );

      this.snackBar.open(
        'Registro exitoso. Por favor confirma tu cuenta con el código enviado a tu correo.',
        'Cerrar',
        {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        }
      );

      // Redirigir a la página de confirmación con el nombre de usuario
      this.router.navigate(['/confirm'], {
        queryParams: { username: this.f['username'].value },
      });
    } catch (error: any) {
      let errorMessage = 'Error en el registro';

      if (error.code === 'UsernameExistsException') {
        errorMessage = 'El nombre de usuario ya existe';
      } else if (error.code === 'InvalidPasswordException') {
        errorMessage =
          'La contraseña no cumple con los requisitos de seguridad';
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
}
