const { z } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Account = require('../../models/account');
const express = require('express');
const router = express.Router();
const auth = require('../middleware')

const signupSchema = z.object({
    name: z.string().min(1),
    phoneNumber: z.string().length(10),
    password: z.string().min(2),
    email: z.string().email()
});

router.post('/signup', async (req, res) => {
    const validation = signupSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            msg: "Please provide valid email/phone number",
        });
    }

    const { name, password, phoneNumber, email } = validation.data;

    try {
        // Check for existing user with the same email or phone number
        const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingUser) {
            return res.status(400).json({
                msg: "Email or phone number already exists",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            phoneNumber,
            password: hashedPassword,
            email,
        });

        await user.save();

        // Create account for the user
        const account = new Account({
            user: user._id,
            balance: 0,
        });

        await account.save();

        // Set the account reference in the user document
        user.account = account._id;
        await user.save();

        return res.status(201).json({
            msg: "User created successfully",
        });
    } catch (error) {
        console.error("Error creating user:", error);

        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            const duplicateKey = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                msg: `${duplicateKey} already exists`,
            });
        }

        return res.status(500).json({
            msg: "Something went wrong on our side",
        });
    }
});


const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

router.post('/login', async (req, res) => {
    const check = loginSchema.safeParse(req.body);

    if (!check.success) {
        return res.status(401).json({
            msg: "Please provide all inputs"
        });
    }

    const { email, password } = check.data;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                msg: "Invalid email"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                msg: "Wrong password"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(201).json({
            token
        });
    } catch (error) {
        console.log("Error during login", error);
        return res.status(500).json({
            msg: "Something went wrong on our side"
        });
    }
});

const updateSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z.string().optional()
});

router.put('/update', auth, async (req, res) => {
    const check = updateSchema.safeParse(req.body);

    const id = req.user.id;

    if (!check.success) {
        return res.status(401).json({
            msg: "Invalid data"
        });
    }

    const data = check.data;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        return res.status(200).json({ msg: "User updated successfully" });
    } catch (error) {
        console.log("Error updating user", error);
        return res.status(500).json({ error: "Failed to update" });
    }
});

router.get('/userdetails', auth, async (req, res) => {
    const id = req.user.id;

    try {
        const user = await User.findById(id).populate('account'); // Populating the Account details

        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }

        const account = user.account;

        if (!account) {
            return res.status(404).json({ msg: "Account not found" });
        }

        const details = {
            name: user.name,
            balance: account.balance
        };

        return res.status(201).json(details);
    } catch (error) {
        console.log("Error fetching user details", error);
        return res.status(500).json({ msg: "Error while fetching user details" });
    }
});


module.exports = router