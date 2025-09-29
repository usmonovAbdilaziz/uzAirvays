import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsNotEmpty()
  @IsNumber()
  city_id: number;
}
