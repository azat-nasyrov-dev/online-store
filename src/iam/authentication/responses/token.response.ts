import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenResponse {
  @Field()
  readonly accessToken: string;

  @Field()
  readonly refreshToken: string;
}
