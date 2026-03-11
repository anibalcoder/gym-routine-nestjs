import { Module } from '@nestjs/common';
import { DatabaseExceptionService } from './services/database-exception.service';
import { BcryptAdapter } from './adapters/bcrypt.adapter';

@Module({
  controllers: [],
  providers: [DatabaseExceptionService, BcryptAdapter],
  exports: [DatabaseExceptionService, BcryptAdapter],
})
export class CommonModule {}
