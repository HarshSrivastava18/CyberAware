const db = require("../db");
const bcrypt = require("bcrypt");
const generateUID = require("../utils/generateUID");
console.log("generateUID =", generateUID);
// Register User
const registerUser = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        // Validation
        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check existing email
        const checkEmailSql = "SELECT * FROM users WHERE email = ?";

        db.query(checkEmailSql, [email], async (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Email already registered"
                });
            }

            // Generate UID
            const uid = generateUID();

            // Hash Password
            const password_hash = await bcrypt.hash(password, 10);

            // Insert User
            const insertSql = `
                INSERT INTO users
                (uid, full_name, email, password_hash)
                VALUES (?, ?, ?, ?)
            `;

            db.query(
                insertSql,
                [uid, full_name, email, password_hash],
                (err, insertResult) => {
                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            success: false,
                            message: "Registration Failed"
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: "Registration Successful",
                        uid: uid
                    });
                }
            );
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// Login User
const loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and Password required"
        });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        res.status(200).json({
            success: true,
            message: "Login Successful",
            
            user: {
                uid: user.uid,
                full_name: user.full_name,
                email: user.email
            }
        });
    });
};

module.exports = {
    registerUser,
    loginUser
};