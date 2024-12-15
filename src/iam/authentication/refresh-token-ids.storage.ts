import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';

export class InvalidateRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage implements OnApplicationBootstrap, OnApplicationShutdown {
  private redisClient: Redis;
  private readonly logger = new Logger(RefreshTokenIdsStorage.name);

  onApplicationBootstrap() {
    // TODO: Ideally, should move this to the dedicated "RedisModule"
    // instead of initiating the connection here
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    });

    this.redisClient.ping((err, result) => {
      if (err) {
        this.logger.error(`Redis connection failed: ${err.message}`);
      } else {
        this.logger.log(`Redis connected: ${result}`);
      }
    });
  }

  onApplicationShutdown(signal?: string) {
    return this.redisClient.quit();
  }

  public async insert(userId: string, tokenId: string): Promise<void> {
    this.logger.log(`Inserting token for user ${userId}: ${tokenId}`);
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  public async validate(userId: string, tokenId: string): Promise<boolean> {
    const storedId = await this.redisClient.get(this.getKey(userId));
    this.logger.log(
      `Validating token for user ${userId}: storedId=${storedId}, providedId=${tokenId}`,
    );

    if (storedId !== tokenId) {
      throw new InvalidateRefreshTokenError();
    }
    return storedId === tokenId;
  }

  public async invalidate(userId: string): Promise<void> {
    this.logger.log(`Invalidating token for user ${userId}`);
    await this.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: string): string {
    return `user-${userId}`;
  }
}
