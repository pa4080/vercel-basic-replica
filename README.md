# Vercel Simple Replica

This is an TypeScript/Node exercise. The goal of the project is to reproduce the basic functionality of Vercel:

1. Upload service,
2. Deploy service,
3. Request handler (serve) service.

## References

- [Code along Vercel - I built Vercel in 4 Hours (System Design, AWS, Redis, S3) by Harkirat Singh at YouTube](https://youtu.be/c8_tafixiAs?si=WI9AJLQdzQZO0r3X)
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

### Create simple express app

- See [`src/index.ts`](src/index.ts) for the app logic.
