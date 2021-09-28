const controller_object = {};
const bcrypt = require('bcrypt');
const connection = require('../config/config');
const uuid = require('uuid');

controller_object.register = async(req,res,next) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // jika field tidak sesuai
    connection.query(`SELECT * FROM user WHERE email = "${email}"`, (err, results) => {
        if (err) {
            throw err
        }

        // email is available
        if (results.length > 0) {
            res.json({
                statusCode: 409,
                message: "Email Already Registered"
            })
        }
        
        else {
            connection.query(`SELECT * FROM user WHERE username = "${username}"`, (err, results) =>{
                if (err) {
                    throw err
                }
                if (results.length > 0) {
                    res.json({
                        statusCode: 409,
                        message: "Username is Already in Use"
                    })
                }
                else {
                    connection.query(`INSERT INTO user (id, username, email, password, created_at) VALUES ("${uuid.v4()}", "${username}", "${email}", "${hashedPassword}", NOW())`, (err, results) => { 
                        if (err) { 
                            throw err;
                        } 
                        res.status(201).json({
                            statusCode: 201,
                            status: "sukses"
                        });
                        res.end();
                    })
                }
            })
        }
    });
};

module.exports = controller_object;