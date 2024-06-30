docker run --rm \
 -w ${PWD} \
 -v ${PWD}:${PWD} \
 -e PACT_BROKER_BASE_URL=http://localhost:31000 \
 -e PACT_BROKER_USERNAME=vukstefanovic97 \
 -e PACT_BROKER_PASSWORD=test1234 \
 --network="host" \
  pactfoundation/pact-cli:1 \
  publish \
  ${PWD}/pacts \
  --consumer-app-version fake-git-sha-for-demo-$(date +%s) \
  --tag-with-git-branch