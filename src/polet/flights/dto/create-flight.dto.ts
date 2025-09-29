import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';
import { FlightStatus } from '../../../Roles/roles';

export class CreateFlightDto {
  @IsNotEmpty()
  @IsNumber()
  company_id: number;

  @IsNotEmpty()
  @IsNumber()
  origin_airport_id: number;

  @IsNotEmpty()
  @IsNumber()
  destination_airport_id: number;

  @IsNotEmpty()
  @IsNumber()
  plane_id: number;

  @IsNotEmpty()
  @IsString()
  flight_number: string;

  @IsNotEmpty()
  @IsNumber()
  duration_minutes: number;

  @IsOptional()
  @IsEnum(FlightStatus)
  status?: FlightStatus;

  @IsString()
  @IsNotEmpty()
  plan: string;
}
