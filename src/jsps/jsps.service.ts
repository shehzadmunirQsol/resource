import { Injectable } from '@nestjs/common';
import { CreateJspDto } from './dto/create-jsp.dto';
import { UpdateJspDto } from './dto/update-jsp.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class JspsService {
  constructor(private readonly db: DatabaseService) {}
  async create(createJspDto: any) {
    console.log({ createJspDto });
    // await this.db.jsp.create({ data: createJspDto });
    return await this.db.jsp.create({ data: createJspDto });
  }

  async findAll() {
    return await this.db.jsp.findMany({
      select: {
        Skills: true,
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
