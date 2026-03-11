import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateExerciseDto } from './dto/upddate-exercise.dto';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exerciseService: ExercisesService) {}

  @Post()
  @Auth(ValidRoles.Admin)
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exerciseService.create(createExerciseDto);
  }

  @Get()
  @Auth()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.exerciseService.findAll(paginationDto);
  }

  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string) {
    return this.exerciseService.findOne(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.Admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exerciseService.update(id, updateExerciseDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.Admin)
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.exerciseService.delete(id);
  }
}
