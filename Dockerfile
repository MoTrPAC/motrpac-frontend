# create-react-app build environment
FROM node:16-alpine as react-build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN yarn
COPY . ./
RUN yarn sass
RUN yarn build

# nginx server environment
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template
ENV PORT 80
ENV HOST 0.0.0.0
RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
