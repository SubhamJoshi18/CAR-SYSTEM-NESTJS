import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './userEntity';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class UserService {
  repo: Repository<User>;
  constructor(@InjectRepository(User) private repos: Repository<User>) {
    this.repo = repos;
  }

  //Making an instances of the Databse as Repository haiii

  //FindAll Data
  async findAll() {
    let emptyObject = {};
    const search = await this.repo.find(emptyObject);
    return search;
  }

  async findbyid(id: number) {
    try {
      return await this.repo.findOneByOrFail({ id });
    } catch (err: any) {
      throw new NotFoundException(err);
    }
  }

  async findEmail(email: string) {
    return await this.repo.find({ where: { email } });
  }

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async update(id: number, Attrs: Partial<User>) {
    const findUser = this.repo.findOneBy({ id });
    if (!findUser) {
      return null || undefined;
    }
    Object.assign(findUser, Attrs);
    return findUser;
  }
  async remove(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }
}
