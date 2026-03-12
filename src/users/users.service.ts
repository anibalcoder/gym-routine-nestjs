import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { DatabaseExceptionService } from 'src/common/services/database-exception.service';
import { validate as isUUID } from 'uuid';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { ProfileImage } from './entities/user-image.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ProfileImage)
    private readonly profileImageRepository: Repository<ProfileImage>,

    private readonly bcryptAdapter: BcryptAdapter,
    private readonly databaseExceptionService: DatabaseExceptionService,
    private readonly dataSource: DataSource,
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

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.userRepository.find({
      take: limit,
      skip: offset,
      relations: ['profileImage'],
    });
  }

  async findOne(term: string) {
    let user: User | null = null;

    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term });
    } else {
      user = await this.userRepository.findOne({
        where: [{ email: term }, { nickname: term }],
        relations: ['profileImage'],
      });
    }

    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user; // TODO: EVITAR QUE SE MUESTRE PASSWORD Y ISACTIVE
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { profileImage, ...userToUpdate } = updateUserDto;

    const user = await this.userRepository.preload({ id, ...userToUpdate });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (profileImage) {
        await queryRunner.manager.delete(ProfileImage, { user: user.id });

        user.profileImage = this.profileImageRepository.create({
          url: profileImage,
        });
      }

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.databaseExceptionService.handleDBExceptions(error);
    }

    return `This action updates a #${id} user`;
  }
}
