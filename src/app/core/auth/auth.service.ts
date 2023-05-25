import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthUtils } from './auth.utils';
//import { UserService } from 'app/core/user/user.service';
import { UserService } from '../user/user.service';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
      private cookieService: CookieService,
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }


    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }


  set accessEdi(token: string)
  {
    localStorage.setItem('accessEdi', token);
  }


  get accessEdi(): string
  {
    return localStorage.getItem('accessEdi') ?? '';
  }


  set accessOpcionesPorUsuario(data: string)
  {
    localStorage.setItem('accessOpcionesPorUsuario', data);
  }
  get accessOpcionesPorUsuario()
  {
    return localStorage.getItem('accessOpcionesPorUsuario') ?? '';
  }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials:any): Observable<any>
    {
        
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(environment.apiUrl + '/Autenticacion',
            credentials,
        ).pipe(
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.body;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = JSON.parse(AuthUtils._decodeToken(response.body).data);
                // Return a new observable with the response
                return of(response);
            })
        );
    }
    encriptar(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
          this._httpClient
            .post(`${environment.apiEdiUrl}/Usuario/Encriptar`, {
              Body: data.toString(),
              Token: "MIw3lILd1k4GwoAuelSGjwPVepY"
            })
            .subscribe({
              next: (data) => resolve({"data": data}),
              error: (err) => reject(err),
            });
        });
      }

    async  encriptarBody(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
          this._httpClient
            .post(`${environment.apiEdiUrl}/Usuario/Encriptar`, {
              Body: JSON.stringify(data),
              Token: "MIw3lILd1k4GwoAuelSGjwPVepY"
            })
            .subscribe({
              next: (data) => resolve({"data": data}),
              error: (err) => reject(err),
            });
        });
      }

    async login(request:any): Promise<any>
    {    
        var data = await this.encriptarBody(request);     
        return new Promise((resolve, reject) => {
            this._httpClient
              .post(`${environment.apiEdiUrl}/Autenticacion`,data)
              .subscribe({
                next: (data:any) => {            
                  return resolve(data);
                },
                error: (err) => reject(err),
              });
          });
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
      this.cookieService.deleteAll();
      localStorage.removeItem('accessEdi');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('listOpciones');
      
      //localStorage.removeItem('permissions');
      //localStorage.removeItem('navigation');
      this._authenticated = false;
      return of(true);
      /*
        return this._httpClient.get(environment.apiUrl + '/Seguridad/Salir').pipe(
            switchMap((response: any) => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('permissions');
                localStorage.removeItem('navigation');
                this._authenticated = false;
                return of(true);
            })
        );*/
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }


        return of(true);
        //  return this.getUserDataInUsingToken();
        // //  return this.signInUsingToken();
    }

    /** Obtiene la información del usuario */
    getUserDataInUsingToken():Observable<any> {
        this._userService.user = JSON.parse(AuthUtils._decodeToken(this.accessToken).data);

        return of(true);
    }
}
