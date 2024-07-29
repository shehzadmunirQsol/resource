import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import PasswordHash from 'src/auth/password.hash';
import { LoginInputDto } from './dto/login-input.dto';
import { LoginDto } from './dto/login.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

jest.mock('src/database/database.service');
jest.mock('@nestjs/jwt');
jest.mock('src/auth/password.hash');

describe('UsersService', () => {
  let service: UsersService;
  let db: jest.Mocked<DatabaseService>;
  let jwtService: jest.Mocked<JwtService>;
  let passwordHash: jest.Mocked<PasswordHash>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, DatabaseService, JwtService, PasswordHash],
    }).compile();

    service = module.get<UsersService>(UsersService);
    db = module.get(DatabaseService);
    jwtService = module.get(JwtService);
    passwordHash = module.get(PasswordHash);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
