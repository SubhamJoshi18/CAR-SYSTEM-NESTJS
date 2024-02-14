import { UserService } from './user.service';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import {
  BadRequestException,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { Not } from 'typeorm';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signup(email: string, password: string) {
    console.log('Registering Your Email .....');

    //First Find the Email in your Database
    const CheckEmail = await this.userService.findEmail(email);
    if (CheckEmail.length) {
      throw new NotAcceptableException(
        'Try Another Email, This email is already in use',
      );
    }
    //Hash the password
    const salt = randomBytes(8).toString('hex');
    const hashedPassword = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hashedPassword.toString('hex');

    return await this.userService.create(email, result);
  }

  async signin(email: string, password: string) {
    console.log(this.userService.findEmail(email));
    const [user] = await this.userService.findEmail(email);
    if (user.length === 0) {
      throw new NotFoundException('User Does Not Exist');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as string;
    if (hash === storedHash) {
      return user;
    } else {
      throw new BadGatewayException('Invalid Password');
    }
  }
}
