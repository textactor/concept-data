#!/bin/bash

yarn unlink @textactor/domain
yarn unlink @textactor/concept-domain
yarn unlink mongo-item

yarn upgrade --latest

yarn add @textactor/domain
yarn add @textactor/concept-domain
yarn add mongo-item

yarn test
