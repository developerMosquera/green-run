import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  AuthError,
  signInWithEmailAndPassword,
  UserCredential,
  getIdTokenResult,
} from 'firebase/auth';
import { FirebaseService } from '../../../firebase/firebase.service';
import { ILogin } from '../interfaces/login.interface';
import { IResultAuth } from '../interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(private firebaseService: FirebaseService) {}

  /**
   *
   * @param params
   * @returns
   */
  async login(params: ILogin): Promise<IResultAuth> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.firebaseService.auth,
        params.email,
        params.password,
      );

      const getToken = await getIdTokenResult(userCredential.user, true);

      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        token: getToken.token,
      };
    } catch (error: unknown) {
      const firebaseAuthError = error as AuthError;
      throw new HttpException(firebaseAuthError.message, HttpStatus.CONFLICT);
    }
  }
}
