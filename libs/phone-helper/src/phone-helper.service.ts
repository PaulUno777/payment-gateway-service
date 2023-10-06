import { IPhoneHelper } from '@app/common/interfaces';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CmPhoneHelper } from './cm-phone-helper';

@Injectable()
export class PhoneHelperService {
  private readonly logger = new Logger(PhoneHelperService.name);
  private readonly phoneHelpers: Set<IPhoneHelper>;
  constructor(private readonly cmPhoneHelper: CmPhoneHelper) {
    this.phoneHelpers = new Set([this.cmPhoneHelper]);
  }
  load(countryAlpha2: any): IPhoneHelper {
    this.logger.log('Loading phone lib...');

    for (const helper of this.phoneHelpers) {
      if (helper.applyCountry === countryAlpha2) {
        return helper;
      }
    }

    throw new NotFoundException(`Sorry helper unavaillable yet.`);
  }
}
