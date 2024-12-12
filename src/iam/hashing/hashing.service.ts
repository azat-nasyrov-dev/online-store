import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  public abstract hash(data: string | Buffer): Promise<string>;
  public abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
