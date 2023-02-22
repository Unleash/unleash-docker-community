## Unleash Community Docker Image with OpenID Connect Support

**Useful links:**

- [Docker image on dockerhub](https://hub.docker.com/r/unleashorg/unleash-community-openid-connect)
- [passport-openid-connect](https://www.passportjs.org/packages/passport-openidconnect/)

For an example usage see the example below.
You can also visit the [passport](https://www.passportjs.org/docs/) and [openid-connect](https://www.passportjs.org/packages/passport-openidconnect/) documentations for further information.

## Example

This shows the usage of the OpenIdConnectStrategy with a keycloak realm as IDP.
It authenticates the user and checks some custom roles to give the user some initial permissions. 
It also updates the role in case it changed, so you can completely control unleash permissions through roles in keycloak.
You need to configure your client accordingly, so it returns roles as a `resource_access` object.

If you only need the authentication, just remove that part.

```javascript
'use strict';

const passport = require('passport');
const OpenIdConnectStrategy = require('passport-openidconnect')
const {AuthenticationRequired, RoleName} = require("unleash-server");

const host = process.env.UNLEASH_HOST
const contextPath = process.env.CONTEXT_PATH || '';
const authHost = process.env.AUTH_HOST;
const realm = process.env.AUTH_REALM;
const clientID = process.env.AUTH_CLIENT_ID;
const clientSecret = process.env.AUTH_CLIENT_SECRET || '';

function openIdConnect(app, config, services) {
    const {userService} = services;

    passport.use('openidconnect', new OpenIdConnectStrategy({
        issuer: `${authHost}/realms/${realm}`,
        authorizationURL: `${authHost}/realms/${realm}/protocol/openid-connect/auth`,
        tokenURL: `${authHost}/realms/${realm}/protocol/openid-connect/token`,
        userInfoURL: `${authHost}/realms/${realm}/protocol/openid-connect/userinfo`,
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: `${host}${contextPath}/api/auth/callback`,
    }, async (issuer, profile, cb) => {
        const email = profile.emails[0].value
        const user = await userService.loginUserWithoutPassword(email, true)
        cb(null, user);
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    app.get('/api/admin/login', passport.authenticate('openidconnect'));

    app.get('/api/auth/callback',
        passport.authenticate('openidconnect', {failureRedirect: '/login', failureMessage: true}),
        function (req, res) {
            res.redirect('/');
        });

    app.use('/api', (req, res, next) => {
        console.log(`req.user is ${req.user}`);

        if (req.user) {
            return next();
        }
        // Instruct unleash-frontend to pop-up auth dialog
        return res
            .status(401)
            .json(
                new AuthenticationRequired({
                    path: '/api/admin/login',
                    type: 'custom',
                    message: `You have to identify yourself in order to use Unleash. 
                        Click the button and follow the instructions.`,
                }),
            )
            .end();
    });
}


unleash.start({
    authentication: {
        type: 'custom',
        customAuthHandler: openIdConnect,
    }
});
```
