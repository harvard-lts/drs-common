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

import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmdirSync,
  writeFileSync,
} from 'fs';
import {
  checksum,
  ChecksumAlgorithm,
  decrypt,
  encrypt,
  generate,
} from './crypto.utility';

describe('CryptoUtility', () => {
  beforeEach(async () => {
    mkdirSync('test');
  });

  afterEach(async () => {
    rmdirSync('test', { recursive: true });
  });

  describe('checksum', () => {
    it('should perform md5 checksum on file', async () => {
      writeFileSync('test/test.txt', 'Hello, World!', 'utf-8');
      const md5 = await checksum('test/test.txt');
      expect(md5).toEqual('md5:65a8e27d8879283831b664bd8b7f0ad4');
    });

    it('should perform sha1 checksum on file', async () => {
      writeFileSync('test/test.txt', 'Hello, World!', 'utf-8');
      const sha1 = await checksum('test/test.txt', ChecksumAlgorithm.sha1);
      expect(sha1).toEqual('sha1:0a0a9f2a6772942557ab5355d76af442f8f65e01');
    });

    it('should perform sha256 checksum on file', async () => {
      writeFileSync('test/test.txt', 'Hello, World!', 'utf-8');
      const sha256 = await checksum('test/test.txt', ChecksumAlgorithm.sha256);
      expect(sha256).toEqual(
        'sha256:dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f',
      );
    });

    it('should perform sha512 checksum on file', async () => {
      writeFileSync('test/test.txt', 'Hello, World!', 'utf-8');
      const sha512 = await checksum('test/test.txt', ChecksumAlgorithm.sha512);
      expect(sha512).toEqual(
        'sha512:374d794a95cdcfd8b35993185fef9ba368f160d8daf432d08ba9f1ed1e5abe6cc69291e0fa2fe0006a52570ef18c19def4e617c33ce52ef0a6e5fbe318cb0387',
      );
    });
  });

  describe('generate', () => {
    it('should generate armored keys', async () => {
      const { publicKey, privateKey } = await generate({
        type: 'rsa',
        rsaBits: 2048,
        format: 'armored',
        userIDs: [{ name: 'Bob Boring', email: 'bboring@mailinator.com' }],
        passphrase: 'super long and hard to guess secret',
      });
      expect(publicKey).toBeDefined();
      expect(privateKey).toBeDefined();
    });
  });

  describe('encrypt', () => {
    it('should encrypt a file', async () => {
      const { publicKey } = await generate({
        type: 'rsa',
        rsaBits: 2048,
        format: 'armored',
        userIDs: [{ name: 'Bob Boring', email: 'bboring@mailinator.com' }],
        passphrase: 'super long and hard to guess secret',
      });

      writeFileSync('test/test.txt', 'Hello, World!', 'utf-8');

      await encrypt({
        origin: 'test/test.txt',
        destination: 'test/test.txt.gpg',
        publicArmoredKeys: [publicKey],
      });

      expect(existsSync('test/test.txt.gpg')).toBeTruthy();
    });
  });

  describe('decrypt', () => {
    it('should decrypt a file', async () => {
      const { publicKey, privateKey } = await generate({
        type: 'rsa',
        rsaBits: 2048,
        format: 'armored',
        userIDs: [{ name: 'Bob Boring', email: 'bboring@mailinator.com' }],
        passphrase: 'super long and hard to guess secret',
      });

      writeFileSync('test/test.txt', 'Hello, World!', 'utf-8');

      await encrypt({
        origin: 'test/test.txt',
        destination: 'test/test.txt.gpg',
        publicArmoredKeys: [publicKey],
      });

      expect(existsSync('test/test.txt.gpg')).toBeTruthy();

      await decrypt({
        origin: 'test/test.txt.gpg',
        destination: 'test/decrypted.txt',
        privateArmoredKeys: [
          {
            key: privateKey,
            passphrase: 'super long and hard to guess secret',
          },
        ],
      });

      expect(existsSync('test/decrypted.txt')).toBeTruthy();

      expect(readFileSync('test/decrypted.txt').toString()).toEqual(
        readFileSync('test/test.txt').toString(),
      );
    });
  });
});
