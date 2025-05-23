import { Inject, Injectable } from "@nestjs/common";
import { DEPOSITS_SERVICE_TOKEN } from "../utils/depositsServiceToken";
import { IDepositsRepositories } from "../domain/repositories/IDeposits.repositories";
import { Deposit } from "@prisma/client";
import { FilterParams } from "src/shared/types/filterParams";

@Injectable()
export class FindDepositsService {
  constructor(
    @Inject(DEPOSITS_SERVICE_TOKEN)
    private readonly depositsRepositories: IDepositsRepositories,
  ) { }

  async execute(filters?: FilterParams): Promise<Deposit[]> {
    return await this.depositsRepositories.findDeposits(filters);
  }
}
