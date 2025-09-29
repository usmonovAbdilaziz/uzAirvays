import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';
import { BookingStatus, Currency } from 'src/Roles/roles';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber() // agar User.id integer bo'lsa -> @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber() // agar User.id integer bo'lsa -> @IsNumber()
  flight_schedule_id: number;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
