const mongoose = require("mongoose");
const schema = mongoose.Schema;
const restrauntKey = new schema(
  {
    openTime: {
      type: String,
    },
    closeTime: {
      type: String,
    },
    start: {
      type: String,
    },
    end: {
      type: String,
    },
    BookingDate: {
      type: String,
    },
    email: {
      type: String,
    },
    totalGuest: {
      type: Number
    }
  },
  {
    timestamps: true,
  }
);

const restrauntModel = mongoose.model("restraunt", restrauntKey, "restraunt");



restrauntModel['CustomerRes'] = async (date, starting, ending, Guest,res) => {
  try {
    let custArr = [];
    let peopleArr = []
    // let customer = await restrauntModel.find({ $and: [{ BookingDate: date }, { $or: [{ end: { $gt: starting } }, { start: { $gte: starting } }] }] })
    let customer = await restrauntModel.find({ BookingDate: date, end: { $gt: starting } })
    if (customer.length) {
      for (let data of customer) {
        custArr.push(data._id)
      }
      // let users = await restrauntModel.find({ _id: { $in: custArr }, start: { $gte: starting } , end : { $lte : ending}})
      let users = await restrauntModel.find({ _id: { $in: custArr } })
      if (users.length) {
        for (let people of users) {
          peopleArr.push(people.totalGuest)
        }
        let totalPeople = peopleArr.reduce((a, b) => a + b, 0)
        let newdata = Guest + totalPeople
        if (totalPeople < 100 && newdata <= 100) {
          console.log("IDHARRRRRRRRRRRRRRRRRRRRRRRRRRRRr")
          return true
        } else {
          res.send({
            responseCode: 400,
            resonseMessage: "you can select booking in these slots"
          });
        }
      }
    } else {
      return true
    }
  }
  catch (error) {
    throw error;
  }
}

module.exports = restrauntModel