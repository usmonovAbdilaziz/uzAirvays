import { IsBoolean, IsNotEmpty, IsString, IsUrl, IsInt } from 'class-validator';

export class CreateNewsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsUrl()
  image_url: string;

  @IsNotEmpty()
  @IsBoolean()
  is_published: boolean;

  @IsNotEmpty()
  @IsInt()
  user_id: number;
}
