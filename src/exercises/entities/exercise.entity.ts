import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  BeforeInsert,
  Unique,
  BeforeUpdate,
} from 'typeorm';
import { Equipment } from '../dto/create-exercise.dto';
import { normalizeText } from 'src/common/utils/normalize-text-util';

@Entity('exercises')
@Unique(['exerciseName', 'equipment'])
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 150,
  })
  exerciseName: string;

  @Column({
    type: 'enum',
    enum: Equipment,
  })
  equipment: Equipment;

  @Index()
  @Column({
    type: 'varchar',
    length: 50,
  })
  muscleGroup: string; // hombro, cuadriceps, pecho, etc.

  @Column({
    type: 'varchar',
    length: 100,
  })
  targetMuscle: string; // deltoide anterior, cabeza larga del tríceps

  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @Column({
    type: 'text',
    nullable: true,
  })
  video: string;

  @Column({
    type: 'int',
  })
  sets: number;

  @Column('int', {
    array: true,
  })
  repetitionsPerSet: number[];

  @Column('int', {
    array: true,
  })
  weightPerSetKg: number[];

  @Column({
    type: 'int',
  })
  restTimeSeconds: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeTextFields() {
    this.exerciseName = normalizeText(this.exerciseName);
    this.muscleGroup = normalizeText(this.muscleGroup);
    this.targetMuscle = normalizeText(this.targetMuscle);
  }
}
