import {
  Controller,
  Patch,
  Delete,
  Get,
  Post,
  Body,
  Param,
  BadGatewayException,
  Query,
  Session,
} from '@nestjs/common';
import { CreateValidation, UpdateValidation } from 'src/dto/createUser';
import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserTdo } from 'src/dto/user';
import { UseInterceptors } from '@nestjs/common';
import { SerializerInterceptor } from 'src/interceptor/Interceptor';
import { SerializeFunction } from 'src/interceptor/Interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/userDecoratos';
import { User } from './userEntity';
import { UserInterceptor } from './interceptor/userinterceptor';
@Controller('/auth')
@UseInterceptors(UserInterceptor)
@SerializeFunction(UserTdo)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  // @Get('/color/:color')
  // list(@Param('color') color: any, @Session() session: any) {
  //   session.color = color;
  // }

  // @Get('/color')
  // listcolor(@Session() session: any) {
  //   console.log(session.color);
  //   return session.color;
  // }

  // @Get('/whoami')
  // whoami(@CurrentUser() user: any) {
  //   return user;
  // }
  @Post()
  async createUser(@Body() body: CreateValidation, @Session() session: any) {
    try {
      const UserCreated = await this.authService.signup(
        body.email,
        body.password,
      );
      session.UserId = UserCreated.id;
      return UserCreated;
    } catch (err) {
      throw new BadGatewayException('Error Creating User');
    }
  }

  @Post('/signin')
  userSignIn(@Body() body: CreateValidation, @Session() session: any) {
    const user = this.authService.signin(body.email, body.password);
    console.log(user);
    return session.UserId;
  }

  @Delete('/signout')
  signout(@Session() session: any) {
    session.UserId = null;
  }

  @Get('/:id')
  getById(@Param('id') id: number) {
    try {
      const userEmail = this.userService.findbyid(id);
      return userEmail;
    } catch (err) {
      throw new BadGatewayException('Error finding the ID');
    }
  }

  @Get()
  GetAllUser() {
    return this.userService.findAll();
  }

  @Get('/email')
  GetByEmail(@Query('email') email: string) {
    return this.userService.findEmail(email);
  }

  @Patch('/:id')
  async UpdateUser(@Param('id') id: number, @Body() body: UpdateValidation) {
    try {
      const update = await this.userService.update(id, body);
      return update;
    } catch (err) {
      throw new BadGatewayException('Error Updating the user');
    }
  }

  @Delete('/:id')
  async DeleteUser(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
