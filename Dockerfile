# Refs:
# > https://docs.doppler.com/docs/docker-compose#option-1-dockerfile
# > https://hub.docker.com/layers/library/node/20-alpine/images/sha256-e18f74fc454fddd8bf66f5c632dfc78a32d8c2737d1ba4e028ee60cfc6f95a9b?context=explore
# > https://stackoverflow.com/questions/68650325/how-to-pnpm-and-next-js-in-multi-stage-docker-file

FROM node:20-alpine

EXPOSE 3001

# Install Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub && \
	echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories && \
	apk add doppler

# Install pnpm
RUN npm install -g pnpm

# Insatll Redis, for manual test the connection
#RUN apk add --update redis

# Insatll Git
#RUN apk add git

# Copy the application code and install the dependencies
WORKDIR /app
COPY . .

RUN pnpm docker:install

# Fetch and view secrets using "printenv". Testing purposes only!
# Replace "printenv" with the command used to start your app, e.g. "npm", "start"
CMD ["doppler", "run", "--", "pnpm", "docker:run"]


