import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    type: String,
    example: 'John',
    required: false,
    description: 'First name of the user',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    type: String,
    example: 'Doe',
    required: false,
    description: 'Last name of the user',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    type: String,
    example: '+1234567890',
    required: false,
    description: 'Phone number',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    type: String,
    example: 'https://example.com/avatar.jpg',
    required: false,
    description: 'Profile avatar URL',
  })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({
    type: String,
    example: 'Software Engineer',
    required: false,
    description: 'Company Role',
  })
  @IsString()
  @IsOptional()
  companyRole?: string;

  @ApiProperty({
    type: String,
    example: 'Tech Solutions Inc.',
    required: false,
    description: 'Company Name',
  })
  @IsString()
  @IsOptional()
  companyName?: string;
}
