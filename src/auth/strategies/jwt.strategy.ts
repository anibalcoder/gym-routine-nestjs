import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwtSecret') as string,
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;

    const user = await this.userService.findOne(id);

    if (!user) throw new UnauthorizedException('Token inválido');

    if (!user.isActive)
      throw new UnauthorizedException(
        'El usuario está inactivo, habla con un administrador.',
      );

    return user;
  }
}
