import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateAirportDto {
  @IsNotEmpty()
  @IsString()
  iata_code: string;

  @IsNotEmpty()
  @IsString()
  icao_code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  company_id: number;

  @IsNotEmpty()
  @IsString()
  timezone: string;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
