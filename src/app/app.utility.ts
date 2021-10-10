/**
 * Copyright (c) 2021 President and Fellows of Harvard College
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Logger, LogLevel, NestApplicationOptions } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';

interface AppConfig {
  logger: LogLevel[];
  sslKeyPath?: string;
  sslCertPath?: string;
}

const appOptions = (config: AppConfig): NestApplicationOptions => {
  const haveKey = existsSync(config.sslKeyPath);
  const haveCert = existsSync(config.sslCertPath);

  let options: NestApplicationOptions = {
    logger: config.logger,
  };

  if (haveKey && haveCert) {
    options = {
      ...options,
      httpsOptions: {
        key: readFileSync(config.sslKeyPath),
        cert: readFileSync(config.sslCertPath),
      },
    };
  } else {
    if (!haveKey) {
      Logger.warn(`Key ${config.sslKeyPath} not found`);
    }
    if (!haveCert) {
      Logger.warn(`Cert ${config.sslCertPath} not found`);
    }
    Logger.warn(`Not using HTTPS`);
  }

  return options;
};

export { appOptions, AppConfig };
