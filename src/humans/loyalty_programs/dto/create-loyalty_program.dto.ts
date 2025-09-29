import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsNull } from 'sequelize-typescript';

export class CreateLoyaltyProgramDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
