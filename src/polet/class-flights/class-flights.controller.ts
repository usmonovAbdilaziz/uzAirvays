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
import { ClassFlightsService } from './class-flights.service';
import { CreateClassFlightDto } from './dto/create-class-flight.dto';
import { UpdateClassFlightDto } from './dto/update-class-flight.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { AdminRole } from '../../Roles/roles';

@Controller('class-flights')
@UseGuards(AuthGuard, RolesGuard)
@Roles(AdminRole.USER, AdminRole.SUPERADMIN)
export class ClassFlightsController {
  constructor(private readonly classFlightsService: ClassFlightsService) {}

  @Post()
  create(@Body() createClassFlightDto: CreateClassFlightDto) {
    return this.classFlightsService.create(createClassFlightDto);
  }

  @Get()
  findAll() {
    return this.classFlightsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classFlightsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClassFlightDto: UpdateClassFlightDto,
  ) {
    return this.classFlightsService.update(+id, updateClassFlightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classFlightsService.remove(+id);
  }
}
