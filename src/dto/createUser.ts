import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateValidation {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UpdateValidation {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
