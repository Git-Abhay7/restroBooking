const moment = require("moment")
var restraunt = require("../model/restrauntModel");
const bcrypt = require("bcrypt");

module.exports = {
    custReservation: async (req, res) => {
        try {
            let startTime = moment(req.body.openTime, 'HH:mm');
            let endTime = moment(req.body.closeTime, 'HH:mm');
            let timeSlots = [];
            while (startTime <= endTime) {
                timeSlots.push(new moment(startTime).format('HH:mm'));
                startTime.add(15, 'minutes');
            }
            // if (req.body.totalGuest < 30) {
                let result = await restraunt.CustomerRes(req.body.BookingDate, req.body.start, req.body.end, req.body.totalGuest, timeSlots, res, req.body.duration)
                if (result == true) {
                    let finalData = await new restraunt(req.body).save();
                    delete finalData.openTime, finalData.closeTime;
                    res
                        .send({
                            responseCode: 200,
                            resonseMessage: "Your Table Booked Successfully.", finalData
                        });
                }

            // } else {
            //     res
            //         .send({
            //             responseCode: 400,
            //             resonseMessage: "No Of Guests are more than reservation limit, kindly call restraunt for this Booking."
            //         });
            // }

        } catch (error) {
            throw error
        }
    }
};