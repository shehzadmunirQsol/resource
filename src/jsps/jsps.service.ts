import { Injectable } from '@nestjs/common';
import { CreateJspDto } from './dto/create-jsp.dto';
import { UpdateJspDto } from './dto/update-jsp.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class JspsService {
  constructor(private readonly db: DatabaseService) {}
  async create(createJspDto: any) {
    console.log({ createJspDto });
    const { expected, ...payload } = createJspDto;
    // await this.db.jsp.create({ data: createJspDto });
    return await this.db.jsp.create({
      data: {
        ...payload,
        JspSkill: { createMany: { data: expected } },
      },
    });
  }

  async findAll() {
    return await this.db.jsp.findMany({
      select: {
        Role: true,
        Competency: true,
        JspSkill: {
          select: {
            ExpectedLevel: true,
            Skill: {
              select: {
                id: true,
                name: true,
                description: true,

                SkillLevels: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} jsp`;
  }

  update(id: number, updateJspDto: UpdateJspDto) {
    return `This action updates a #${id} jsp`;
  }

  remove(id: number) {
    return `This action removes a #${id} jsp`;
  }
}
