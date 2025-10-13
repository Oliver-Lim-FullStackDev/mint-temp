import { Controller, Get } from '@nestjs/common';
import { ReceiptsResponseDto } from './receipts.dto';
import { ReceiptsService } from './receipts.service';

@Controller('transaction/receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Get()
  async getReceipts(): Promise<ReceiptsResponseDto> {
    const result = await this.receiptsService.getUserReceipts();
    return result;
  }
}
