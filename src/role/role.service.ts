import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DatabaseService } from 'src/database/database.service';
import { NotFoundError } from 'rxjs';

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
  async findAllResource(payload) {
    // const totalresourcesPromise = this.db.resources.count({});
    // const resourcesPromise = this.db.resources.findMany({
    //   orderBy: { createdAt: 'asc' },
    // });

    // const [count, resources] = await Promise.all([
    //   totalresourcesPromise,
    //   resourcesPromise,
    // ]);
    const totalCategoryPromise = this.db.resources.count({});

    const resourcePromise = this.db.resources.findMany({
      orderBy: { createdAt: 'asc' },
    });

    const permisionPromise = this.db.rolePermission.findMany({
      orderBy: { createdAt: 'asc' },

      where: {
        role_id: payload?.id ?? '0',
      },
      include: {
        Resources: true,
      },
    });
    const [totalCategory, resources, access] = await Promise.all([
      totalCategoryPromise,
      resourcePromise,
      permisionPromise,
    ]);
    const frequencyCounter = resources.reduce((accu: any, curr: any) => {
      const find_access = access?.find(
        (item) => item?.resource_id === curr?.id,
      );
      console.log({ find_access });
      accu[curr.id] = find_access ? find_access?.access : 'N';
      return accu;
    }, {});

    return {
      message: 'categories found',
      count: totalCategory,
      data: resources,
      switch: frequencyCounter,
      access,
    };
  }
  async uploadPermission(payload) {
    console.log({ payload });
    if (payload) {
      await payload?.map(async (item, index) => {
        console.log(item, index);
        if (item?.resource_id === '' || item?.role_id === '') {
          throw new NotFoundException('Not found');
        }
        const findData = await this.db.rolePermission.findFirst({
          where: {
            resource_id: item?.resource_id && item?.resource_id,
            role_id: item?.role_id && item?.role_id,
          },
        });
        if (findData) {
          await this.db.rolePermission.update({
            where: {
              id: findData?.id,
            },
            data: {
              access: item?.access,
            },
          });
        } else {
          await this.db.rolePermission.create({
            data: {
              ...item,
            },
          });
        }
      });
    }
    return {
      message: 'Uploaded Permissions',
      payload,
    };
  }

  findOne(id: string) {
    return `This action returns a #${id} role`;
  }

  update(id: string, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: string) {
    return `This action removes a #${id} role`;
  }
}
