import axios from 'axios';
import CryptoJS from 'crypto-js';

const BASE = 'https://api-sg.aliexpress.com';
const KEY = process.env.AE_APP_KEY as string;
const SECRET = process.env.AE_APP_SECRET as string;
const PID = process.env.AE_PID as string;

if (!KEY || !SECRET || !PID) {
  throw new Error('Missing AliExpress env vars');
}

/** Build signature per AliExpress doc */
function sign(params: Record<string, any>): string {
  const sortedKeys = Object.keys(params).sort();
  const raw = sortedKeys.map((k) => `${k}${params[k]}`).join('');
  return CryptoJS.HmacSHA256(SECRET + raw + SECRET, SECRET)
    .toString()
    .toUpperCase();
}

/** Generate affiliate deeplink for a given product URL */
export async function generateLink(url: string) {
  const timestamp = Date.now();
  const params: Record<string, any> = {
    method: 'aliexpress.affiliate.link.generate',
    app_key: KEY,
    timestamp,
    format: 'json',
    v: '2.0',
    pid: PID,
    promotion_link_type: 1,
    source_values: url,
  };
  params.sign = sign(params);

  const { data } = await axios.get(
    `${BASE}/openapi/param2/2/portals.open/api.list`,
    { params }
  );

  if (
    data?.resp_result?.result?.promotion_urls &&
    data.resp_result.result.promotion_urls.length > 0
  ) {
    return data.resp_result.result.promotion_urls[0].url as string;
  }

  if (data?.result?.promotion_urls && data.result.promotion_urls.length > 0) {
    return data.result.promotion_urls[0].url as string;
  }

  throw new Error('No link returned from AliExpress');
}
