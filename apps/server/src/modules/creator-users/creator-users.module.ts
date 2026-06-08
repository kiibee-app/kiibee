import { Module } from '@nestjs/common';
import { CreatorUsersController } from './creator-users.controller';
import { CreatorUsersService } from './creator-users.service';

@Module({
  controllers: [CreatorUsersController],
  providers: [CreatorUsersService],
})
export class CreatorUsersModule {}
