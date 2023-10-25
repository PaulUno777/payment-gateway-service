import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { DefaultConfiguration } from './entities/configuration.entity';

@Injectable()
export class ConfigurationService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ConfigurationService.name);
  private readonly configFilePath = 'config/config.json';
  private config: DefaultConfiguration;

  constructor() {
    if (!existsSync('config')) {
      mkdirSync('config');
    }
    writeFileSync(
      this.configFilePath,
      JSON.stringify(new DefaultConfiguration()),
      'utf8',
    );
  }
  onApplicationBootstrap() {
    this.config = JSON.parse(readFileSync(this.configFilePath, 'utf8'));
  }

  getConfig() {
    return this.config;
  }

  setConfig(newConfig) {
    this.config = newConfig;
    writeFileSync(this.configFilePath, JSON.stringify(this.config), 'utf8');
  }
}
