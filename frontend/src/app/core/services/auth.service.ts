import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apollo = inject(Apollo);
  private platformId = inject(PLATFORM_ID);

  signup(username: string, email: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation Signup($input: SignupInput!) {
          signup(input: $input) {
            success
            message
            data
            error
          }
        }
      `,
      variables: {
        input: {
          username,
          email,
          password
        }
      }
    }).pipe(map((res: any) => res.data.signup));
  }

  login(login: string, password: string): Observable<any> {
    return this.apollo.query({
      query: gql`
        query Login($input: LoginInput!) {
          login(input: $input) {
            success
            message
            data
            error
          }
        }
      `,
      variables: {
        input: {
          login,
          password
        }
      },
      fetchPolicy: 'no-cache'
    }).pipe(map((res: any) => res.data.login));
  }

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }
}