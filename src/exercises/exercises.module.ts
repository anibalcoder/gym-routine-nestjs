import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './entities/exercise.entity';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise]), AuthModule, CommonModule],
  controllers: [ExercisesController],
  providers: [ExercisesService],
})
export class ExerciseModule {}
