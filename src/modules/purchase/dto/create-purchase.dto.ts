import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { PaymentMethod } from 'shared/interfaces/paymentMethod.enum';
import { ShippingMethod } from 'shared/interfaces/shippingMethod.enum';

const validShares = [1, 3, 6, 12, 18, 24, 30, 36];

export class CreatePurchaseDto {
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  @ApiProperty({ description: 'Métodos de pago' })
  public readonly paymentMethod: PaymentMethod;

  @IsDefined()
  @IsNotEmpty()
  @IsEnum(ShippingMethod)
  @ApiProperty({ description: 'Métodos de envío' })
  public readonly shippingMethod: ShippingMethod;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Direccion de envio' })
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Ciudad de envio' })
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Pais de envio' })
  readonly country: string;

  @IsDefined()
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'Estado de financiamiento (0) de contado - (1) financiado',
  })
  public readonly financed: boolean;

  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(36)
  @ValidateIf((object, value) => validShares.includes(value))
  @ApiProperty({ description: 'Número de cuotas a financiar' })
  public readonly share: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(10000000000000000)
  @ApiProperty({ description: 'Pago Inicial de la compra' })
  public readonly initialPayment: number;
}
