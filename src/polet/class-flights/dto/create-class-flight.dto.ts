import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ClassFlightRole } from 'src/Roles/roles';

export class CreateClassFlightDto {
  @IsNotEmpty()
  @IsEnum(ClassFlightRole)
  code: ClassFlightRole;

  @IsNotEmpty()
  @IsNumber()
  legroom: number;

  @IsNotEmpty()
  @IsNumber()
  plane_id: number;

  @IsNotEmpty()
  @IsNumber()
  passenger_id: number;
}
