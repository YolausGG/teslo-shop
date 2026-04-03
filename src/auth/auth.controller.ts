import { Controller, Get, Post, Body, UseGuards, Req, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { IncomingHttpHeaders } from 'http';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto'
import { ValidRoles } from './interfaces';
import { UserRoleGuard } from './guards/user-role.guard';

import { AuthService } from './auth.service';

import { Auth, RoleProtected, GetUser } from './decorators';
import { RawHeaders } from 'src/common/decorators/raw-headers.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }



  @Get('private')
  @UseGuards(AuthGuard())
  testingRoutePrivate(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }


  // @SetMetadata('roles', ['admin', 'super-user'])
  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user,
    }
  }


  @Get('private3')
  @Auth()
  privateRoute3(
    @GetUser() user: User,
  ) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user,
    }
  }

}
