# SafeDep Platform Frontend

## Development

### Prerequisites

- [ASDF](https://asdf-vm.com/guide/getting-started.html)

### Setup

- Install the required version of `nodejs` using `asdf`:

```shell
asdf install
```

- Install `npm` dependencies:

```shell
npm install
```
### Auth0 Configuration
- Before running the project, ensure that you have set up the Auth0 configuration in the .env.local file.

- Create a .env.local file in the root of the project.
- Add your Auth0 credentials, which can be found in the Auth0 documentation, into the .env.local file.
- Example .env.local:

```
NEXT_PUBLIC_AUTH0_DOMAIN=your-auth0-domain
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-auth0-client-id
NEXT_PUBLIC_AUTH0_REDIRECT_URI=http://localhost:3000/api/auth/callback
NEXT_PUBLIC_AUTH0_SCOPE="openid profile email"
NEXT_PUBLIC_AUTH0_AUDIENCE=your-auth0-audience
```
- Make sure to replace your-auth0-domain, your-auth0-client-id, and your-auth0-audience with the actual values from your Auth0 account.

### Running the development server

- Start the development server:

```shell
npm run dev
```

- Navigate to `http://localhost:3000` in your browser.

### Testing

- Run the test suite:

```shell
npm run test
```

### Framework Documentation

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize [Geist](https://vercel.com/font), a new font family for Vercel.
