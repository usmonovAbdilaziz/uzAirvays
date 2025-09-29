import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class CryptoService {
  async encrypt(data: string): Promise<string> {
    return await bcryptjs.hash(data, 10);
  }

  async compare(data: string, hashedData: string): Promise<boolean> {
    return await bcryptjs.compare(data, hashedData);
  }
}
