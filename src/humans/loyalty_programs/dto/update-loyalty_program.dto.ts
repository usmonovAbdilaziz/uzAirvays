import { PartialType } from '@nestjs/mapped-types';
import { CreateLoyaltyProgramDto } from './create-loyalty_program.dto';

export class UpdateLoyaltyProgramDto extends PartialType(
  CreateLoyaltyProgramDto,
) {}
