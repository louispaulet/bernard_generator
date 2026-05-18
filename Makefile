PORT ?= 5173

.PHONY: up kill test build deploy

up:
	@if [ ! -d node_modules ]; then npm install; fi
	npm run dev

kill:
	@lsof -ti tcp:$(PORT) | xargs -r kill

test:
	npm run test

build:
	npm run build

deploy:
	npm run deploy
