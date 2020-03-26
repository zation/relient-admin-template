#!/usr/bin/env bash

REPOSITORY=registry.cn-hangzhou.aliyuncs.com/boda/admin
CI_BUILD_TAG=${1:-latest}
ENV=${2:-production}
CONTAINER=boda-admin

yarn
NODE_ENV=production npm run build
docker build -t ${REPOSITORY}:${CI_BUILD_TAG} .
docker push ${REPOSITORY}:${CI_BUILD_TAG}
# docker stop ${CONTAINER}
# docker rm ${CONTAINER}
# docker run -e NODE_ENV=${ENV} --name ${CONTAINER} -d -p 3100:3100 --restart always ${REPOSITORY}:${CI_BUILD_TAG}
git tag ${CI_BUILD_TAG}
git push origin --tags
