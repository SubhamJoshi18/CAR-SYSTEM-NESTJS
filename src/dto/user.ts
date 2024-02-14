import { Expose } from 'class-transformer';
export class UserTdo {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
