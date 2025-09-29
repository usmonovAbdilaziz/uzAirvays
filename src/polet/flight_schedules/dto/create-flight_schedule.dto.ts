import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ScheduleStatus } from '../../../Roles/roles';

export class CreateFlightScheduleDto {
  @IsNotEmpty()
  @IsNumber()
  flight_id: number;

  @IsNotEmpty()
  @IsNumber()
  plane_id: number;

  @IsNotEmpty()
  @IsDateString()
  departure_time: string;

  @IsNotEmpty()
  @IsDateString()
  arrival_time: string;

  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;

  @IsNotEmpty()
  @IsNumber()
  base_price: number;

  @IsOptional()
  @IsObject()
  seats_available?: {
    econom_seats: number;
    premium_seats: number;
  };
}
