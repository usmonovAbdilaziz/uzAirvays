import { Module } from '@nestjs/common';
import { LoyaltyProgramsService } from './loyalty_programs.service';
import { LoyaltyProgramsController } from './loyalty_programs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoyaltyProgram } from './entities/loyalty_program.entity';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([LoyaltyProgram]), UsersModule],
  controllers: [LoyaltyProgramsController],
  providers: [LoyaltyProgramsService],
})
export class LoyaltyProgramsModule {}
