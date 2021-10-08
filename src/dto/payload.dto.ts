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

class ValidatePayloadDto {
  @ApiProperty({
    description: 'Secure source folder',
  })
  folder: string;

  @ApiProperty({
    description: 'File checksum',
  })
  checksum: string;

  @ApiProperty({
    description: 'Filename as subject',
  })
  sub: string;

  @ApiProperty({
    description: 'Granted authority scope',
  })
  scope: string;
}

class EncryptPayloadDto extends ValidatePayloadDto {
  @ApiProperty({
    description: 'Verify encryption',
  })
  verify: boolean;
}

class DecryptPayloadDto extends ValidatePayloadDto {
  @ApiProperty({
    description: 'Decrypted destination',
  })
  destination: string;

  @ApiProperty({
    description: 'Verify encryption',
  })
  verify: boolean;
}

export { ValidatePayloadDto, EncryptPayloadDto, DecryptPayloadDto };
