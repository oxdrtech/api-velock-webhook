import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LOGINS_SERVICE_TOKEN } from 'src/modules/players/utils/loginsServiceToken';
import { ILoginsRepositories } from '../domain/repositories/ILogins.repositories';
import { Login } from '@prisma/client';

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
