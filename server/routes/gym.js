const router = require('express').Router();
const Plans = require('../Models/Plans');
const bcrypt = require('bcrypt');
const User = require('../Models/User');
const jwt = require("jsonwebtoken");
const Member = require('../Models/Member');
const auth = require('../middlewares/auth');
const Gym = require('../Models/Gym');
const { default: mongoose } = require('mongoose');
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const payload = {
            usertype: 'gym',
            userId: user._id,
            username: user.username,
            gymId: user.gymId
        };
        const token = jwt.sign(
            { id: 1, role: "gym" },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        return res.status(200).json({ message: 'Login successful', user: payload });

    } catch (error) {
        console.error('Error during login:1', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/add-member', auth, async (req, res) => {
    const { name, phone, place, advanceAmount, paidDate, planId, gymId } = req.body;
    try {
        const expiryDate = new Date(paidDate);
        expiryDate.setMonth(expiryDate.getMonth() + 1); // Set expiry date to one month after paid date
        const newMember = new Member({ name, phone, place, advanceAmount, paidDate, planId, gymId, expiryDate: expiryDate });
        newMember.save()
            .then(member => {
                res.status(201).json({ message: 'Member added successfully', member });
            })
            .catch(err => {
                console.error('Error adding member:', err);
                res.status(500).json({ message: 'Server error', error: err.message });
            });
    } catch (error) {
        console.error('Error adding member:1', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



router.get('/members', auth, async (req, res) => {
    const { gymId } = req.query;
    try {
        const members = await Member.find({ gymId });
        res.status(200).json({ members });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/members/active', auth, async (req, res) => {
    const { gymId } = req.query;
    try {
        const activeGymRats = await Member.find({ gymId, active: true });
        res.status(200).json({ activeGymRats });
    } catch (error) {
        console.error('Error fetching active members:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/members/expired', auth, async (req, res) => {
    const { gymId } = req.query;
    try {
        const expiredGymRats = await Member.find({ gymId, active: false });
        res.status(200).json({ expiredGymRats });
    } catch (error) {
        console.error('Error fetching expired members:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/member/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const member = await Member.findById(id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json({ member });
    } catch (error) {
        console.error('Error fetching member:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.put('/member/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { name, phone, place, advanceAmount, paidDate, joinDate, planId } = req.body;
    try {
        const member = await Member.findById(id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        Object.assign(member, { name, phone, feesPaid, place, advanceAmount, paidDate, joinDate, planId });
        await member.save();
        res.status(200).json({ message: 'Member updated successfully', member });
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.delete('/member/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const member = await Member.findById(id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        await member.remove();
        res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/members/search', auth, async (req, res) => {
    const { gymId, query } = req.query;
    try {
        const regex = new RegExp(query, 'i'); // Case-insensitive search
        const gymRats = await Member.find({
            gymId,
            $or: [
                { name: regex },
                { phone: regex },
                { place: regex }
            ]
        });
        res.status(200).json({ gymRats });
    } catch (error) {
        console.error('Error searching members:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/renew-membership/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { paidDate, planId } = req.body;
    try {
        const gymRat = await Member.findById(id);
        if (!gymRat) {
            return res.status(404).json({ message: 'Member not found' });
        }
        const expiryDate = new Date(paidDate);
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        Object.assign(gymRat, { paidDate, planId, expiryDate, status: 'active' });
        await gymRat.save();
        res.status(200).json({ message: 'Membership renewed successfully', gymRat });
    }
    catch (error) {
        console.error('Error renewing membership:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.post('/add-plan', auth, async (req, res) => {
    const { gymId, name, durationDays, price } = req.body;
    try {
        const newPlan = new Plans({ gymId, name, durationDays, price });
        newPlan.save()
            .then(plan => {
                res.status(201).json({ message: 'Plan added successfully', plan });
            })
            .catch(err => {
                console.error('Error adding plan:', err);
                res.status(500).json({ message: 'Server error', error: err.message });
            });
    } catch (error) {
        console.error('Error adding plan:1', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.get('/plans', auth, async (req, res) => {
    const { gymId } = req.query;
    try {
        const plans = await Plans.find({ gymId });
        res.status(200).json({ plans });
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/plan/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const plan = await Plans.findById(id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.status(200).json({ plan });
    } catch (error) {
        console.error('Error fetching plan:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.delete('/plan/:id', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const plan = await Plans.findById(id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        await plan.remove();
        res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (error) {
        console.error('Error deleting plan:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/plan/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { name, durationDays, price } = req.body;
    try {
        const plan = await Plans.findById(id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        Object.assign(plan, { name, durationDays, price });
        await plan.save();
        res.status(200).json({ message: 'Plan updated successfully', plan });
    }
    catch (error) {
        console.error('Error updating plan:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.post('/add-expense', auth, async (req, res) => {
    const { gymId, description, amount, date } = req.body;
    try {
        const newExpense = new Expense({ gymId, description, amount, date });
        newExpense.save()
            .then(expense => {
                res.status(201).json({ message: 'Expense added successfully', expense });
            })
            .catch(err => {
                console.error('Error adding expense:', err);
                res.status(500).json({ message: 'Server error', error: err.message });
            });
    } catch (error) {
        console.error('Error adding expense:1', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get("/dashboard", auth, async (req, res) => {

    const { gymId } = req.query;
    try {
        const memberCountPromise = await Member.countDocuments({ gymId });

        const activeMemberCountPromise = await Member.countDocuments({ gymId, status: 'active' });
        const expiredMemberCountPromise = await Member.countDocuments({ gymId, status: 'expired' });
        const plansPromise = await Plans.find({ gymId });
        const gym = await Gym.findById({ _id: gymId });
        const gymData = {
            name: gym.name,
            ownerName: gym.ownerName,
            phone: gym.phone,
            place: gym.place,
            memberCount: memberCountPromise,
            activeMemberCount: activeMemberCountPromise,
            expiredMemberCount: expiredMemberCountPromise,
            plans: plansPromise
        };
        res.status(200).json({ gymData });
    } catch (error) {
        console.error('Error fetching dashboard data:1', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }



});

router.get('/monthly-revenue', auth, async (req, res) => {
    const { gymId } = req.query;
    try {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        console.log('Calculating monthly revenue for gymId:', gymId, 'from', firstDayOfMonth, 'to', lastDayOfMonth);

        const monthlyRevenue = await Member.aggregate([
            {
                $match: {
                    gymId: gymId,
                    paidDate: {
                        $gte: firstDayOfMonth,
                        $lte: lastDayOfMonth
                    }
                }
            },
            {
                $addFields: {
                    planObjectId: {
                        $toObjectId: "$planId"
                    }
                }
            },
            {
                $lookup: {
                    from: "plans",
                    localField: "planObjectId",
                    foreignField: "_id",
                    as: "planDetails"
                }
            },
            {
                $unwind: "$planDetails"
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$planDetails.price"
                    }
                }
            }
        ]);
        console.log('Monthly revenue calculated:', monthlyRevenue);
        res.status(200).json({ monthlyRevenue: monthlyRevenue[0] ? monthlyRevenue[0].totalRevenue : 0 });
    } catch (error) {
        console.error('Error fetching monthly revenue:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});




module.exports = router;