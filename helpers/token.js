const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const JWT_OPTIONS = { expiresIn: 60 * 60 }; 


// create and return JWT

const create = (user) => {
    console.log(user)
    let payload = {
        username: user.username,
        is_admin: user.is_admin
    }
    return jwt.sign(payload, SECRET_KEY, JWT_OPTIONS);
} 


module.exports = create