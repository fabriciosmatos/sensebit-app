import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';

/**
 Most apps have the concept of a User. This is a simple provider
 with stubs for login/signup/etc.
 
 This User provider makes calls to our API at the `login` and `signup` endpoints.
 
 By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * Se o campo `status` não for` success`, um erro será detectado e retornado.
 */
@Injectable()
export class User {
  _user: any;

  constructor(public api: Api) { }

  /**
   Envie uma solicitação POST para nosso endpoint de login com os dados 
    que o usuário inseriu no formulário.
   */
  login(accountInfo: any) {
    let seq = this.api.post('usuarios/login', accountInfo).share();

    seq.subscribe((res: any) => {
      // Se a API retornou uma resposta bem-sucedida, marque o usuário como logado
      
      if (!res.error) {
        this._loggedIn(res);
      } else {
        alert('E-mail ou senha invalidos');
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   Envie uma solicitação POST ao nosso endpoint de inscrição com 
   os dados que o usuário inseriu no formulário.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('usuarios', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }
}
