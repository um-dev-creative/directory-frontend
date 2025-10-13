# syntax=docker/dockerfile:1
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
#COPY --from=build /usr/src/app/server ./server
#COPY --from=build /usr/src/app/server.js ./server.js
COPY --from=build /usr/src/app/. ./.
# Copy entrypoint and make it executable
COPY docker-entrypoint.sh /usr/src/app/docker-entrypoint.sh
RUN chmod +x /usr/src/app/docker-entrypoint.sh && mkdir -p /usr/src/app/ && chown node:node /usr/src/app/

# Set environment variables (can be overridden at runtime)
ENV NODE_ENV=production \
    ENVM=production \
    PORT=7001 \
    DEBUG_MODE=false
# Note: Provide VAULT_TOKEN and VAULT_PATH at runtime via envs.

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 7001

# Run the application (shell form so envs expand at runtime).
# - Uses defaults for PORT and keeps NODE_ENV/ENVM defaults.
# - Passes Vault flags only when the variables are set.
ENTRYPOINT ["sh", "/usr/src/app/docker-entrypoint.sh"]
