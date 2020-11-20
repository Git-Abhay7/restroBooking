const moment = require("moment")
var restraunt = require("../model/restrauntModel");
const bcrypt = require("bcrypt");

module.exports = {
    custReservation: async (req, res) => {
        try {
            let startTime = moment().utc().set({ hour: 8, minute: 00 });
            let endTime = moment().utc().set({ hour: 22, minute: 00 })
            let timeSlots = [];
            while (startTime <= endTime) {
                timeSlots.push(new moment(startTime).format('HH:mm'));
                startTime.add(15, 'minutes');
            }
            if (req.body.totalGuest <= 20) {
                let result = await restraunt.CustomerRes(req.body.BookingDate, req.body.start, req.body.end, req.body.totalGuest, timeSlots, res, req.body.duration)
                if (result == true) {
                    let finalData = await new restraunt(req.body).save();
                    res
                        .status(200)
                        .send({
                            resonseMessage: "Your Table Booked Successfully.", finalData
                        });
                }
            } else {
                res
                    .status(400)
                    .send({
                        responseMessage: "No Of Guests are more than reservation limit, kindly call restraunt for this Booking."
                    })
            }

        } catch (error) {
            throw error
        }
    }
};