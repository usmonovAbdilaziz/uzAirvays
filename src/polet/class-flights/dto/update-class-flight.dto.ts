import { PartialType } from '@nestjs/mapped-types';
import { CreateClassFlightDto } from './create-class-flight.dto';

export class UpdateClassFlightDto extends PartialType(CreateClassFlightDto) {}
