import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { ApiLoggerService } from '../api-logger/api-logger.service';
import { LoginInputDto, ResgiterInputDto } from './dto/login-input.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  changePasswordDto,
  ModuleInputDto,
  SendOtpDto,
  VerifyOtpDto,
} from './dto/user-input.dto';
import { ProfileDto, ProfileUpdateDto } from './dto/profile';
import { FindAllUsersDto } from './dto/find-all';
import { CustomRequest } from 'src/types/custom-request.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new ApiLoggerService(UsersController.name);

  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginInputDto): Promise<LoginDto> {
    this.logger.log(`Request for login ${JSON.stringify(loginDto)} `);
    return this.usersService.login(loginDto);
  }
  @Post('register')
  @HttpCode(200)
  register(@Body() registerDto: Prisma.UserUpdateInput): Promise<LoginDto> {
    this.logger.log(`Request for registration ${JSON.stringify(registerDto)} `);
    return this.usersService.register(registerDto);
  }

  @Post('verify')
  @HttpCode(200)
  verify(@Body() verifyOtpDto: VerifyOtpDto): Promise<LoginDto> {
    this.logger.log(
      `Request for otp verification ${JSON.stringify(verifyOtpDto)} `,
    );
    return this.usersService.verify(verifyOtpDto);
  }
  @Post('send-otp')
  @HttpCode(200)
  sendOtp(@Body() sendOtpDto: SendOtpDto): Promise<LoginDto> {
    this.logger.log(`Request for otp send ${JSON.stringify(sendOtpDto)} `);
    return this.usersService.sendOtp(sendOtpDto);
  }
  @Post('change-password')
  @HttpCode(200)
  changePassword(
    @Body() changePasswordDto: changePasswordDto,
  ): Promise<LoginDto> {
    this.logger.log(
      `Request for otp send ${JSON.stringify(changePasswordDto)} `,
    );
    return this.usersService.changePassword(changePasswordDto);
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() request: CustomRequest) {
    this.logger.log(`Request for logout`);
    console.log({ request });
    return this.usersService.profile(request);
  }
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() request: CustomRequest) {
    this.logger.log(`Request for logout`);
    console.log({ request });

    return this.usersService.logout(request);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    this.logger.log(`Request for update`);
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    this.logger.log(`Request for remove`);
    return this.usersService.remove(id);
  }
}
