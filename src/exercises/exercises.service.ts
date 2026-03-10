import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExerciseDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Exercise } from './entities/exercise.entity';
import { Repository } from 'typeorm';
import { DatabaseExceptionService } from 'src/common/services/database-exception.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
import { normalizeText } from 'src/common/utils/normalize-text-util';
import { UpdateExerciseDto } from './dto/upddate-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    private readonly databaseExceptionService: DatabaseExceptionService,
  ) {}

  async create(createExerciseDto: CreateExerciseDto) {
    try {
      const newExercise = this.exerciseRepository.create(createExerciseDto);
      await this.exerciseRepository.save(newExercise);
      return newExercise;
    } catch (error) {
      this.databaseExceptionService.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const totalExercises = this.exerciseRepository.find({
      take: limit,
      skip: offset,
    });

    return totalExercises;
  }

  async findOne(term: string) {
    if (isUUID(term)) {
      return await this.exerciseRepository.findOneBy({ id: term });
    }

    const normalizedTerm = normalizeText(term);

    return await this.exerciseRepository.findOneBy([
      { muscleGroup: normalizedTerm },
      { exerciseName: normalizedTerm },
    ]);
  }

  async update(id: string, updateExerciseDto: UpdateExerciseDto) {
    /**
     * update no ejecuta hooks (@BeforeUpdate)
     */
    const exercise = await this.exerciseRepository.preload({
      id,
      ...updateExerciseDto,
    });

    if (!exercise)
      throw new NotFoundException(`Ejercicio #${id} no encontrado`);

    await this.exerciseRepository.save(exercise);

    return `Ejercicio #${id} actualizado correctamente`;
  }

  async delete(id: string) {
    const exercise = await this.exerciseRepository.delete({ id });

    if (exercise.affected === 0)
      throw new NotFoundException(`Ejercicio #${id} no encontrado`);

    return `Ejercicio #${id} eliminado correctamente`;
  }
}
