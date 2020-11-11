var user = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports = {
    signUp: async (req, res) => {
        try {
            await user.SignUp(req.body, res);
            let saltRounds = 10;
            let hashed = await bcrypt.hash(req.body.password, saltRounds);
            req.body.password = hashed;
            let result = await new user(req.body).save();
            res
                .send({
                    responseCode: 200,
                    resonseMessage: "Signup successfully.", result
                });
        } catch (error) {
            throw error
        }
    }
};