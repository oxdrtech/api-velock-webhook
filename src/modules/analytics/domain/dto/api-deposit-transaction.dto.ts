export class ApiDepositTransactionDto {
  id: string;
  player_id: string;
  tenantId: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  created_at: Date;
  dir: string;
  comment?: string;
  updated_at: Date;
  wallet_id: string;
}
