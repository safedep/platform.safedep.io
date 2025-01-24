# SafeDep Platform Frontend

## Development

### Prerequisites

> Note: You can skip `ASDF` setup if you already have the required
> version of `nodejs` installed on your system. Look at `.tool-versions` file
> to see the required version and other required tools.

- [ASDF](https://asdf-vm.com/guide/getting-started.html)
- Install the required version of `nodejs` using `asdf`:

```shell
asdf install
```

### Setup

- Configure `buf` schema registry

```shell
pnpm config set @buf:registry https://buf.build/gen/npm/v1/
```

- Install `npm` dependencies:

```shell
pnpm install
```

### Configuration

- Create `.env.local` file based on `env.local.sample` (example)
- Update `.env.local` with the appropriate values

> Note: For SafeDep Team members, ask for development credentials in Slack

### Running the development server

- Start the development server:

```shell
pnpm dev
```

- Navigate to `http://localhost:3000` in your browser.

### Testing

- Run the test suite:

```shell
pnpm test
```

### Framework Documentation

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize [Geist](https://vercel.com/font), a new font family for Vercel.
