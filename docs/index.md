just putting ideas here for now:

after auth server started, it will try to send data of itself to central, unless
set to private in env var. when a client tries to sign in, it goes to the one
set in the app's env var by default, if that one is unavailable, then request
for auth servers for central. central then returns list of auth services that is
up, and then client tries to use that auth.

when a jwt token is returned to the user, it should contain an "iss" so the
server knows which is the correct instance to validate the token with. maybe we
can make this federated, but i think thats just unneccessary :p
