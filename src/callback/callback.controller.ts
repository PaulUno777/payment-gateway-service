import { Controller, Post, Body } from '@nestjs/common';
import { CallbackService } from './callback.service';
import { IsPublic } from '@app/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@IsPublic()
@ApiTags('Callbacks')
@Controller('callback')
export class CallbackController {
  constructor(private readonly callbackService: CallbackService) {}

  @ApiOperation({ summary: 'Receive OM Collection callbacks' })
  @Post('om/collection')
  orangeCollectionCallback(@Body() callbackRespnse) {
    return this.callbackService.orangeCollectionCallback(callbackRespnse);
  }

  @ApiOperation({ summary: 'Receive OM disbursement callbacks' })
  @Post('om/disbursement')
  orangeDisbursementCallback(@Body() callbackRespnse) {
    return this.callbackService.orangeDisbursementCallback(callbackRespnse);
  }

  @ApiOperation({ summary: 'Receive MOMO Collection callbacks' })
  @Post('momo/collection')
  mtnCollectionCallback(@Body() callbackRespnse) {
    return this.callbackService.mtnCollectionCallback(callbackRespnse);
  }

  @ApiOperation({ summary: 'Receive MOMO disbursement callbacks' })
  @Post('momo/disbursement')
  mtnDisbursementCallback(@Body() callbackRespnse) {
    return this.callbackService.mtnDisbursementCallback(callbackRespnse);
  }
}
