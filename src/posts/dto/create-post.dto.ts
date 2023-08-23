import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsString()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  image: string;
}
