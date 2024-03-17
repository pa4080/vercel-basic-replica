# Vercel Simple Replica

This is an TypeScript/Node exercise. The goal of the project is to reproduce the basic functionality of Vercel:

1. Upload service,
2. Deploy service,
3. Request handler (serve) service.

## References

- [Code along Vercel - I built Vercel in 4 Hours (System Design, AWS, Redis, S3) by Harkirat Singh at YouTube \*this is the main tutorial of this exercise](https://youtu.be/c8_tafixiAs?si=WI9AJLQdzQZO0r3X)
- [Code along Vercel - Daily code by Harkirat Singh at his Learning Paths site](https://projects.100xdevs.com/tracks/ZSQI8YNE0iL6sT1hJpts/vercel-1)
- [Code along Vercel - repo by Harkirat Singh at GitHub](https://projects.100xdevs.com/tracks/ZSQI8YNE0iL6sT1hJpts/vercel-1)

## Daily code

### Init the project

- _`pnpm` is used for the project init and package management_

```bash
mkdir -p vercel-simple-replica
cd vercel-simple-replica
git init
pnpm init
pnpm --package=typescript dlx tsc --init
```

- Tweak the [`tsconfig.json`](tsconfig.json) file - create the necessary directories `mkdir -p dist src` .
- Add few dependencies, for more details see the [package.json](package.json) file.
- Setup the linting and staging tools.

### Coding the upload server

- See [`src/index.ts`](src/index.ts) for the app logic.
- [Code along Vercel steps - Upload service](https://projects.100xdevs.com/tracks/ZSQI8YNE0iL6sT1hJpts/vercel-1)
- [Coding the upload server at YouTube](https://www.youtube.com/watch?v=c8_tafixiAs&t=1507s)
- [NPM: `simple-git`](https://www.npmjs.com/package/simple-git)
- [NPM: `nodemon`](https://www.npmjs.com/package/nodemon)
- [Setup `nodemon` and `ts-node` example](https://khalilstemmler.com/blogs/typescript/node-starter-project/#Cold-reloading)

### Node (TS) CLI hints

Run a TS file:

```bash
pnpm exec ts-node --skip-project src/utils/random.ts
```

Run a function from a file:

```bash
pnpm exec ts-node --skip-project -e 'require("./src/utils/random.ts").generateId()'
```

### Setup ProcessEnv and Zod

- [Validate Environment Variables With Zod article by Catalin Pit](https://catalins.tech/validate-environment-variables-with-zod/)
- [You're typing process.env wrong at YouTube by Matt Pocock](https://www.youtube.com/watch?v=q1im-hMlKhM)
- [DON'T USE Environment Variables Without This at YouTube by James Q Quick](https://www.youtube.com/watch?v=dCzNA9nUxuo)

### Setup CloudFlare R2

- Login to CloudFlare: <https://cloudflare.net/>
- Go to `Workers & Pages` > `R2` (They provides 10GB/month for free)...
  - [Cloudflare API Docs](https://developers.cloudflare.com/api/)
  - [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- Activate the `R2` option
- Create a new bucket - i.e. `vercel-simple-replica`
- Integrate the R2 bucket with our upload server [@see the relevant section of the main tutorial](https://youtu.be/c8_tafixiAs?si=5UkwO9I-ZtrtnqkL&t=3582)
  - Copy your `Account ID` and create envvar `CLOUDFLARE_ACCOUNT_ID`,
  - Go to _Manage R2 API Tokens_ and:
    - Create a new API Token - for example name it `vercel-simple-replica-token` with _Permissions_ `Object Read & Write` and specify the bucket - `vercel-simple-replica`.
    - Create the env-vars related to the new token - `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_API_ACCESS_KEY_ID`, `CLOUDFLARE_API_ACCESS_KEY_SECRET`, `CLOUDFLARE_API_ENDPOINT`.
