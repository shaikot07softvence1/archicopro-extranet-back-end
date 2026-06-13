import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: String,
    example: 'admin@example.com',
    required: true,
    description: 'Registered user email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    example: 'admin123',
    required: true,
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
