type SameSiteOption = 'lax' | 'strict' | 'none';

const normalizeSameSite = (value?: string): SameSiteOption => {
  const normalized = (value || '').toLowerCase();
  if (normalized === 'strict' || normalized === 'none') return normalized;
  return 'lax';
};

export const getAuthCookieOptions = (request: Request) => {
  const sameSite = normalizeSameSite(process.env.COOKIE_SAME_SITE);
  const isHttpsRequest =
    request.headers.get('x-forwarded-proto') === 'https' ||
    new URL(request.url).protocol === 'https:';

  const secure =
    process.env.COOKIE_SECURE === 'true' ||
    (process.env.COOKIE_SECURE !== 'false' && sameSite === 'none') ||
    (process.env.COOKIE_SECURE !== 'false' && isHttpsRequest);

  return {
    httpOnly: true,
    sameSite,
    secure,
    path: '/',
  } as const;
};