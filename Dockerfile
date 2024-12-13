FROM node:20-alpine
RUN apk add --no-cache graphviz
WORKDIR /app

ENV HOSTNAME 0.0.0.0
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV PORT 3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next && chown nextjs:nodejs .next
COPY --chown=nextjs:nodejs /.next/standalone ./
COPY --chown=nextjs:nodejs /.next/static ./.next/static
COPY --chown=nextjs:nodejs /prisma ./prisma
COPY --chown=nextjs:nodejs /public ./public

USER nextjs
EXPOSE ${PORT}
CMD HOSTNAME="${HOSTNAME}" node server.js