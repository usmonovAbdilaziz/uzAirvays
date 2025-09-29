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
import { FlightSeatsService } from './flight-seats.service';
import { CreateFlightSeatDto } from './dto/create-flight-seat.dto';
import { UpdateFlightSeatDto } from './dto/update-flight-seat.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { AdminRole } from '../../Roles/roles';

@Controller('flight-seats')
@UseGuards(AuthGuard, RolesGuard)
@Roles(AdminRole.USER, AdminRole.SUPERADMIN)
export class FlightSeatsController {
  constructor(private readonly flightSeatsService: FlightSeatsService) {}

  @Post()
  create(@Body() createFlightSeatDto: CreateFlightSeatDto) {
    return this.flightSeatsService.create(createFlightSeatDto);
  }

  @Get()
  findAll() {
    return this.flightSeatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flightSeatsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFlightSeatDto: UpdateFlightSeatDto,
  ) {
    return this.flightSeatsService.update(+id, updateFlightSeatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flightSeatsService.remove(+id);
  }
}
