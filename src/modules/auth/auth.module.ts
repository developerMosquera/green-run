import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { FirebaseService } from '../../firebase/firebase.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, FirebaseService],
})
export class AuthModule {}
