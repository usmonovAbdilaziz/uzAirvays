import { PartialType } from '@nestjs/mapped-types';
import { CreateFlightScheduleDto } from './create-flight_schedule.dto';

export class UpdateFlightScheduleDto extends PartialType(
  CreateFlightScheduleDto,
) {}
