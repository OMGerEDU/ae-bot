// lib/aliexpress.ts
import axios from 'axios';
import { createHmac } from 'crypto';

const BASE   = 'https://api-sg.aliexpress.com';
const KEY    = process.env.AE_APP_KEY as string;
const SECRET = process.env.AE_APP_SECRET as string;
const PID    = process.env.AE_PID as string;

if (!KEY || !SECRET || !PID) {
  throw new Error('Missing AliExpress env vars');
}

/** Build the HMAC-SHA256 signature per AliExpress docs */
function sign(params: Record<string, any>): string {
  const sorted = Object.keys(params).sort();
  const raw    = sorted.map(k => `${k}${params[k]}`).join('');
  return createHmac('sha256', SECRET)
      .update(SECRET + raw + SECRET)
      .digest('hex')
      .toUpperCase();
}

/** Generate a PID-tagged deeplink for any AliExpress product URL */
export async function generateLink(url: string) {
  const timestamp = Date.now();
  const p: Record<string, any> = {
    method: 'aliexpress.affiliate.link.generate',
    app_key: KEY,
    timestamp,
    format: 'json',
    v: '2.0',
    pid: PID,
    promotion_link_type: 1,
    source_values: url,
  };
  p.sign = sign(p);

  const { data } = await axios.get(
      `${BASE}/openapi/param2/2/portals.open/api.list`,
      { params: p },
  );

  // Compatibility with both resp_result and result wrappers
  const arr =
      data?.resp_result?.result?.promotion_urls ??
      data?.result?.promotion_urls ??
      [];

  if (arr.length > 0) return arr[0].url as string;
  throw new Error('AliExpress did not return a link');
}
