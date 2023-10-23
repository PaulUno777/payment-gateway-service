import { Module } from '@nestjs/common';
import { PhoneHelperService } from './phone-helper.service';
import { CmPhoneHelper } from './implementations/cm-phone-helper';

@Module({
  providers: [PhoneHelperService, CmPhoneHelper],
  exports: [PhoneHelperService, CmPhoneHelper],
})
export class PhoneHelperModule {}
