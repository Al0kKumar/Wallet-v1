const { z } = require('zod');
const auth = require('../middleware');
const User = require('../models/User');
const Account = require('../models/Account');
const History = require('../models/History');
const express = require('express');
const router = express.Router();

const wallettransferSchema = z.object({
    amount: z.string(),
    receiverid: z.number()
});

router.post('/wallettransfer', auth, async (req, res) => {
    try {
        const { amount, receiverid } = req.body;
        const validatedData = wallettransferSchema.parse(req.body);

        if (!validatedData) {
            return res.status(400).json({
                msg: "Invalid input"
            });
        }

        const senderid = req.user.id;

        // Find sender account
        const senderaccount = await Account.findOne({ user: senderid });

        if (!senderaccount) {
            return res.status(404).json({ msg: "Sender account not found" });
        }

        // Get sender info
        const sender = await User.findById(senderid);
        const sendername = sender.name;

        const currbalance = senderaccount.balance;
        const realamount = Number(amount);

        if (currbalance < realamount) {
            return res.status(404).json({ msg: "Insufficient Balance" });
        }

        // Find receiver account
        const receiveraccount = await Account.findOne({ user: receiverid });

        if (!receiveraccount) {
            return res.status(404).json({ msg: "Receiver not found" });
        }

        const receiver = await User.findById(receiverid);
        const receivername = receiver.name;

        // Update balances in transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await senderaccount.updateOne(
                { user: senderid },
                { $inc: { balance: -realamount } },
                { session }
            );
            await receiveraccount.updateOne(
                { user: receiverid },
                { $inc: { balance: realamount } },
                { session }
            );

            // Create history entry for the transaction
            const history = new History({
                user: senderid,
                type: 'WALLET_TO_WALLET',
                sendername,
                receivername,
                amount: amount
            });

            await history.save({ session });

            await session.commitTransaction();

            return res.status(201).json({ msg: "Transaction successful" });

        } catch (error) {
            await session.abortTransaction();
            return res.status(500).json({ msg: "Transaction failed" });
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.log("Transaction failed", error);
        return res.status(500).json({ msg: "Transaction failed" });
    }
});

const depositSchema = z.object({
    bank: z.string(),
    accountNumber: z.string(),
    pin: z.string(),
    amount: z.string().refine(value => !isNaN(Number(value)) && Number(value) > 0, {
        message: "Amount must be a positive number"
    })
});

router.post('/deposit', auth, async (req, res) => {
    const check = depositSchema.safeParse(req.body);

    if (!check.success) {
        return res.status(400).json({ msg: "Provide amount or choose bank" });
    }

    const { amount, bank } = check.data;
    const depositAmount = Number(amount);
    const userid = req.user.id;

    try {
        // Update account balance
        const updatedUser = await Account.findOneAndUpdate(
            { user: userid },
            { $inc: { balance: depositAmount } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: "Deposit failed" });
        }

        // Create history entry for the deposit
        const history = new History({
            user: userid,
            type: 'BANK_TO_WALLET',
            bank,
            amount
        });

        await history.save();

        return res.status(201).json({ msg: "Amount deposited successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});
const withdrawSchema = z.object({
    bank: z.string(),
    accountNumber: z.string(),
    pin: z.string(),
    amount: z.string().refine(value => !isNaN(Number(value)) && Number(value) > 0, {
        message: "Amount must be a positive number"
    })
});

router.post('/withdraw', auth, async (req, res) => {
    const check = withdrawSchema.safeParse(req.body);

    if (!check.success) {
        return res.status(400).json({ msg: "Invalid input" });
    }

    const { amount, bank } = req.body;
    const withdrawAmount = Number(amount);
    const userid = req.user.id;

    const user = await Account.findOne({ user: userid });

    if (!user || user.balance < withdrawAmount) {
        return res.status(404).json({ msg: "Insufficient balance" });
    }

    try {
        // Decrease balance
        await Account.findOneAndUpdate(
            { user: userid },
            { $inc: { balance: -withdrawAmount } },
            { new: true }
        );

        // Create history entry for the withdrawal
        const history = new History({
            user: userid,
            type: 'WALLET_TO_BANK',
            bank,
            amount
        });

        await history.save();

        return res.status(201).json({ msg: "Withdrawal successful" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Withdrawal failed" });
    }
});

router.get('/transactionshistory', auth, async (req, res) => {
    const userid = req.user.id;

    try {
        const history = await History.find({ user: userid })
            .sort({ createdAt: -1 })
            .populate('user');

        if (history.length === 0) {
            return res.status(404).json({ msg: "No transactions found" });
        }

        return res.status(200).json(history);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "An error occurred while fetching transactions" });
    }
});

const searchSchema = z.object({
    phoneNumber: z.string().refine(value => !isNaN(Number(value)) && Number(value) > 0, {
        message: "Phone Number must be a positive number"
    })
});

router.post('/search', auth, async (req, res) => {
    const check = searchSchema.safeParse(req.body);

    if (!check.success) {
        return res.status(400).json({ msg: "Invalid inputs" });
    }

    const { phoneNumber } = check.data;

    try {
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({ msg: "No such user exists" });
        }

        return res.status(200).json({
            id: user.id,
            name: user.name
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});

module.exports = router