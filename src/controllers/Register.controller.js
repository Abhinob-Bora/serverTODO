import { validationResult } from "express-validator";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode,JWT_TOKEN_SECRET } from "../utils/constants.js";
import bcrypt from 'bcrypt'
import User from "../models/User.js";
import Jwt from 'jsonwebtoken'

const Register = async (req, res) => {
    // Destructure the properties from req.body
    const { name, username, password, email } = req.body;

    // Validate the request data
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // If there are validation errors, return an error response
        return res.json(jsonGenerate(StatusCode.VALIDATION_ERROR, "Validation Error", errors.mapped()));
    }

    // Check if a user with the same email or username already exists
    const userExist = await User.findOne({ $or: [{
        email: email
    }, {
        username: username
    }]});

    if (userExist) {
        return res.json(jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "User or Email already exists"));
    }

    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            username: username
        });

        const token = Jwt.sign({userId:result._id},JWT_TOKEN_SECRET)

        // Registration successful response
        res.json(jsonGenerate(StatusCode.SUCCESS, "Registration Successful", {userID:result._id,token:token}));
    } catch (error) {
        console.error(error);
        // Handle any database or server errors here
        res.status(500).json(jsonGenerate(StatusCode.INTERNAL_SERVER_ERROR, "Internal Server Error"));
    }
}

export default Register;
