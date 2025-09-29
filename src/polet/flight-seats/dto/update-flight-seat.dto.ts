import { PartialType } from '@nestjs/mapped-types';
import { CreateFlightSeatDto } from './create-flight-seat.dto';

export class UpdateFlightSeatDto extends PartialType(CreateFlightSeatDto) {}
