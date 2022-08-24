import { PartialType } from '@nestjs/swagger';
import { CreateBankWithdrawDto } from './create-bank-withdraw.dto';

export class UpdateBankWithdrawDto extends PartialType(CreateBankWithdrawDto) {}
