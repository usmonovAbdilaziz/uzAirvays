import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  BadRequestException,
  Req,
  Headers,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';
import { AdminRole } from '../Roles/roles';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AdminRole.USER, AdminRole.ADMIN, AdminRole.SUPERADMIN)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Post('webhook')
  @HttpCode(200)
  async handleStripeWebhook(
    @Req() req: any,
    @Headers('stripe-signature') sig: string,
  ) {
    if (!sig) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    // Raw body Stripe verification uchun kerak
    const rawBody = req.body;
    if (!rawBody || !(rawBody instanceof Buffer)) {
      throw new BadRequestException('Invalid raw body for webhook');
    }

    return this.paymentsService.webhook(rawBody, sig);
  }

  @Get()
  async findAll() {
    return this.paymentsService.findAll();
  }
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.paymentsService.remove(id);
  }
}
