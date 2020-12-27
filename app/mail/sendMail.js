var mailServer= require('./mailSetting');
var fs = require('fs');
var serverhost='127.0.0.1';


exports.sendActivateMail=function(account){   
    let activateAddress="http://"+serverhost+":3000/auth/activate?account="+account;	
	let mailContext=fs.readFileSync(__dirname+'/mailStyle.html').toString();
	
	mailContext = mailContext.replace("@@@", activateAddress);
	mailContext = mailContext.replace("@@@", activateAddress);
	mailContext = mailContext.replace("%%%", account);

	mailServer.sendMail({
        html: mailContext,
        from:"helpless0857@gmail.com",       
        to:account,       
        subject:"會員註冊驗證"          //主题
        }, function(err, message) {
        console.log(err || message);
    });
}
