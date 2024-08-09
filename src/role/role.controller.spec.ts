import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { PrismaClient } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RoleController } from './role.controller';
import { DatabaseModule } from 'src/database/database.module';

describe('RoleService', () => {
  let service: RoleService;
  let db: DatabaseService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],

      controllers: [RoleController],
      providers: [
        RoleService,
        DatabaseService,
        { provide: PrismaClient, useValue: new PrismaClient() },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    db = module.get<DatabaseService>(DatabaseService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of roles', async () => {
      const roles = await service.findAll({});

      expect(roles?.roles).toBeInstanceOf(Array);
      expect(roles?.roles).toBeGreaterThan(0);
    });

    it('should return a count of roles', async () => {
      const count = await service.findAll({}).then((result) => result.count);

      expect(count).toBeGreaterThan(0);
    });
  });

  describe('findAllResource', () => {
    it('should return a list of resources', async () => {
      const resources = await service.findAllResource({});

      expect(resources?.data).toBeInstanceOf(Array);
      expect(resources?.data.length).toBeGreaterThan(0);
    });

    it('should return a count of resources', async () => {
      const count = await service
        .findAllResource({})
        .then((result) => result.count);

      expect(count).toBeGreaterThan(0);
    });

    it('should return a frequency counter', async () => {
      const frequencyCounter = await service
        .findAllResource({})
        .then((result) => result.switch);

      expect(frequencyCounter).toBeInstanceOf(Object);
      expect(Object.keys(frequencyCounter).length).toBeGreaterThan(0);
    });
  });

  describe('uploadPermission', () => {
    it('should upload permissions', async () => {
      const payload = [
        { resource_id: '1', role_id: '1', access: 'R' },
        { resource_id: '2', role_id: '2', access: 'W' },
      ];

      const result = await service.uploadPermission(payload);

      expect(result).toBeInstanceOf(Object);
      expect(result.message).toBe('Uploaded Permissions');
    });

    it('should throw an error if payload is empty', async () => {
      await expect(service.uploadPermission([])).rejects.toThrowError(
        new NotFoundException('Not found'),
      );
    });
  });
});
