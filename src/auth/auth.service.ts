import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const newUser = await this.userService.create(createUserDto);

    return {
      ...newUser,
      token: this.getJwtToken({ id: newUser?.id as string }),
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userService.findOne(email);

    const isCorrectPassword = await this.bcryptAdapter.compare(
      password,
      user.password,
    );

    if (!isCorrectPassword)
      throw new BadRequestException('Contraseña incorrecta');

    return {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      nickname: user.nickname,
      roles: user.roles,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
