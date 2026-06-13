import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse as SwaggerApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/get-user.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from './user.service';

@ApiTags('User Profile')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile', description: 'Returns the full profile details of the authenticated user.' })
  @SwaggerApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
  @SwaggerApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Put('me/profile')
  @ApiOperation({ summary: 'Update user profile', description: 'Updates the profile details of the authenticated user.' })
  @SwaggerApiResponse({ status: 200, description: 'User profile updated successfully.' })
  @SwaggerApiResponse({ status: 400, description: 'Validation error in payload.' })
  @SwaggerApiResponse({ status: 401, description: 'Unauthorized.' })
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(userId, dto);
  }

  @Put('me/password')
  @ApiOperation({ summary: 'Update user password', description: 'Updates the password of the authenticated user.' })
  @SwaggerApiResponse({ status: 200, description: 'Password updated successfully.' })
  @SwaggerApiResponse({ status: 400, description: 'Invalid current password or validation error.' })
  @SwaggerApiResponse({ status: 401, description: 'Unauthorized.' })
  updatePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(userId, dto);
  }
}
