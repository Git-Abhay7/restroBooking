const mongoose = require("mongoose");
const schema = mongoose.Schema;
const reservationKey = new schema(
  {
    reserve_startTime: {
      type: String,
    },
    reserve_Date: {
      type: String,
    },
    reserve_endTime: {
      type: String,
    },
    duration: {
      type: Number,
    },
    totalGuest: {
        type: Number,
    },
    slot: {
      type: schema.Types.ObjectId,
      ref: 'restraunt'
    }
  },
  {
    timestamps: true,
  }
);

const reservationModel = mongoose.model("reservation", reservationKey, "reservation");

module.exports = reservationModel