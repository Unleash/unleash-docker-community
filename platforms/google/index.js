"use strict";

const unleash = require("unleash-server");
const enableGoogleOAuth = require("./google-auth-hook");

let options = {
  authentication: {
    type: "custom",
    customAuthHandler: enableGoogleOAuth,
  },
};

unleash.start(options);
