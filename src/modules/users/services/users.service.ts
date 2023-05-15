import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AuthError,
  createUserWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { FirebaseService } from '../../../firebase/firebase.service';
import { Users, Balances } from '../entities';
import { IPost, IResultSave, IPut } from '../interfaces';
import { ROLE } from '../../auth/enums/role.enum';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private firebaseService: FirebaseService,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Balances)
    private readonly balancesRepository: Repository<Balances>,
    @Inject('REQUEST') private request: Request,
  ) {}

  async getUsers(): Promise<any> {
    return await this.usersRepository.find({
      relations: ['cities', 'cities.country', 'transactions'],
    });
  }

  async postUsers(data: IPost): Promise<IResultSave> {
    try {
      const userCredential: UserCredential = await this.registerUserFirebase(
        data.email,
        data.password,
      );

      const dataUser = { ...data, uid: userCredential.user.uid };
      const user = this.usersRepository.create(dataUser);
      const userSave = await this.usersRepository.save(user);

      // Create the first balance
      await this.createBalanceInitial(userSave);

      return {
        id: userSave.id,
        uid: dataUser.uid,
        email: data.email,
        created_at: userSave.created_at,
      };
    } catch (error) {
      const firebaseAuthError = error as AuthError;
      throw new HttpException(firebaseAuthError.message, HttpStatus.CONFLICT);
    }
  }

  async createBalanceInitial(user): Promise<void> {
    const createBalance = this.balancesRepository.create({ user: user });
    await this.balancesRepository.save(createBalance);
  }

  async registerUserFirebase(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      this.firebaseService.auth,
      email,
      password,
    );

    return userCredential;
  }

  async putUsers(id: number, data: IPut): Promise<IResultSave> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const reqUser = this.request.headers.user;
      const reqRole = this.request.headers.role;

      if (
        user.uid !== reqUser['uid'] &&
        user.role === ROLE.ADMIN &&
        (reqRole.toString() === ROLE.USER || reqRole.toString() === ROLE.ADMIN)
      ) {
        throw new HttpException(
          'Not authorized to process',
          HttpStatus.FORBIDDEN,
        );
      }

      const dataUser = Object.assign(user, data);
      const userSave = await this.usersRepository.save(dataUser);

      return {
        id: userSave.id,
        uid: dataUser.uid,
        email: dataUser.email,
        created_at: dataUser.created_at,
        updated_at: userSave.updated_at,
      };
    } catch (error) {
      if (error.response.error === 'Not Found') {
        throw new NotFoundException(error.response.message);
      }
      if (error.response === 'Not authorized to process') {
        throw new HttpException(
          'Not authorized to process',
          HttpStatus.FORBIDDEN,
        );
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}
