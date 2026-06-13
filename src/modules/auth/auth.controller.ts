import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse as SwaggerApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/get-user.decorator';
import { ApiResponse } from '../../common/response/api-response';
import type { User } from '../../common/types/user.type';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user', description: 'Creates a new user account with default role.' })
  @SwaggerApiResponse({ status: 201, description: 'User successfully registered.' })
  @SwaggerApiResponse({ status: 409, description: 'User already exists.' })
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login to the application', description: 'Authenticates a user and returns a JWT token.' })
  @ApiBody({ type: LoginDto })
  @SwaggerApiResponse({ status: 201, description: 'Login successful with JWT token.' })
  @SwaggerApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Request() req, @Body() dto: LoginDto) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({ summary: 'Get current user', description: 'Returns the currently authenticated user based on JWT token.' })
  @SwaggerApiResponse({ status: 200, description: 'User data retrieved successfully.' })
  @SwaggerApiResponse({ status: 401, description: 'Unauthorized.' })
  getMe(@CurrentUser() user: User) {
    return ApiResponse.success('Success', user);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @ApiOperation({ summary: 'Logout', description: 'Logs out the current user (client-side implementation).' })
  @SwaggerApiResponse({ status: 201, description: 'Logged out successfully.' })
  logout() {
    return ApiResponse.success('Logged out successfully');
  }
}
