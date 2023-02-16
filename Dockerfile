FROM node:16
# Set working directory
WORKDIR /app
# Copy all files from current directory to working dir in image
COPY . .

ENV NODE_ENV production

# install node modules and build assets
RUN npm install 
# RUN npm run build

CMD [ "npm", "start" ]