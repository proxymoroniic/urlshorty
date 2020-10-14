# URL Shortener Service

> API to create short urls using Node, Express,MongoDB and using Redis as cache

## Quick Start

```bash
git install 
npm install
```
Add your mongodb url and your domain as uri else leave it as localhost

```bash
# Run
npm start
```

## Docker 
 
 add 'mongodb://mongo:27017/docker-node-mongo' as mongo uri
```bash
docker-compose up
```

## Endpoint to create short url

### POST api/url/shorten

{ "longUrl": "xxxx" }
