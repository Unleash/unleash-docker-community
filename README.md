## Use Unleash Docker Image


**Useful links:**

- [Azure Community Docker image on dockerhub](https://hub.docker.com/r/unleashorg/unleash-community-azure)
- [Google Community Docker image on dockerhub](https://hub.docker.com/r/unleashorg/unleash-community-google)
- [OpenID Connect Community Docker image on dockerhub](https://hub.docker.com/r/unleashorg/unleash-community-openid-connect)
- [Official Unleash Helm Chart on artifacthub](https://artifacthub.io/packages/helm/unleash/unleash)

**Steps:**

1. Create a network by running `docker network create unleash`
2. Start a postgres database:

```sh
docker run -d -e POSTGRES_PASSWORD=some_password \
  -e POSTGRES_USER=unleash_user -e POSTGRES_DB=unleash \
  --network unleash --name postgres postgres
```

3. Start Unleash via docker:

See `index.js` and `auth-hook.js` example implementations for azure within the [example repository](https://github.com/Unleash/unleash-examples/tree/main/v4/securing-azure-auth).

```sh
docker run -p 4242:4242 \
  -e DATABASE_HOST=postgres -e DATABASE_NAME=unleash \
  -e DATABASE_USERNAME=unleash_user -e DATABASE_PASSWORD=some_password \
  -e DATABASE_SSL=false \
  -e BASE_URI_PATH= \
  -e UNLEASH_AUTH_TENANT_ID={AZURE_TENANT_ID} \
  -e UNLEASH_AUTH_CLIENT_ID={AZURE_CLIENT_ID} \
  -e UNLEASH_AUTH_CLIENT_SECRET={AZURE_CLIENT_SECRET} \
  -e UNLEASH_URL=http://localhost:4242 \
  -v $(pwd)/index.js:/unleash/index.js \
  -v $(pwd)/azure-hook.js:/unleash/auth-hook.js \
  --network unleash unleashorg/unleash-community-azure
```

All configuration options [available in our documentation](https://docs.getunleash.io/docs/deploy/configuring_unleash).

### User accounts
- Once started up, you'll have to use the OIDC provider with your credentials.

### Building the docker image

Since Unleash v6.0.0 requires Node 20, use `--build-arg NODE_VERSION=20-alpine` when building

## Upgrade version
When we upgrade the `unleash-version` this project should be tagged with the same version number.

```bash
git tag -a 6.0.0 -m "upgrade to unleash-server 6.0.0"
git push origin main --follow-tags
```

You might also want to update the minor tag:

```bash
git tag -d 6.0
git push origin :6.0
git tag -a 6.0 -m "Update 6.0 tag"
git push origin main --follow-tags
```

This will automatically trigger a github actions which will build the new tag and push it to docker-hub.


## Looking for SSO and coming from https://github.com/Unleash/helm-charts ?

The old way of configuring SSO with a custom index.js in a config-map is no longer needed. These images handle the custom index.js file for you.
However, you will have to configure environment variables (probably better to use secrets) as documented further up. For Azure the three environment variables you'll need are:

* UNLEASH_AUTH_TENANT_ID
* UNLEASH_AUTH_CLIENT_ID
* UNLEASH_AUTH_CLIENT_SECRET

For google, you'll need:
* GOOGLE_CLIENT_ID,
* GOOGLE_CLIENT_SECRET,
* GOOGLE_CALLBACK_URL,

OIDC is not implemented yet, but community contributions are welcome.
