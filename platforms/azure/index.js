"use strict";

const unleash = require("unleash-server");
const azureAuthHook = require("./azure-auth-hook");

let options = {
  authentication: {
    type: "custom",
    customAuthHandler: azureAuthHook,
  },
};
unleash.start(options);
