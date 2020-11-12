const mongoose = require("mongoose");
const schema = mongoose.Schema;
const userKey = new schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    mobileNo :{
      type: Number
    }
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", userKey, "user");

UserModel["SignUp"] = async (body, res) => {
  try {
    const result = await UserModel.findOne({
      email: body.email,
    });
    if (result) {
      if (result.email == body.email) {
        res.status(400).send("Email already exist.");
      }
    }
  } catch (error) {
       throw error;
  }
};
module.exports = UserModel;