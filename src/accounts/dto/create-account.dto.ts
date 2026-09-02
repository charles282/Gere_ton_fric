import { IsIn, IsInt, IsOptional, IsString, Length, MinLength } from 'class-validator';

const ACCOUNT_TYPES = ['checking', 'savings', 'cash', 'credit_card', 'investment', 'other'] as const;

export class CreateAccountDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsIn(ACCOUNT_TYPES)
  type!: (typeof ACCOUNT_TYPES)[number];

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @IsOptional()
  @IsInt()
  balanceCents?: number;
}
