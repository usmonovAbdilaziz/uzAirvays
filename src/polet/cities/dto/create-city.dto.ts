import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCityDto {
  @IsNotEmpty()
  @IsString()
  declare name: string;

  @IsNotEmpty()
  @IsNumber()
  declare country_id: number;
}
