FROM node:lts as builder
# change working directory
WORKDIR /service-builder
# copy only necessary files for dependencies install
COPY package.json yarn.lock .env.example .
# install dependencies
RUN yarn install --frozen-lockfile
# copy project files
COPY . .
# build service
RUN yarn build

FROM node:lts as runner
# change working directory
WORKDIR /service-runner
# copy build output
COPY --from=builder /service-builder/dist .
# install production dependencies
RUN yarn install --production
# start server
CMD ["node", "."]
