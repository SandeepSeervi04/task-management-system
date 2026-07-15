const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "../data/users.json");

/* REGISTER USER */

const registerUser = (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const users = JSON.parse(
        fs.readFileSync(usersFile, "utf-8")
    );

    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password
    };

    users.push(newUser);

    fs.writeFileSync(
        usersFile,
        JSON.stringify(users, null, 2)
    );

    res.status(201).json({
        message: "User registered successfully",
        user: newUser
    });
};

/* LOGIN USER */

const loginUser = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const users = JSON.parse(
        fs.readFileSync(usersFile, "utf-8")
    );

    const user = users.find(
        user =>
            user.email === email &&
            user.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    res.status(200).json({
        message: "Login successful",
        user
    });
};

module.exports = {
    registerUser,
    loginUser
};