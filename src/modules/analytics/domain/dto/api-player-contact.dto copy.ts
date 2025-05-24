export class ApiPlayerContactDto {
  id: string;
  tenantId: string;
  country: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_blocked: boolean;
  registered_at: Date;
  modified_at: Date;
  self_excluded: boolean;
  status: string;
  ref_code: string;
  timezone: string | null;
  traffic_source: string | null;
  user_agent: string | null;
  birthday: string | null;
  city: string | null;
  gender: string | null;
  ip: string | null;
  locale: string | null;
}
