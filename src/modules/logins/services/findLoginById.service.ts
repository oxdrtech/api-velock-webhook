import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ILoginsRepositories } from '../domain/repositories/ILogins.repositories';
import { Login } from '@prisma/client';
import { LOGINS_SERVICE_TOKEN } from '../utils/loginsServiceToken';

@Injectable()
export class FindLoginByIdService {
  constructor(
    @Inject(LOGINS_SERVICE_TOKEN)
    private readonly loginsRepositories: ILoginsRepositories,
  ) { }

  async execute(id: string): Promise<Login> {
    const login = await this.loginsRepositories.findLoginById(id);

    if (!login) throw new NotFoundException('login não existe');

    return login;
  }
}
