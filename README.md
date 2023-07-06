This is the repo for a project I'm working on named Queued. The idea is to create a web app where users vote on songs to determine their position in the Queue. The Queue is a weekly playlist that users can listen to. 

- UI Components using [shadcn/ui](https://ui.shadcn.com) - which is built on top of [Radix UI](https://radix-ui.com) & [Tailwind CSS](https://tailwindcss.com)
- Full-Stack CRUD example with tRPC mutations (protected routes) using the UI components together with [react-hook-form](https://react-hook-form.com).
- E2E Testing using [Playwright](https://playwright.dev)
- Integration tests using [Vitest](https://vitest.dev).
- Docker Compose setup for local database (but I'll be using planetscale mysql or railway postgres instance)
- [`@next/font`] for optimized fonts

## Getting Started

1. Install deps

```bash
pnpm install
```

2. Start the db

```bash
docker compose up -d
```

3. Update env and push the schema to the db

```bash
cp .env.example .env
pnpm prisma db push
```

4. Start the dev server

```bash
pnpm dev
```

5. Run the tests

```bash
pnpm test
```

---
