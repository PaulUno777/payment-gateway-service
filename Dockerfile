###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:18-alpine As development

# Create app directory
WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./
COPY --chown=node:node clone-proto.js ./

# Install app dependencies using the `yarn`
RUN yarn

# Bundle app source
COPY --chown=node:node . .

RUN ls -la

USER node


###################
# BUILD FOR PRODUCTION
###################
FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

#In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image  
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules


COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN yarn build
RUN ls dist

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `yarn install` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN yarn install --mode=production && yarn cache clean

RUN ls -la

USER node


###################
# PRODUCTION
###################
FROM node:18-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

RUN ls -la

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
