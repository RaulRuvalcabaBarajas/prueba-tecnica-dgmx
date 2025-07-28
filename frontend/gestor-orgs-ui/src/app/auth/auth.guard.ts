import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated$.pipe(
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          return of(true);
        }

        // Intentar obtener el usuario actual antes de redirigir
        return of(this.checkCurrentUser());
      }),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          console.log('Acceso denegado: Usuario no autenticado');
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url },
          });
        }
      })
    );
  }

  private async checkCurrentUser(): Promise<boolean> {
    try {
      await this.authService.currentUser();
      return true;
    } catch (error) {
      return false;
    }
  }
}
