const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const signToken = (user) =>
    jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

const publicUser = (user) => ({
    //user.something is from db
    id: user.id,
    firstName: user.first_name,
    email: user.email,
});

const register = async (req, res) => {
    try {
        const { firstName, email, password } = req.body;
        // always revalidate on backend, even if the frontend already did it
        if (!firstName || !email || !password) {
            return res.status(400).json({ error: "firstName, email and password are required" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            "INSERT INTO users (first_name, email, password_hash) VALUES (?, ?, ?)",
            [firstName, email, passwordHash]
        );

        const user = { id: result.insertId, first_name: firstName, email };
        res.status(201).json({ user: publicUser(user), token: signToken(user) });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ error: "An account with that email already exists" });
        }
        console.error("Register error:", error.message);
        res.status(500).json({ error: "Failed to register" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "email and password are required" });
        }

        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = rows[0];

        const ok = user && (await bcrypt.compare(password, user.password_hash));
        if (!ok) return res.status(401).json({ error: "Invalid email or password" });

        res.status(201).json({ user: publicUser(user), token: signToken(user) });
        //you must never send the password hash to the frontend so this creates a new browser frirendly version
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ error: "Failed to log in" });
    }
};

module.exports = { register, login };
