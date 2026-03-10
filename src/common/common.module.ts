import { Module } from '@nestjs/common';
import { DatabaseExceptionService } from './services/database-exception.service';

@Module({
  controllers: [],
  providers: [DatabaseExceptionService],
  exports: [DatabaseExceptionService],
})
export class CommonModule {}
