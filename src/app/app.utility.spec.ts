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

import { appOptions } from './app.utility';
import { mkdirSync, rmdirSync, writeFileSync } from 'fs';

const key = `-----BEGIN PRIVATE KEY-----
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
djegGtCFQ0Y5w9ixK97h8FWiphbtHDw=
-----END PRIVATE KEY-----`;

const cert = `-----BEGIN CERTIFICATE-----
MIIFtzCCA5+gAwIBAgIUIztqAgp9Y11FB+1CjF6uqkylQbAwDQYJKoZIhvcNAQEL
BQAwezELMAkGA1UEBhMCVVMxFjAUBgNVBAgMDU1hc3NhY2h1c2V0dHMxEjAQBgNV
BAcMCUNhbWJyaWRnZTEkMCIGA1UECgwbTGlicmFyeSBUZWNobm9sb2d5IFNlcnZp
Y2VzMRowGAYDVQQDDBEqLmxpYi5oYXJ2YXJkLmVkdTAeFw0yMTEwMTAxNjExMzla
Fw0zMTEwMDgxNjExMzlaMHsxCzAJBgNVBAYTAlVTMRYwFAYDVQQIDA1NYXNzYWNo
dXNldHRzMRIwEAYDVQQHDAlDYW1icmlkZ2UxJDAiBgNVBAoMG0xpYnJhcnkgVGVj
aG5vbG9neSBTZXJ2aWNlczEaMBgGA1UEAwwRKi5saWIuaGFydmFyZC5lZHUwggIi
MA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDzNhEfMSStmFXkINWVHUUY0/O8
W13tCiSSUN8Aks2mWs5DKE2Rth5JIlCIuWJZmTI++l3ukO0m6drCi/qGt7gYl0Vd
W57/SFq02aoYyPEd3YfSI6SQ1m6yaN8nAz/4wGCSkYr4j3OdZcw6JKiT8gpHDgj6
21dqAgmguCpLOqSweENlmNRnPTP0JpFReyTPUo/NGZ9Kt2rAjcEkeoiHh3SPbbGb
vbGkUFxPk4K99CmcWpTcpqMVfu7ZSW4n8S+AfSoOFhK4xWctf2xrhALhndPZUFl7
M6JTeTMXeuOW3pI/23s4gi/zhuFmbBpto43pm9qFP6fjCHEXibrHwjL6rTSRLqNZ
YyUF1hKkvaXJTvMB0Gu2/cZgbZROtF3khiD2EWCsa3/oHS5Ln0q+1sEk9DlNQh04
0+ezyfZixwAyXQirKQ8GDZN9nSNQMTXWz/DzbBeERpAJWmHj29lZ6Oma8rJy8z8V
3xRQJopPRpI0jrGHvvkW5p7mtDqqtwhm8Wmh+tAlVvNfanPLEsHP9M9dUJ+ZoWhT
B5GLTqa/Jbdbhfde/CLTZ2pvAF+QFG/rztp0kvGFtbTUUKvmymMO8Ea0cEHO2S+E
ybHKAu7/Bzaw/hf4DMMpHTiMINCG/msrraDEf7iFOgRP2ZjzH2hL/hxWxCHcvZXW
4hjjRQX0VaGrSKMc8wIDAQABozMwMTAvBgNVHREEKDAmghEqLmh1bC5oYXJ2YXJk
LmVkdYIRKi5sdHMuaGFydmFyZC5lZHUwDQYJKoZIhvcNAQELBQADggIBANpsXzrJ
5x0pPzv1AgOHsnT0CTDddDh21C0SGbOHuh3tjN54PpISoMWw+Z4UcJHhTvwi/LGv
JS0kVqZ9ZD4VPMOkhK7mILW4XcP6YKDlsYI/hXYGQsJMz4X4h3RjMmWNGZbwbUEs
iyl5hFX2mAqBUorkJlNTjvEHk8T3BDOKjon9iCxxsyoaSd90VWyLdAgtnC3F04pR
O1QpLIzfI50pzuBQPlxl0ZjmclGLoAf4v+RwmzUUn4CmEP9C8xuRBgIsOo7y3isl
1FDh2D2IWgTh5ZefI6Gf5udxaGH0dPZ6wkRtKHvhD+fAmbTRA1ZQ+1hSEov6iGOi
HTrtBAVllZbOTZ5qnODtsLqFSNk9VCYayiViAbHArk6r0/m7vdhX+b+tKguagBOc
bw8pQP3pxExd2F8XVEQ6kLN6qH0TsK87pELnjNi2psSLZHTgOUTuOPyJjiNXRqS6
84BHrH8Jf2pQaq+X5FBm97C3uIvo1YvfFWnC5TBvfBMSZItdc6Y9a0GNWQr1Hv7g
ZOAniWmC0x+UZh9HPPYFsTrMZHSPiSJwapDk/D6oWaclBXqDUfM5cp22ojczlWLd
O0EhQAAuIxU2l4Eof6VWfBaR1NdpTEXkuwu8asZgDk4f4GcUjD9RSYzgKCnxRw7H
OFnLTNK8Fw0YszsGb7Og9dUxDZc7BRK6Leav
-----END CERTIFICATE-----`;

describe('AppUtility', () => {
  describe('appOptions', () => {
    beforeAll(async () => {
      mkdirSync('test');
    });

    afterAll(async () => {
      rmdirSync('test', { recursive: true });
    });

    it('should create appOptions without httpsOptions', async () => {
      const options = appOptions({
        logger: ['log', 'warn', 'debug'],
      });

      expect(options).toBeDefined();
      expect(options.logger).toEqual(['log', 'warn', 'debug']);
      expect(options.httpsOptions).toBeUndefined();
    });

    it('should create appOptions with httpsOptions', async () => {
      writeFileSync('test/server.key', key, 'utf8');
      writeFileSync('test/server.crt', cert, 'utf8');

      const options = appOptions({
        logger: ['log', 'warn', 'debug'],
        sslKeyPath: 'test/server.key',
        sslCertPath: 'test/server.crt',
      });

      expect(options).toBeDefined();
      expect(options.logger).toEqual(['log', 'warn', 'debug']);
      expect(options.httpsOptions.key.toString()).toEqual(key);
      expect(options.httpsOptions.cert.toString()).toEqual(cert);
    });
  });
});
