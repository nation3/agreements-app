# Nation3 Court Web App

Human-centric UI to create and manage agreements arbitrated by the Nation3 Court.

## Development

##### 1. Build dependencies.

This app depends on the `@nation3/ui-components` package found [here](../ui-components/). (packages/ui-components.)
If you want to see changes to the components reflected in real-time on the web app you should run the builder in the `ui-components` directory using:


```
yarn build:dependencies
```

##### 2. Run a local development environment with yarn:

```
yarn dev
```

---

##### Running the app:


```
yarn start
```

If you want to be able to create new agreements, you will need to upload metadata to IPFS, so you will need to add your own `IPFS_API_TOKEN` to your environment. Check [how to generate web3.storage API token](https://web3.storage/docs/how-tos/generate-api-token/).
