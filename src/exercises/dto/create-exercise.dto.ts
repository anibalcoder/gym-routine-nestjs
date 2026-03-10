import {
  IsString,
  IsInt,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
  Min,
  MaxLength,
  IsUrl,
  IsEnum,
} from 'class-validator';

export enum Equipment {
  Machine = 'machine',
  Barbell = 'barbell',
  Pulley = 'pulley',
  dumbbell = 'dumbbell',
}

export class CreateExerciseDto {
  @IsString()
  @MaxLength(150)
  exerciseName: string;

  @IsEnum(Equipment)
  equipment: Equipment;

  @IsString()
  @MaxLength(50)
  muscleGroup: string;

  @IsString()
  @MaxLength(100)
  targetMuscle: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsUrl()
  @IsOptional()
  video: string;

  @IsInt()
  @Min(1)
  sets: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  repetitionsPerSet: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  weightPerSetKg: number[];

  @IsInt()
  @Min(10)
  restTimeSeconds: number;
}
