const JWT = require('jsonwebtoken');

const secret = "$uperman123";

// this will take a user and create a token for that
function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role
    };
    const token  = JWT.sign(payload, secret);
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser, 
    validateToken,
};