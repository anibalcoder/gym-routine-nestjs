import { IsEmail, IsString, Matches } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'The password must contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;
}
