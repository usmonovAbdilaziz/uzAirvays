import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FlightStatus } from '../../../Roles/roles';

export class CreatePlaneDto {
  @IsNumber()
  @IsNotEmpty()
  airport_id: number;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNotEmpty()
  @IsString()
  registration_number: string;

  @IsNotEmpty()
  @IsNumber()
  econom_seats: number;

  @IsNotEmpty()
  @IsNumber()
  premium_seats: number;

  @IsNotEmpty()
  @IsNumber()
  lifting_weight: number;

  @IsNotEmpty()
  @IsString()
  seat_map: string;

  @IsOptional()
  @IsEnum(FlightStatus)
  status?: FlightStatus;
}
