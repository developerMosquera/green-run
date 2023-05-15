import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { resolve } from 'path';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Not access token');
    }

    try {
      const configFileJsonFirebase = resolve(
        'src/modules/auth/resources',
        'green-run-service-account-key.json',
      );

      let appFirebase;
      if (!firebase.apps.length) {
        appFirebase = await firebase.initializeApp({
          credential: firebase.credential.cert(configFileJsonFirebase),
        });
      } else {
        appFirebase = await firebase.app();
      }

      const decodedToken = await appFirebase.auth().verifyIdToken(token);
      request.headers.user = decodedToken;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
  }

  private extractTokenFromHeader(authHeader: string): string {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return null;
  }
}
