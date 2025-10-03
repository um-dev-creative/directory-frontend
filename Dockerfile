# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

## Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7
#
ARG NODE_VERSION=22.14.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app


################################################################################
# Create a stage for installing production dependecies.
FROM base AS deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
COPY package.json .
COPY pnpm-lock.yaml .
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

################################################################################
# Create a stage for building the application.
FROM deps AS build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build. If you don't need this, remove this step.
COPY package.json .
COPY pnpm-lock.yaml .
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

ENV ENVM=dev
ENV ENV=$ENVM
# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN pnpm build:ssr

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base AS final
# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
# Copy only the server and build output (dist) from build stage
COPY --from=build /usr/src/app/server.js ./server.js
COPY --from=build /usr/src/app/. ./.
COPY --from=build /usr/src/app/server ./server

# Create uploads directory and set permissions for node user BEFORE switching user
RUN mkdir -p /usr/src/app/ && chown node:node /usr/src/app/

# Set environment variables (can be overridden at runtime)
ENV NODE_ENV=production

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 7001

# Run the application.
CMD node server.js --ssl --ssl-key ssl/backbone.key --ssl-cert ssl/backbone.crt \
  --port $PORT --configuration $ENV --vaultToken $VAULT_TOKEN \
  --vaultUrl $VAULT_URI --vaultPath $VAULT_PATH --DEBUG_MODE $IS_DEBUG_ENABLED --ENVM $ENVM
