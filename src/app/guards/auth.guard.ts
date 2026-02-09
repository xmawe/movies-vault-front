import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  // On server, allow access (we'll check on client)
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // On client, check localStorage directly
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
