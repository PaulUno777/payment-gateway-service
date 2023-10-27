import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CallbackService {
  private readonly logger = new Logger(CallbackService.name);

  mtnDisbursementCallback(callbackRespnse: any) {
    this.logger.log('= = =>[ receive MTN disbursement callback ] <= = =');
    console.log('callbackRespnse', callbackRespnse);
  }

  mtnCollectionCallback(callbackRespnse: any) {
    this.logger.log('= = =>[ receive MTN collection callback ] <= = =');
    console.log('callbackRespnse', callbackRespnse);
  }

  orangeDisbursementCallback(callbackRespnse: any) {
    this.logger.log('= = =>[ receive Orange disbursement callback ] <= = =');
    console.log('callbackRespnse', callbackRespnse);
  }

  orangeCollectionCallback(callbackRespnse: any) {
    this.logger.log('= = =>[ receive Orange collection callback ] <= = =');
    console.log('callbackRespnse', callbackRespnse);
  }
}
