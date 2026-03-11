import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashAdapter } from '../interfaces/hash.interface';

@Injectable()
export class BcryptAdapter implements HashAdapter {
  hash(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
