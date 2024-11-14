const jwt = require("jsonwebtoken")
require("dotenv").config()
const { User, Admin } = require("../database/databaseConfig")

const secret = process.env.SECRET_KEY

module.exports.generateAccessToken = (email) => {
    const token = jwt.sign({ email: email }, secret, { expiresIn: "500h" });
    return token;
};



module.exports.verifyUser = async (req, res, next) => {
    try {
        let token = req.headers["header"]
        if (!token) {
            throw new Error("a token is needed")
        }
        const decodedToken = jwt.verify(token, secret)
        let user = await User.findOne({ email: decodedToken.email })

        req.user = user
        next()

    } catch (err) {
        console.log(err)
        let error = new Error("not authorize")
        error.statusCode = 301
        error.message = err.message
        return next(error)
    }
}


module.exports.verifyAdmin = async (req, res, next) => {
    try {
        let token = req.headers["header"]
        if (!token) {
            throw new Error("a token is needed")
        }
        const decodedToken = jwt.verify(token, secret)
        let admin = await Admin.findOne({ email: decodedToken.email })
        req.admin = admin
        console.log(req.Admin)
        next()

    } catch (err) {
        console.log(err)
        let error = new Error("not authorize")
        error.message = err.message
        return next(error)
    }
}

module.exports.verifyTransactionToken = async (token) => {
    const decodedToken = jwt.verify(token, secret)
    return decodedToken.email
}

module.exports.WelcomeTemplate = (email) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">WELCOME MESSAGE </h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">
    
    Dear ${email}, welcome to metrobss,Smart-free banking for everybody.
                      Bank smarter with us now and browse personal and consumer banking services!
    </p>

   
    <h2 style=" margin-bottom:30px; width: 100%; text-align: center ">For your information </h2>

</div>`

}

module.exports.NotifyAdmin = (email) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">WELCOME MESSAGE </h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">
    
    A new user with the email ${email} just registered!
    </p>

   
   



    


</div>`

}

module.exports.verifyEmailTemplate = (verifyUrl, email) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">ACCOUNT VERIFICATION </h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">To verify the email to your account,click the verification link below</p>

    <p style={{ margin-bottom: 40px; width: 100%; text-align:center; }}>
        <a style=" color: blue; font-size: .8rem;text-align:center" href='${verifyUrl}'>
        ${verifyUrl}
        </a>
    </p>

    

    


</div>`

}

module.exports.passwordResetTemplate = (resetUrl, email) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">metrobss.cloud PASSWORDRESET </h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">To reset the password to your metrobss account,click the RESET link below</p>

    <p style={{ margin-bottom: 40px; width: 100%; text-align:center; }}>
        <a style=" color: blue; font-size: .8rem;text-align:center" href='${resetUrl}'>
        ${resetUrl}
        </a>
    </p>

   

    


</div>`

}
module.exports.upgradeTemplate = (fundBalance, email) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">metrobss.cloud Credited </h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your metrobss account has  been credited with $ ${fundBalance} to start trading with. Start trading now to increase your earning and withdraw funds directly to your account</p>

    

    <h2 style=" margin-bottom:30px; width: 100%; text-align: center ">For your information </h2>


</div>`

}

module.exports.removeSpaces = (numStr) => {
    let res = ''
    for (let char of numStr) {
        if (char === ' ') continue
        res += char
    }
    return res
}

module.exports.TransferRequestTemplate = (amount, accountNumber, name, account, date) => {
    return `
<div >
    

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your request to transfer $${amount} from your  account ${accountNumber} to ${name} with account number  ${account} on ${date} has been recieved and awaiting approval. Contact admin if there is an issue of delay</p>

    

    






</div>`

}


module.exports.AdminTransferRequestTemplate = (email) => {
    return `
<div >
    

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">A user with the email ${email} made a transfer request</p>

    

    






</div>`

}





module.exports.CreditTemplate = (amount, date) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center "> CREDIT</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your Account have been credited with the sum of $${amount}  on ${date}</p>

    






</div>`

}

