#!/bin/bash

yarn remove @textactor/domain
yarn remove @textactor/concept-domain
yarn remove mongo-item

yarn link @textactor/domain
yarn link @textactor/concept-domain
yarn link mongo-item

yarn test
