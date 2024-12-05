import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

// export Auth0's default handleAuth with custom action for
// sign-up to render the sign-up screen by default
export const GET = handleAuth({
  signup: handleLogin({
    authorizationParams: {
      screen_hint: 'signup'
    },
  }),
  login: handleLogin({
    authorizationParams: {
      scope: 'openid profile email offline_access',
    },
  }),
})
