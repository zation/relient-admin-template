#!/usr/bin/env bash

REPOSITORY=registry.cn-hangzhou.aliyuncs.com/repo/project
CI_BUILD_TAG=${1:-latest}
ENV=${2:-production}
CONTAINER=project

yarn
NODE_ENV=production yarn build
docker build -t ${REPOSITORY}:${CI_BUILD_TAG} .
docker push ${REPOSITORY}:${CI_BUILD_TAG}
git tag ${CI_BUILD_TAG}
git push origin --tags
