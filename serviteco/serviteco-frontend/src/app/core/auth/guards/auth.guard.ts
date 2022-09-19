import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this._check('/');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param redirectURL
     * @private
     */
    private _check(redirectURL: string): Observable<boolean> {
        // Check the authentication status
        return this._authService.check()
            .pipe(
                switchMap((authenticated) => {

                    // If the user is not authenticated...
                    if (!authenticated) {
                        // Redirect to the sign-in page
                        this._router.navigate([`sign-in`]);

                        // Prevent the access
                        return of(false);
                    } else {
                        if (redirectURL.includes('gestion-usuarios')) {
                            if (this._authService.accessAdmin != 'administrador') {
                                this._router.navigate([`error/404`]);
                            }
                        } else if (redirectURL.includes('gestion-categorias')) {
                            if (this._authService.accessAdmin != 'administrador') {
                                this._router.navigate([`error/404`]);
                            }
                        } else if (redirectURL.includes('gestion-marcas')) {
                            if (this._authService.accessAdmin != 'administrador') {
                                this._router.navigate([`error/404`]);
                            }
                        } else if (redirectURL.includes('gestion-importadores')) {
                            if (this._authService.accessAdmin != 'administrador') {
                                this._router.navigate([`error/404`]);
                            }
                        } else if (redirectURL.includes('gestion-distribuidores')) {
                            if (this._authService.accessAdmin != 'administrador') {
                                this._router.navigate([`error/404`]);
                            }
                        } else if (redirectURL.includes('gestion-repuestos')) {
                            if (this._authService.accessAdmin != 'administrador') {
                                this._router.navigate([`error/404`]);
                            }
                        } else if (redirectURL.includes('gestion-mano-obra')) {
                            if (this._authService.accessAdmin != 'administrador') {
                                this._router.navigate([`error/404`]);
                            }
                        } else if (redirectURL.includes('gestion-funcionarios')) {
                            if (this._authService.accessAdmin != 'administrador') {
                                this._router.navigate([`error/404`]);
                            }
                        } else if (redirectURL.includes('gestion-referencias')) {
                            if (this._authService.accessAdmin != 'administrador') {
                                this._router.navigate([`error/404`]);
                            }
                        } else if (redirectURL.includes('gestion-pqrs')) {
                            if (this._authService.accessAdmin != 'administrador') {
                                this._router.navigate([`error/404`]);
                            }
                        } else if (redirectURL.includes('gestion-contactenos')) {
                            if (this._authService.accessAdmin != 'administrador') {
                                this._router.navigate([`error/404`]);
                            }
                        } else if (redirectURL.includes('gestion-talleres')) {
                            if (this._authService.accessAdmin != 'administrador') {
                                this._router.navigate([`error/404`]);
                            }
                        } else if (redirectURL.includes('gestion-usuario-final')) {
                            if (this._authService.accessAdmin != 'administrador') {
                                this._router.navigate([`error/404`]);
                            }
                        }
                    }

                    // Allow the access
                    return of(true);
                })
            );
    }
}