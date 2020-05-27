const verify = jest.genMockFromModule("../verifyAuth");

async function verifyGoogleToken (token) {
    console.log(token);
    return false;
}

verify.verifyGoogleToken = verifyGoogleToken;

module.exports = verify;