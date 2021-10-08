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

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as openpgp from 'openpgp';

enum ChecksumAlgorithm {
  md5 = 'md5',
  sha1 = 'sha1',
  sha256 = 'sha256',
  sha512 = 'sha512',
}

enum EncryptionType {
  rsa = 'rsa',
  ecc = 'ecc',
}

interface EncryptOptions {
  origin: string;
  destination: string;
  publicArmoredKeys: string[];
}

interface PrivateArmoredKey {
  key: string;
  passphrase: string;
}

interface DecryptOptions {
  origin: string;
  destination: string;
  privateArmoredKeys: PrivateArmoredKey[];
}

const checksum = async (
  path: string,
  algorithm: ChecksumAlgorithm = ChecksumAlgorithm.md5,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(path);
    const hash = crypto.createHash(algorithm);

    input.on('error', reject);

    input.on('data', (chunk) => {
      hash.update(chunk);
    });

    input.on('close', () => {
      const checksum = hash.digest('hex');
      resolve(normalize(checksum, algorithm));
    });
  });
};

const normalize = (
  checksum: string,
  algorithm: ChecksumAlgorithm = ChecksumAlgorithm.md5,
): string => {
  return `${algorithm}:${checksum}`;
};

const generate = async (
  options: openpgp.KeyOptions & {
    format?: 'armored';
  },
): Promise<
  openpgp.SerializedKeyPair<string> & {
    revocationCertificate: string;
  }
> => {
  return openpgp.generateKey(options);
};

const encrypt = async (options: EncryptOptions): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const keyPromises = options.publicArmoredKeys.map((armoredKey: string) =>
      openpgp.readKey({ armoredKey }),
    );
    const encryptionKeys = await Promise.all(keyPromises);

    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({
        binary: fs.createReadStream(options.origin),
      }),
      encryptionKeys,
      format: 'binary',
    });

    const destination = options.destination;

    const writeStream = fs.createWriteStream(destination);

    encrypted.pipe(writeStream);

    writeStream.on('error', (error) => {
      reject(error);
    });

    writeStream.on('close', () => {
      resolve(destination);
    });
  });
};

const decrypt = async (options: DecryptOptions): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const keyPromises = options.privateArmoredKeys.map(
      async (armoredKey: PrivateArmoredKey) =>
        openpgp.decryptKey({
          privateKey: await openpgp.readPrivateKey({
            armoredKey: armoredKey.key,
          }),
          passphrase: armoredKey.passphrase,
        }),
    );
    const decryptionKeys = await Promise.all(keyPromises);

    const decrypted = await openpgp.decrypt({
      message: await openpgp.readMessage({
        binaryMessage: fs.createReadStream(options.origin),
      }),
      decryptionKeys,
      format: 'binary',
    });

    const destination = options.destination;

    const writeStream = fs.createWriteStream(destination);

    decrypted.data.pipe(writeStream);

    writeStream.on('error', (error) => {
      reject(error);
    });

    writeStream.on('close', () => {
      resolve(destination);
    });
  });
};

export {
  checksum,
  encrypt,
  decrypt,
  generate,
  ChecksumAlgorithm,
  EncryptionType,
  EncryptOptions,
  DecryptOptions,
  PrivateArmoredKey,
};
