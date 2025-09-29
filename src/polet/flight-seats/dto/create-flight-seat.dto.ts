import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { SeatCol } from 'src/Roles/roles';

export class CreateFlightSeatDto {
  @IsNotEmpty()
  @IsNumber()
  schedule_id: number;

  @IsNotEmpty()
  @IsNumber()
  passenger_id: number;

  @IsNotEmpty()
  @IsNumber()
  class_flight_id: number;

  @IsOptional()
  @IsBoolean()
  is_serviced?: boolean;

  @IsOptional()
  @IsDateString()
  reserved_until?: string;

  @IsNotEmpty()
  @IsNumber()
  seats_row: number;

  @IsNotEmpty()
  @IsEnum(SeatCol)
  seats_col: SeatCol;
}
