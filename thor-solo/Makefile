SHELL := /bin/bash

# Thor solo
solo-up: #@ Start Thor solo
	docker compose -f docker-compose.yaml up -d --wait
solo-down: #@ Stop Thor solo
	docker compose -f docker-compose.yaml down
solo-clean: #@ Clean Thor solo
	docker compose -f docker-compose.yaml down -v --remove-orphans