const router = require('express').Router();
const User = require('../Models/User');
const SuperUser = require('../Models/Super-User');
const bcrypt = require('bcrypt');
const Gym = require('../Models/Gym');
const jwt = require("jsonwebtoken");
const auth = require('../middlewares/auth');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt for username:", username, password);
    try {
        const admin = await SuperUser.findOne({ username, isActive: true });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found or inactive' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        admin.lastLogin = new Date();
        await admin.save();
        const payload = {
            id: admin._id,
            username: admin.username,
            email: admin.email
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });



        res.status(200).json({ message: 'Login successful', user: payload, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// router.post('/add-admin', async (req, res) => {
//     const { username, password, email } = req.body;

//     try {
//         // Check if admin already exists
//         const existingAdmin = await SuperUser.findOne({ username, email });
//         if (existingAdmin) {
//             if (existingAdmin.isActive === false) {
//                 existingAdmin.isActive = true;
//                 await existingAdmin.save();
//                 return res.status(200).json({ message: 'Admin reactivated successfully', admin: existingAdmin });
//             } else {
//                 return res.status(400).json({ message: 'Admin with this username or email already exists' });
//             }
//         }

//         // Hash the password
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         // Create new admin user
//         const newAdmin = new SuperUser({
//             username,
//             password: hashedPassword,
//             email: email,
//             isActive: true
//         });

//         await newAdmin.save();
//         res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });

//     } catch (error) {
//         console.error('Error adding admin:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

router.post('/add-gym', async (req, res) => {
    const { name, ownerName, phone,email, place, username, password } = req.body;
    console.log(req.body);
    
    try {
        const existingGym = await Gym.findOne({ name });
        const existingUser = await User.findOne({ username });

        if (existingGym) {
            return res.status(400).json({ message: 'Gym with this name already exists' });
        }
        if (existingUser) {
            return res.status(400).json({ message: 'User with this username already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newGym = new Gym({ name, ownerName, phone, place,email, status: 'active' });
        const savedGym = await newGym.save();

        const newUser = new User({
            gymId: savedGym._id,
            name: ownerName,
            username,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'Gym and user created successfully', gym: savedGym });
    } catch (error) {
        console.error('Error adding gym:1', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.get("/dashboard", auth, (req, res) => {
    res.json({
        msg: "Protected data",
        user: req.user
    });
});



module.exports = router;