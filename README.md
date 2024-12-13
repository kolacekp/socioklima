# Socioklima

Webová aplikace Socioklima pro vzdělávací zařízení

# Development

- instalace zavislosti

```bash
yarn
```

- nastaveni env variables v `.env` souboru

```bash
APP_URL="http://localhost:3000"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=

APP_INSIGHTS_CONNECTION_STRING=
OTEL_SERVICE_NAME=

POSTGRES_DATABASE=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_PRISMA_URL=
POSTGRES_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=

SMTP_HOST=
SMTP_PASSWORD=
SMTP_PORT=
SMTP_SENDER=
SMTP_TLS=
SMTP_USERNAME=
```

- nastaveni databazovych migraci

```bash
npx prisma migrate dev
```

- seed databaze

```bash
npx prisma db seed
```

- spusteni

```bash
yarn dev
```
