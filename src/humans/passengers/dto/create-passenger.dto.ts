import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsNumber,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { SeatCol } from 'src/Roles/roles';

export class CreatePassengerDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsDateString()
  birth_date: string; // ISO format: 'YYYY-MM-DD'

  @IsNotEmpty()
  @IsString()
  @MaxLength(9)
  passport_number: string;

  @IsNotEmpty()
  @IsString()
  nationality: string;

  @IsOptional()
  @IsString()
  note?: string;
}
