export interface CouponResponseDTO {
  id: string;
  code: string;
  discount: number;
  applicableFrom: Date;
  validUntil: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Coupon {
  constructor(
    public code: string,
    public discount: number,
    public applicableFrom: Date,
    public validUntil: Date,
    public isActive: boolean,
    public id?: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
