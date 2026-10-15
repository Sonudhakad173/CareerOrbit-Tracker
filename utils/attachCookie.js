const getAuthCookieOptions = () => {
  const crossOriginFrontend = Boolean(process.env.CLIENT_ORIGIN);

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || crossOriginFrontend,
    sameSite: crossOriginFrontend ? 'none' : 'lax',
    path: '/',
  };
};

const attachCookie = ({ res, token }) => {
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    ...getAuthCookieOptions(),
    expires: new Date(Date.now() + oneDay),
  });
};

export { getAuthCookieOptions };
export default attachCookie;
