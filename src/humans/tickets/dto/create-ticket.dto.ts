import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTicketDto {
  @IsNumber()
  @IsNotEmpty()
  booking_id: number;

  @IsNumber()
  @IsNotEmpty()
  flightSeat_id: number;

  @IsNumber()
  @IsNotEmpty()
  flight_id: number;

  @IsNumber()
  @IsNotEmpty()
  flight_schedule_id: number;

  @IsNumber()
  @IsNotEmpty()
  class_id: number;

  @IsNumber()
  @IsNotEmpty()
  passenger_id: number;
}
