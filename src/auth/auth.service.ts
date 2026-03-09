import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { Repository } from 'typeorm';
import { User } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BcryptAdapter } from './adapters/bcrypt.adapter';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { password, ...createAuth } = createUserDto;

    try {
      const encryptedPassword = await this.bcryptAdapter.hash(password);

      const newUser = this.userRepository.create({
        ...createAuth,
        password: encryptedPassword,
      });

      await this.userRepository.save(newUser);

      return {
        id: newUser.id,
        fullname: newUser.fullname,
        email: newUser.email,
        roles: newUser.roles,
        token: this.getJwtToken({ id: newUser.id }),
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) throw new BadRequestException('Usuario no encontrado');

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
      roles: user.roles,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  handleDBExceptions(error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException(
      'Ocurrió un error inesperado en el servidor. Intente nuevamente más tarde.',
    );
  }
}
