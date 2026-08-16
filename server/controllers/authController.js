import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existUser = await User.findOne({ email })

        if (existUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword })

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            message: "User registered successfully!"
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Server Error" })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "30d",
            }
        )
        return res.status(200).json({ _id: user._id, email: user.email, name: user.name, token })
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "server error" })
    }
}
export { registerUser, loginUser };




