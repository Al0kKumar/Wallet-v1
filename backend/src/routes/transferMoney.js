const { z } = require('zod');     
const auth = require('../middleware'); 
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

const wallettransferSchema = z.object({
    amount: z.string(),
    receiverid: z.number()           
})              

router.post('/wallettransfer', auth, async (req,res) => {

   try {
    const { amount , receiverid } = req.body;
    
        const validatedData = wallettransferSchema.parse(req.body);

    if (validatedData.status) {
        console.error("Error: Invalid input status:", check.status); // Log error
        return res.status(400).json({
            msg: "wrong inputs",
            details: check 
        });
    }
  
 
    const senderid = req.user.id;
 
    const senderaccount = await prisma.account.findUnique({
     where:{userid: senderid}
    })
 
    if(!senderaccount){
     return res.status(404).json({msg:"sender account not found"})
    }
 
    const currbalance = senderaccount.balance;  

    const realamount = Number(amount);
    
    if(currbalance < realamount){
     return res.status(404).json({msg:"Insufficient Balance"})
    }
    
    const resid = Number(receiverid);

    const receiveraccount = await prisma.account.findUnique({
     where:{userid: resid}
    })
    
 
    if(!receiveraccount){
     return res.status(401).json({msg:"reciver not found"})
    }

    
    const transaction = await prisma.$transaction( async (prisma) => {
       
        // update sender balance
        const senderupdate = await prisma.account.update({
         where:{userid: senderid},
         data:{balance: {decrement: realamount}}
        })
         
        //updated receiver balance 
        const receiverupdate = await prisma.account.update({
         where:{userid: receiverid},
         data:{balance: {increment: realamount}}
        })

        return {senderupdate,receiverupdate};
    
    })   

   
       
        if(!transaction){
            return res.status(500).json({msg:"Transaction failed"})
        }
        
    

    const historyupdate = await prisma.history.create({
        data:{
            userid: senderid,
            type: 'WALLET_TO_WALLET',
            receiverId: resid ,
            amount: amount
        }
    })

    if(!historyupdate){
        return res.status(401).json({msg:"error in creating history"})
    }
        
    return res.status(201).json({msg:"Transactions successfull"})

   } catch (error) {
       console.log("transaction failed", error);
       return res.status(500).json({msg:"Transaction failed"})
       
   }
})


const depositSchema = z.object({
    bank : z.string(),
    accountNumber: z.string(),
    pin: z.string(),
    amount: z.string().refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
        message: "Amount must be a positive number",
    })
})

router.post('/deposit', auth, async (req,res) => {
   
    const check = depositSchema.safeParse(req.body);

    if(!check.success){
        return res.status(400).json({msg:"provide amount or choose bank"})
    }

    const { amount, bank} = check.data;

    const depositAmount = Number(amount); 

    const userid = req.user.id;

    try {
        const updatedUser = await prisma.account.update({
            where:{userid: userid},
            data:{balance : {increment: depositAmount}}
        })
    
        if(!updatedUser){
            return res.status(404).json({msg:"deposit got failed"})
        }
          
        const historyupdate = await prisma.history.create({
            data:{
                userid: userid,
                type: 'BANK_TO_WALLET',
                bank: bank,
                amount: amount
            }
        })

        if(!historyupdate){
            return res.status(401).json({msg:"error in creating history"})
        }

        return res.status(201).json({msg:"amount deposited successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error." });
    }

})

const withdrawSchema = z.object({
    bank : z.string(),
    accountNumber: z.string(),
    pin: z.string(),
    amount: z.string().refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
        message: "Amount must be a positive number",
    })
})

router.post('/withdraw', auth , async (req,res) => {
    
    const check = withdrawSchema.safeParse(req.body);

    if(!check.success){
        return res.status(400).json({msg:"Inavlid input "})
    }
    
    const { amount ,bank }  = req.body;

    const withdrawAmount = Number(amount);

    const userid = req.user.id;
    
    const user = await prisma.account.findUnique({
        where:{userid: userid}
    })

    const currbalance = user.balance;

    if(currbalance < withdrawAmount){
        return res.status(404).json({msg:"Insuffcient balance"})
    }

    try {
        const updatedUser = await prisma.account.update({
            where:{userid: userid},
            data:{balance: {decrement: withdrawAmount}}
        })
    
        if(!updatedUser){
            return res.status(401).json({msg:"something went wrong"})
        }

        const historyupdate = await prisma.history.create({
            data:{
                userid: userid,
                type: 'WALLET_TO_BANK',
                bank: bank,
                amount: amount
            }
        })

        if(!historyupdate){
            return res.status(401).json({msg:"error in creating history"})
        }
    
        return res.status(201).json({msg:"withdrawl successfull"})
    } catch (error) {
        console.log(error);
        return res.status(400).json({msg:"withdrawl failed"})
          
    }

})


router.get('/transactionshistory', auth , async (req,res) => {

    const userid = req.user.id;

    try {
        const history = await prisma.history.findMany({
            where:{userid: userid},
            orderBy:{
                createdAt:'desc'
            }
        })
         
        if(history.length == 0){
            return res.status(401).json({msg:"error during fetching transactions history"})
        } 
        return res.status(201).json(history)
    } catch (error) {
        console.log(error);
        
    }
})


const searchSchema = z.object({
    phoneNumber: z.string().refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
        message: "Phone Number must be a positive number",
    })
})
router.post('/search',auth, async (req,res) => {
    
    const check = searchSchema.safeParse(req.body);

    if(!check.success){
        return res.status(400).json({msg:"Invalid inputs"})
    }

    const {phoneNumber} = check.data;

    try {
        const user = await prisma.user.findUnique({
            where:{phoneNumber:phoneNumber}
        })
    
        if(!user){
            return res.status(404).json({msg:"No such user exists"})
        }
    
        return res.status(200).json({
            id:user.id,
            name:user.name
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"Internal server error"})
        
    }
})

module.exports = router