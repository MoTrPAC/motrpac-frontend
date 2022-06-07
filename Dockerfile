# create-react-app build environment
FROM node:14-alpine as react-build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn sass && yarn build

# nginx server environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template

COPY --from=react-build /app/build /usr/share/nginx/html

LABEL org.opencontainers.image.description="MoTrPAC Data Portal Docker Image"
LABEL org.opencontainers.image.documentation="https://github.com/MoTrPAC/motrpac-frontend"
LABEL org.opencontainers.image.title="MoTrPAC Data Portal Web Client Server"
LABEL org.opencontainers.image.url="https://motrpac-data.org"
LABEL org.opencontainers.image.vendor="MoTrPAC"
LABEL org.opencontainers.image.version=$IMAGE_VERSION

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
