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

import { ApiProperty } from '@nestjs/swagger';
import { ProcessAction } from '../crypto';

type Checksums = { [filename: string]: string };

interface Process {
  action: ProcessAction;
  folder: string;
}

interface ValidateJob {
  process: Process;
  checksums: Checksums;
  verified: boolean;
}

type EncryptJob = ValidateJob;

interface DecryptJob extends ValidateJob {
  destination: string;
}

class ProcessDto implements Process {
  @ApiProperty({
    description: 'Process action',
  })
  action: ProcessAction;

  @ApiProperty({
    description: 'Secure source folder',
  })
  folder: string;
}

class ValidateJobDto implements ValidateJob {
  @ApiProperty({
    description: 'Job process',
  })
  process: ProcessDto;

  @ApiProperty({
    description: 'Processed file checksums',
  })
  checksums: Checksums;

  @ApiProperty({
    description: 'Whether process was verified',
  })
  verified: boolean;
}

class EncryptJobDto extends ValidateJobDto implements EncryptJob {}

class DecryptJobDto extends ValidateJobDto implements DecryptJob {
  @ApiProperty({
    description: 'Decrypt destination',
  })
  destination: string;
}

export {
  Checksums,
  DecryptJob,
  DecryptJobDto,
  EncryptJob,
  EncryptJobDto,
  Process,
  ProcessDto,
  ValidateJob,
  ValidateJobDto,
};
