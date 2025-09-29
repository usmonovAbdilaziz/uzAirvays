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
import { LoyaltyProgramsService } from './loyalty_programs.service';
import { CreateLoyaltyProgramDto } from './dto/create-loyalty_program.dto';
import { UpdateLoyaltyProgramDto } from './dto/update-loyalty_program.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { AdminRole } from '../../Roles/roles';

@Controller('loyalty-programs')
@UseGuards(AuthGuard, RolesGuard)
@Roles(AdminRole.USER, AdminRole.ADMIN, AdminRole.SUPERADMIN)
export class LoyaltyProgramsController {
  constructor(
    private readonly loyaltyProgramsService: LoyaltyProgramsService,
  ) {}

  @Post()
  create(@Body() createLoyaltyProgramDto: CreateLoyaltyProgramDto) {
    return this.loyaltyProgramsService.create(createLoyaltyProgramDto);
  }

  @Get()
  findAll() {
    return this.loyaltyProgramsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loyaltyProgramsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLoyaltyProgramDto: UpdateLoyaltyProgramDto,
  ) {
    return this.loyaltyProgramsService.update(+id, updateLoyaltyProgramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loyaltyProgramsService.remove(+id);
  }
}
