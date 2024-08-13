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
import {
  changePasswordDto,
  ModuleInputDto,
  SendOtpDto,
  VerifyOtpDto,
} from './dto/user-input.dto';
import { ProfileDto, ProfileUpdateDto } from './dto/profile';
import { FindAllUsersDto } from './dto/find-all';
import { ErrorUtil } from '../common/utils/error-util';
import * as bcrypt from 'bcrypt';
import { CustomRequest } from 'src/types/custom-request.interface';
import { generateOTP } from 'src/utills/date.helper';
import { EmailService } from 'src/email/email.service';
import { StripeService } from 'src/stripe-service/stripe-service.service';
import { error } from 'console';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly emailService: EmailService = new EmailService(this.db),
    private readonly stripeService: StripeService = new StripeService(this.db),

    private jwtService: JwtService,
    private readonly passwordHash: PasswordHash,
  ) {}
  async register(registerInputDto: ResgiterInputDto): Promise<any> {
    const { password, confirm_password, plan_id, ...payload }: any = {
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
    const stripe_customer_id: any =
      await this.stripeService.createStripeCustomer({
        name: payload?.full_name,
        email: payload?.email,
      });

    const updateUser = await this.db.user.create({
      data: {
        ...payload,
        password: hashPass,
        stripe_customer_id: stripe_customer_id?.id,
      },
    });
    const findPlan = await this.db.plans.findFirst({
      where: {
        id: plan_id,
        type: 'self_assessment',
      },
      include: {
        PlansFeatures: {
          select: {
            id: true,
            name: true,
            value: true,
          },
        },
      },
    });
    if (findPlan) {
      await this.db.userPlans.create({
        data: {
          user_id: updateUser?.id,
          plan_id: findPlan?.id ?? '',
          subscription: findPlan?.name,
          status: 'hold',
          plan_features: findPlan?.PlansFeatures,
        },
      });
    }
    console.log({ findPlan });
    if (updateUser) {
      const otp = generateOTP(4);
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
    }
    return updateUser;
  }
  // Login
  async login(loginInputDto: LoginInputDto): Promise<any> {
    const payload: any = {};
    payload.email = loginInputDto?.user_name;
    const user = await this.db.user.findFirst({
      where: { ...payload },

      include: {
        Organization: true,
        Industry: true,
        Role: {
          select: {
            id: true,
            name: true,
            RolePermsions: {
              where: {
                access: 'W',
              },
              select: {
                Resources: true,
              },
            },
          },
        },
      },
    });
    console.log({ user });
    // Step 2: Check if the password is correct
    if (!user) throw new NotFoundException({ error: 'User not founds' });
    // If password does not match, throw an error
    const isMatch = await bcrypt.compare(
      loginInputDto?.password,
      user?.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException({ error: 'password is incorrect' });
    }
    if (!user?.is_registered) {
      const otp = generateOTP(4);
      await this.db.user.update({
        where: { id: user?.id },
        data: { otp: otp },
      });
      const emailData = {
        full_name: `${user.full_name}`,
        first_name: user.first_name,
        email: user.email,
        number: user.number,
        otp: otp,
      };
      await this.emailService.sendTemplatedEmail(
        payload.email,
        'otp_verification',
        emailData,
      );
      return {
        message: 'Email Sent to you for otp verification to proceed further',
        type: 'otp_verification',
        success: true,
      };
    }
    const userPlan = await this.db.userPlans.findFirst({
      where: {
        user_id: user?.id,
        status: 'hold',
      },
    });
    if (userPlan) {
      const accessToken = this.jwtService.sign(
        {
          id: user?.id,
          userPlan,
        },
        {
          expiresIn: '10m', // Token will expire in 10 minutes
        },
      );
      return {
        message:
          'Your account payment status is on hold please pay and  to proceed further',
        success: true,
        type: 'payment',

        stirpeToken: accessToken,
      };
    }
    const accessToken = this.jwtService.sign({
      user_id: user.id,
    });
    const updateUser = await this.db.user.update({
      where: { id: user?.id },
      data: { referesh_token: accessToken },
      include: {
        Organization: true,
        Industry: true,
        Role: {
          select: {
            id: true,
            name: true,
            RolePermsions: {
              where: {
                access: 'W',
              },
              select: {
                Resources: true,
              },
            },
          },
        },
      },
    });
    return updateUser;
  }
  // Register
  async sendOtp(verifyOtpInputDto: SendOtpDto): Promise<any> {
    const { ...payload }: any = {
      ...verifyOtpInputDto,
    };
    const user = await this.db.user.findFirst({
      where: { ...payload },
    });
    if (!user) throw new UnauthorizedException('User Not Found.');
    const accessToken = this.jwtService.sign(
      {
        email: payload?.email,
      },
      {
        expiresIn: '10m', // Token will expire in 10 minutes
      },
    );
    if (user) {
      const otp = generateOTP(4);
      await this.db.user.update({
        where: { id: user?.id },
        data: { otp: otp },
      });
      const emailData = {
        full_name: `${user.full_name}`,
        first_name: user.first_name,
        email: user.email,
        number: user.number,
        otp: otp,
      };
      await this.emailService.sendTemplatedEmail(
        payload.email,
        'password_change',
        emailData,
      );
    }
    return {
      message: 'Otp Email Sent to you',
      user,
      success: true,
      accessToken,
    };
  }
  async changePassword(changePasswordDto: changePasswordDto): Promise<any> {
    const { ...payload } = {
      ...changePasswordDto,
    };

    const accessToken = this.jwtService.verify(payload?.accessToken);
    console.log({ accessToken });
    // find user
    const user = await this.db.user.findFirst({
      where: { email: accessToken?.email },
    });
    if (!user) throw new NotFoundException('user not found');
    if (payload?.password !== payload?.confirm_password) {
      throw new NotFoundException('password doest not match');
    }
    const saltOrRounds: number = 10;

    const hashPass = await bcrypt.hash(payload?.password, saltOrRounds);

    const userUpdate = await this.db.user.update({
      where: { email: user?.email },
      data: {
        password: hashPass,
      },
    });
    return {
      message: 'Password change successfully',
      user: userUpdate,
      success: true,
      accessToken,
    };
  }

  async verify(verifyOtpInputDto: VerifyOtpDto): Promise<any> {
    const { type, ...payload }: any = {
      ...verifyOtpInputDto,
    };
    console.log({ payload });
    const user = await this.db.user.findFirst({
      where: { email: payload?.email },
    });
    if (!user) throw new UnauthorizedException({ error: 'user not found!' });
    console.log({ user: user?.otp, payload: payload?.otp });
    if (user?.otp !== payload?.otp)
      throw new UnauthorizedException({ error: 'otp does not match!' });

    if (user) {
      await this.db.user.update({
        where: { id: user?.id },
        data: { is_registered: true, otp: '' },
      });
    }
    const userPlan = await this.db.userPlans.findFirst({
      where: {
        user_id: user?.id,
        status: 'hold',
      },
    });
    if (userPlan && type === 'registration') {
      const accessToken = this.jwtService.sign(
        {
          id: user?.id,
          userPlan,
        },
        {
          expiresIn: '10m', // Token will expire in 10 minutes
        },
      );
      return {
        message: 'Your account is hold please pay and  to proceed further',
        user,
        success: true,
        stirpeToken: accessToken,
      };
    }
    return {
      message: 'your otp is verified login to your account!',
      user,
      success: true,
    };
  }
  async roles(payload) {
    const roles = await this.db.role.findMany({
      where: {
        name: {
          not: 'admin',
          mode: 'insensitive',
        },
        type: payload?.type ? payload?.type : 'self',
      },
    });
    const industry = await this.db.industry.findMany();
    const organization = await this.db.organization.findMany();
    return { industry, organization, roles };
  }
  async findAuhtoizeduser(user_id: string) {
    return await this.db.user.findFirst({
      where: { id: user_id },
      include: {
        Organization: true,
        Industry: true,
        Role: {
          select: {
            id: true,
            name: true,
            RolePermsions: {
              where: {
                access: 'W',
              },
              select: {
                Resources: true,
              },
            },
          },
        },
      },
    });
  }

  async profile(request: CustomRequest) {
    const user_id = request?.user?.id;
    return await this.db.user.findFirst({
      where: { id: user_id },
      include: {
        Organization: true,
        Industry: true,
        Role: {
          select: {
            id: true,
            name: true,
            RolePermsions: {
              where: {
                access: 'W',
              },
              select: {
                Resources: true,
              },
            },
          },
        },
      },
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
