import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';
import { LoginInputDto, ResgiterInputDto } from './dto/login-input.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import PasswordHash from '../auth/password.hash';
import { ModuleInputDto, VerifyOtpDto } from './dto/user-input.dto';
import { ProfileDto, ProfileUpdateDto } from './dto/profile';
import { FindAllUsersDto } from './dto/find-all';
import { ErrorUtil } from '../common/utils/error-util';
import * as bcrypt from 'bcrypt';
import { CustomRequest } from 'src/types/custom-request.interface';
import { generateOTP } from 'src/utills/date.helper';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly emailService: EmailService = new EmailService(this.db),

    private jwtService: JwtService,
    private readonly passwordHash: PasswordHash,
  ) {}

  // Login
  async login(loginInputDto: LoginInputDto): Promise<any> {
    const payload: any = {};
    payload.email = loginInputDto?.user_name;
    const user = await this.db.user.findFirst({
      where: { ...payload },
    });
    // if (!user) {
    //   const saltOrRounds: number = 10;
    //   const hashPass = await bcrypt.hash(loginInputDto.password, saltOrRounds);

    //   // create user
    //   const userCreate = await this.db.user.create({
    //     data: {
    //       ...payload,
    //       password: hashPass,
    //       first_name: 'shehzad',
    //     },
    //   });
    //   return userCreate;
    // }
    // Step 2: Check if the password is correct

    // If password does not match, throw an error
    const isMatch = await bcrypt.compare(
      loginInputDto?.password,
      user?.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const accessToken = this.jwtService.sign({
      user_id: user.id,
    });
    const updateUser = await this.db.user.update({
      where: { id: user?.id },
      data: { referesh_token: accessToken },
    });
    return updateUser;
  }
  // Register
  async register(registerInputDto: Prisma.UserUpdateInput): Promise<any> {
    const { password, confirm_password, ...payload }: any = {
      ...registerInputDto,
    };
    if (password !== confirm_password) {
      throw new UnauthorizedException('password doest not match');
    }
    const user = await this.db.user.findFirst({
      where: { email: payload?.email },
    });
    if (user) throw new UnauthorizedException('Email is already registered.');
    const saltOrRounds: number = 10;

    const hashPass = await bcrypt.hash(password, saltOrRounds);

    const updateUser = await this.db.user.create({
      data: { ...payload, password: hashPass },
    });
    if (updateUser) {
      const otp = generateOTP(5);
      await this.db.user.update({
        where: { id: updateUser?.id },
        data: { otp: otp },
      });
      const emailData = {
        full_name: `${updateUser.full_name}`,
        first_name: updateUser.first_name,
        email: updateUser.email,
        number: updateUser.number,
        otp: otp,
      };
      await this.emailService.sendTemplatedEmail(
        payload.email,
        'otp_verification',
        emailData,
      );
      const accessToken = this.jwtService.sign({
        user_id: updateUser.id,
      });
    }
    return updateUser;
  }
  async verify(verifyOtpInputDto: VerifyOtpDto): Promise<any> {
    const payload: any = {
      ...verifyOtpInputDto,
    };

    const user = await this.db.user.findFirst({
      where: { email: payload?.email },
    });
    if (!user) throw new UnauthorizedException('User Not Found.');
    const saltOrRounds: number = 10;

    if (user) {
      await this.db.user.update({
        where: { id: user?.id },
        data: { is_registered: true },
      });
    }
    return user;
  }

  async findAuhtoizeduser(user_id: string) {
    return await this.db.user.findFirst({ where: { id: user_id } });
  }
  async profile(request: CustomRequest) {
    const user_id = request?.user?.id;
    return await this.db.user.findFirst({
      where: { id: user_id },
      include: { Organization: true, Role: true },
    });
  }

  update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    return this.db.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.db.user.delete({ where: { id } });
  }

  async logout(request: any) {
    request?.session?.destroy(() => {
      return {
        message: 'Logout successful',
        statusCode: 200,
      };
    });
  }
}
