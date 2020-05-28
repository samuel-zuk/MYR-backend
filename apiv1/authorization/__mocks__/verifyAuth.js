const verify = jest.genMockFromModule("../verifyAuth");
const ObjId = require("mongoose").Types.ObjectId;

const userTokens = {
    "r1squCvH0uTbobuoTV9G": ObjId("5ece88ff0d947fc9d912a437"), //test@example.com
    "xlhxDVnoUmRl8UltLdHo": ObjId("5ece8ace0d947fc9d912a438") //gordon@example.com
};

async function verifyGoogleToken (token) {
    if(userTokens[token]){
        return userTokens[token];
    }
    return false;
}

verify.verifyGoogleToken = verifyGoogleToken;

module.exports = verify;