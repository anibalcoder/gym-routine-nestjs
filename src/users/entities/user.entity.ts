import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProfileImage } from './user-image.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullname: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('varchar', {
    unique: true,
  })
  nickname: string;

  @Column('text')
  password: string;

  @Column('boolean', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @OneToOne(() => ProfileImage, (image) => image.user, { cascade: true })
  profileImage: ProfileImage;
}
