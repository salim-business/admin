FROM node:14
# Set working directory
WORKDIR /app
# Copy all files from current directory to working dir in image
COPY . .

ENV NODE_ENV production

# install node modules and build assets
RUN yarn install 
RUN yarn run build:release

CMD [ "yarn", "start" ]