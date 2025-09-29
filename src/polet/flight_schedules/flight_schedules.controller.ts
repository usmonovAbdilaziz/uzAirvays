import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FlightSchedulesService } from './flight_schedules.service';
import { CreateFlightScheduleDto } from './dto/create-flight_schedule.dto';
import { UpdateFlightScheduleDto } from './dto/update-flight_schedule.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { AdminRole } from '../../Roles/roles';

@Controller('flight-schedules')
@UseGuards(AuthGuard, RolesGuard)
@Roles(AdminRole.ADMIN, AdminRole.SUPERADMIN)
export class FlightSchedulesController {
  constructor(
    private readonly flightSchedulesService: FlightSchedulesService,
  ) {}

  @Post()
  create(@Body() createFlightScheduleDto: CreateFlightScheduleDto) {
    return this.flightSchedulesService.create(createFlightScheduleDto);
  }

  @Get()
  findAll() {
    return this.flightSchedulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flightSchedulesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFlightScheduleDto: UpdateFlightScheduleDto,
  ) {
    return this.flightSchedulesService.update(+id, updateFlightScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flightSchedulesService.remove(+id);
  }
}
