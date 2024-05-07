docker run --rm \
 -w ${PWD} \
 -v ${PWD}:${PWD} \
 -e PACT_BROKER_BASE_URL=http://localhost:3002 \
 -e PACT_BROKER_USERNAME=vukstefanovic97 \
 -e PACT_BROKER_PASSWORD=test1234 \
 --network="host" \
  pactfoundation/pact-cli:1 \
  publish \
  ${PWD}/pacts \
  --broker-base-url="http://host.docker.internal:3002" \
  --consumer-app-version fake-git-sha-for-demo-$(date +%s) \
  --tag-with-git-branch