"use strict";

const unleash = require("unleash-server");
const enableGoogleOAuth = require("./enable-google-oauth");

let options = {
  authentication: {
    type: "custom",
    customAuthHandler: enableGoogleOAuth,
  },
};

unleash.start(options);
