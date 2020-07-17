FROM node:13.14-alpine

RUN set -x \
    && chmod 775 /usr/local/bin/* \
    && chmod +x /usr/local/bin/*.sh \
    && mkdir /server

WORKDIR /server
COPY . /

EXPOSE 8080

RUN apk add --no-cache git

RUN npm install

RUN npm install -g http-server

CMD npm run look-report
