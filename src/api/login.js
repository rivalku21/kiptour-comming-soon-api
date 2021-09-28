const controller_object = {};
const response = require("../utils/response");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const connection = require('../config/config');

controller_object.login = async(req,res,next) => {
    const {username, password} = req.body;

    connection.query(`SELECT * FROM user WHERE username = "${username}"`, (err, result) => {
        if (err) {
            response.responseFailed(res, 400, err);
        }
        if (!result.length) {
            response.responseFailed(res, 401, "Username is incorrect!");
        }
        else {
            const user = result[0];

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    response.responseFailed(res, 401, "Password is incorrect!")
                }
                if (isMatch) {
                    const id = result[0].id;
                    const username = result[0].username;
                    
                    const token = jwt.sign({
                        username: username,
                    },
                    // expired key
                    process.env.TOKEN_SECRET, {
                        expiresIn:'1h'
                    });

                    connection.query(`UPDATE user SET last_login = now() WHERE id = '${id}'`);
                        return res.status(200).json({
                            statusCode: 200,
                            username,
                            token,
                        });
                }
                else {
                    response.responseFailed(res, 401, "NIK or Password is incorrect!");
                }
            });
        }
    });
}

module.exports = controller_object;