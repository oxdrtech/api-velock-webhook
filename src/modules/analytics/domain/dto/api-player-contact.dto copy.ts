export class ApiPlayerContactDto {
  player_id: string;
  tenantId: string;
  email: string;
  email_confirmed_at?: Date | null;
  modified_at: Date;
  created_at: Date;
  email_subscribe: boolean;
  phone?: string | null;
  phone_confirmed_at?: Date | null;
  phone_subscribe: boolean;
  push_token?: string | null;
}
