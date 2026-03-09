import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  fullname: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'The password must contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roles: string[];
}
