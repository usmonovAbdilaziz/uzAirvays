import {
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { BookingStatus, Currency } from '../../Roles/roles';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  booking_id: number;

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  provider_transaction_id: string;

  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;

  @IsObject()
  @IsOptional()
  metadata?: object;
}
