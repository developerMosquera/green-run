import { Injectable } from '@nestjs/common';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { CollectionReference, Firestore } from 'firebase/firestore';

@Injectable()
export class FirebaseService {
  public app: FirebaseApp;
  public auth: Auth;
  public fireStore: Firestore;

  // Collections
  public usersCollection: CollectionReference;

  constructor() {
    this.app = initializeApp({
      apiKey: process.env.APIKEY,
      appId: process.env.AUTHDOMAIN,
      authDomain: process.env.PROJECTID,
      measurementId: process.env.STORAGEBUCKET,
      messagingSenderId: process.env.MESSAGINGSENDERID,
      projectId: process.env.APPID,
      storageBucket: process.env.MEASUREMENTID,
    });

    this.auth = getAuth(this.app);
  }
}
