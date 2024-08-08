import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RoleService {
  constructor(private readonly db: DatabaseService) {}
  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAll(payload) {
    const totalRolesPromise = this.db.role.count({
      where: {
        is_deleted: false,
        name: {
          not: 'admin',
        },
      },
    });

    const rolesPromise = this.db.role.findMany({
      orderBy: { createdAt: 'asc' },
      skip: 0,
      take: 10,
      where: {
        is_deleted: false,
        name: {
          not: 'admin',
        },
      },
    });

    const [count, roles] = await Promise.all([totalRolesPromise, rolesPromise]);
    return { count, roles };
  }
  async findAllResource() {
    const totalresourcesPromise = this.db.resources.count({});
    const resourcesPromise = this.db.resources.findMany({
      orderBy: { createdAt: 'asc' },
      skip: 0,
      take: 10,
    });

    const [count, resources] = await Promise.all([
      totalresourcesPromise,
      resourcesPromise,
    ]);
    return { count, resources };
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
