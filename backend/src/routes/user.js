const { z } = require('zod');          
const jwt = require('jsonwebtoken');    
const bcrypt = require('bcrypt');       
const auth = require('../middleware'); 
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

const signupSchema = z.object({
    name:     z.string().min(1),
    phoneNumber:  z.string().length(10),  
    password:     z.string().min(2),
    email:        z.string().email()
})

router.post('/signup',  async (req,res) => {

    const check = signupSchema.safeParse(req.body);

    if(!check.success){
        return res.status(401).json({
            msg:"Please provide valid email/Phone number"
        })
    }

    const { name , password, phoneNumber,email } = check.data;

    const hashedPassword = await bcrypt.hash(password,10);

    try {
        const user = await prisma.user.create({
            data: {
            name,
            phoneNumber,
            password: hashedPassword,
            email
            }     
        }) 
     
        const accountcreate = await prisma.account.create({
            data:{
            userid: user.id,
            balance:0
            }
        })

        if(!accountcreate){
            return res.status(401).json({msg:"Account not created"})
        }
    
        return res.status(201).json({
            msg:"user created successfully"
        })
    } catch (error) {
        
        console.log("Error creating user",error);
        
        return res.status(500).json({
            msg:"something went wrong from us"
        }) 
    }

})

const loginSchema = z.object({
    email:      z.string().email(),
    password:   z.string()
})

router.post('/login', async (req,res) => {
     

    const check = loginSchema.safeParse(req.body);

    if(!check.success){
        return res.status(401).json({
            msg:"Please provide all inputs "
        })
    }

    const { email, password } = check.data;

      try {
        const user = await prisma.user.findUnique({
          where:{email}
        })
  
        if(!user){
          return res.status(401).json({
              msg:"Invalid email"
          })
        }
  
        const ispasswordValid = await bcrypt.compare(password,user.password);
  
        if(!ispasswordValid){
          return res.status(401).json({
              msg:"wrong password"
          })
        }
        
        const token = jwt.sign({id: user.id},process.env.JWT_SECRET,{expiresIn:'1h'});
  
        return res.status(201).json({
          token
        })
      }
       catch (error) {
          
        console.log("Error during login",error);
        return res.status(500).json({
            msg:"Something went wrong on our side "
        })
        
    }

})

const updateSchema = z.object({
    name:         z.string().optional(),
    email:        z.string().optional(),
    phoneNumber:  z.string().optional()
})

router.put('/update', auth, async (req,res) => {

    const check = updateSchema.safeParse(req.body);

    const id = req.user.id;

    if(!check.success){
        return res.status(401)
    }

    const data = check.data;

    try {
        const updatedUser = await prisma.user.update({
            where:{id: id},
            data
        })
        return res.status(200).json({msg:"User updated succesfully"})
    
    } catch (error) {
        console.log("Error updating user", error);
        return res.status(500).json({error:"Failed to update"})
        
    }
    

})

router.get('/userdetails', auth, async (req,res) => {
   
    const id = req.user.id;
    
    try {
        const user = await prisma.user.findUnique({
            where:{id: id}
        })
    
        if(!user){
            return res.status(401).json({msg:"user not found"})
        }
    
        const account = await prisma.account.findUnique({
            where:{userid: id}
        })

        if (!account) {
            return res.status(404).json({ msg: "Account not found" });
        }
    
        const details = {
           name    : user.name,
           balance : account.balance
        }
    
        return res.status(201).json(details);

    } catch (error) {
        console.log("Error fetching user details",error);
        return res.status(500).json({msg:"error while fetching user details"})
    }
})

module.exports = router ;