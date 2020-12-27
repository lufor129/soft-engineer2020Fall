var nodemailer   = require("nodemailer");

module.exports  = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "helpless0857@gmail.com",
        pass: "hhh111**"
    }
});
