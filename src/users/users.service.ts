import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { DatabaseExceptionService } from 'src/common/services/database-exception.service';
import { validate as isUUID } from 'uuid';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { ProfileImage } from './entities/user-image.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ProfileImage)
    private readonly profileImageRepository: Repository<ProfileImage>,

    private readonly bcryptAdapter: BcryptAdapter,
    private readonly databaseExceptionService: DatabaseExceptionService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, profileImage, ...userToCreate } = createUserDto;

    try {
      const encryptedPassword = await this.bcryptAdapter.hash(password);

      const newUser = this.userRepository.create({
        ...userToCreate,
        password: encryptedPassword,
        profileImage: this.profileImageRepository.create({ url: profileImage }),
      });

      await this.userRepository.save(newUser);

      return {
        id: newUser.id,
        fullname: newUser.fullname,
        email: newUser.email,
        nickname: newUser.nickname,
        roles: newUser.roles,
      };
    } catch (error) {
      this.databaseExceptionService.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(term: string) {
    let user: User | null = null;

    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term });
    } else {
      user = await this.userRepository.findOne({
        where: [{ email: term }, { nickname: term }],
      });
    }

    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user; // TODO: EVITAR QUE SE MUESTRE PASSWORD Y ISACTIVE
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