module.exports.Approval = () => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center "> ACCOUNT APPROVAL</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your Account has been approved .You can now make transfer, deposit and withdraw !!</p>
</div>`

}

module.exports.DebitRequestTemplate = (amount) => {
    return `
<div >
    

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your request to withdraw $${amount} has been recieved and would be approve.Contact admin if any delay arises</p>

    
</div>`

}

module.exports.AdminDebitRequestTemplate = (email,amount) => {
    return `
<div >
    

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">A user with the email ${email} made a withdrawal request of $${amount}</p>

    
</div>`

}



module.exports.DepositRequestTemplate = (amount) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center "> DEPOSIT REQUEST</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your deposit request of $${amount} ws recieved and awaiting approval. Contact admin to make the actual payment</p>

    
</div>`

}


module.exports.AdminDepositRequestTemplate = (email) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center "> DEPOSIT REQUEST</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">A user with the email $${email} made a deposit request</p>

    
</div>`

}






module.exports.OneTimePasswordTemplate = (password) => {
    return `
<div >
    

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your one time password is ${password}</p>

</div>`

}


module.exports.SendEmailTemplate = (email) => {
    return `
<div>
    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">${email}</p>
</div>`

}


module.exports.TransactionApproval = (transactionType, amount) => {
    return `
<div >

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">${transactionType}: ${transactionType} of $${amount} was successful</p>
</div>`

}



module.exports.AdminCredit = (accountType, amount) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">CREDIT ALERT</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>
    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">your ${accountType} account has been credited with $${amount}</p>
</div>`

}

module.exports.AdminDebit = (accountType, amount) => {
    return `
    <div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">DEBIT ALERT</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>
    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">your $${accountType} account has been debited with ${amount}</p>
</div>`

}

module.exports.AccountCreated = (accountType, accountNumber) => {
    return `
<div >

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">
    New Account: ${accountType} account has been created with an account number ${accountNumber}</p>
</div>`

}



module.exports.LoanRequestTemplate = (amount) => {
    return `
<div >

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your request for a loan of $${amount} has been recieved and awaiting approval! </p>
</div>`

}


module.exports.AdminLoanRequestTemplate = (email) => {
    return `
<div >

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">A user with the email ${email} request a loan  ! </p>
</div>`

}

module.exports.LoanApproval = (amount) => {
    return `
<div >

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your loan request of $${amount} has been approved</p>
</div>`

}

module.exports.CardRequestTemplate = (email, cardType) => {
    return `
<div >
    

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Dear ${email}, your request for a ${cardType} has been recieved and awaiting approval.Ensure there is an available balance of $500 on your saving account hence request will eventually be disapproved!</p>

</div>`

}

module.exports.AdminCardRequestTemplate = (email, cardType) => {
    return `
<div >
    

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">
    A user with the email ${email}, request for a card of type ${cardType} </p>

</div>`

}



module.exports.CardApproval = () => {
    return `
<div >

    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your card request  has been approved</p>
</div>`
}


module.exports.SenderRequestTemplate = (amount, accountNumber, recieverName, recieverAccount, date) => {
    return `
<div >
    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Transfer of $${amount} from your  account ${accountNumber} to ${ recieverName} with account number  ${recieverAccount} on ${date} was successful</p>
</div>`

}



module.exports.RecieverRequestTemplate = (amount,accountNumber,firstName,lastName) => {
    return `
<div >
    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">Your account ${accountNumber} has been credited with  $${amount} by ${firstName} ${lastName}</p>
</div>`

}




module.exports.AdminCreditCard = (cardNumber, amount) => {
    return `
<div >
    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">----------------------</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">CREDIT ALERT</h2>

    <h2 style=" margin-bottom: 30px; width: 100%; text-align: center ">-------------------------</h2>
    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">your card with number ${cardNumber} has been funded with ${amount}</p>
</div>`

}




module.exports.contactEmail = (name,email,message,phone) => {
    return `
<div >
    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">message from ${name} with email ${email} with the phone ${phone}:
    <br>
    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    <br>
    ${message}</p>

</div>`

}





