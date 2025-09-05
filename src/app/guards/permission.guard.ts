import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NavigationService } from '@app/services/common/navigation.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(
    private navigationService: NavigationService,
    private router: Router,
    private snackService: SnackbarService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const requiredPermissions = route.data['permission'];
    console.log('asdas', requiredPermissions)
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return from([true]);
    }

    const permissionsArray = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    // Transformando a Promise em Observable
    return from(
      (async () => {
        for (const permission of permissionsArray) {
          const hasPermission = await this.navigationService.checkComponentPass(permission);
          if (hasPermission) return true; // se tiver pelo menos uma permissão, libera
        }
        // Se não tiver nenhuma permissão
        this.router.navigate(['']);
        this.snackService.open('Usuário sem permissão para acessar esta página');
        return false;
      })()
    );
  }
}
