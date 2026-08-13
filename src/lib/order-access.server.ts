/**
 * Short-lived signed passes for guest order access.
 *
 * A pass is `<orderCode>.<expiryMs>.<hmac>` (base64url signature). It is signed
 * with a server-only key, so it cannot be forged or extended by the browser,
 * and it stops working once the expiry passes.
 */

const TTL_MS = 60 * 60 * 1000; // 60 minutes

function getKey(): string {
  const key = process.env['ORDER_ACCESS_SIGNING_KEY'];
  if (!key) throw new Error('Missing ORDER_ACCESS_SIGNING_KEY');
  return key;
}

function base64url(bytes: ArrayBuffer): string {
  let s = '';
  const view = new Uint8Array(bytes);
  for (const b of view) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sign(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(getKey()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return base64url(await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(payload)));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function issueOrderPass(orderCode: string, ttlMs: number = TTL_MS): Promise<string> {
  const exp = Date.now() + ttlMs;
  const payload = `${orderCode}.${exp}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifyOrderPass(orderCode: string, pass: string): Promise<boolean> {
  const parts = pass.split('.');
  if (parts.length !== 3) return false;
  const [code, expRaw, sig] = parts as [string, string, string];
  if (code !== orderCode) return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return timingSafeEqual(sig, await sign(`${code}.${expRaw}`));
}
