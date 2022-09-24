const nodemailer = require("nodemailer");
const User = require("../models/Users")

//send mooc email to email adress, see the url in console to wiew it.

const sendEmail = async (options)=> {
 
const {email,message} = options
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'emanuel.hermann28@ethereal.email',
        pass: 'r9K4E63mC5r18dmFfJ'
    }
});

const mail = {
    from: '"Express Bootcamp App', // sender address
     to:`${email}`,// list of receivers
    subject: "Reset Password email", // Subject line
    text:message
   
  }

 

  // send mail with defined transport object
  try{
    let send = await transporter.sendMail(mail);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(send));

    return true
  }
  catch{
    return false
  }
}

module.exports = sendEmail