const db = require("../db");
const bcrypt = require("bcrypt");

exports.adminLogin = (req, res) => {

    const { username, password } = req.body;

    const sql =
        "SELECT * FROM admins WHERE username = ?";

    db.query(sql, [username], async (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const admin = result[0];

        const match = await bcrypt.compare(
            password,
            admin.password_hash
        );

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        res.json({
            success: true,
            admin: {
                id: admin.id,
                username: admin.username
            }
        });

    });

};
exports.getStats = (req, res) => {

    const stats = {};

    db.query(
        "SELECT COUNT(*) AS totalUsers FROM users",
        (err, users) => {

            if (err) return res.status(500).json(err);

            stats.totalUsers = users[0].totalUsers;

            db.query(
                "SELECT COUNT(*) AS totalAttempts FROM quiz_results",
                (err, attempts) => {

                    stats.totalAttempts =
                        attempts[0].totalAttempts;

                    db.query(
                        "SELECT MAX(percentage) AS highestScore FROM quiz_results",
                        (err, highest) => {

                            stats.highestScore =
                                highest[0].highestScore || 0;

                            db.query(
                                "SELECT AVG(percentage) AS averageScore FROM quiz_results",
                                (err, avg) => {

                                    stats.averageScore =
                                        Number(avg[0].averageScore || 0).toFixed(2);

                                    res.json(stats);

                                }
                            );
                        }
                    );
                }
            );
        }
    );

};
exports.getAllUsers = (req, res) => {

    const sql = `
        SELECT uid, full_name, email
        FROM users
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json(results);

    });

};
exports.addQuestion = (req, res) => {

    const {
        section,
        question,
        option1,
        option2,
        option3,
        option4,
        answer_index,
        category,
        difficulty
    } = req.body;

    const sql = `
    INSERT INTO quiz_questions
    (
        section,
        question,
        option1,
        option2,
        option3,
        option4,
        answer_index,
        category,
        difficulty
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            section,
            question,
            option1,
            option2,
            option3,
            option4,
            answer_index,
            category,
            difficulty
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true,
                message: "Question Added"
            });

        }
    );
};

exports.getUserAnalytics = (req, res) => {

    const search = req.params.uid; // can be UID or Email

    const userSql = `
    SELECT uid, full_name, email
    FROM users
    WHERE uid = ?
       OR email = ?
`;

    db.query(userSql, [search, search], (err, userResult) => {
        if (err)
            return res.status(500).json({
                success: false,
                error: err.message
            });

        if (userResult.length === 0)
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        const userUid = userResult[0].uid;
        const statsSql = `
            SELECT
                COUNT(*) AS totalAttempts,
                ROUND(AVG(percentage),2) AS averageScore,
                MAX(percentage) AS highestScore
            FROM quiz_results
            WHERE user_uid = ?
        `;

        db.query(statsSql, [userUid], (err, statsResult) => {

            if (err)
                return res.status(500).json({
                    success: false,
                    error: err.message
                });

            const historySql = `
                SELECT
                    percentage,
                    completed_at
                FROM quiz_results
                WHERE user_uid = ?
                ORDER BY completed_at DESC
                LIMIT 10
            `;

            db.query(historySql, [userUid], (err, historyResult) => {

                if (err)
                    return res.status(500).json({
                        success: false,
                        error: err.message
                    });

                res.json({
                    success: true,

                    uid: userResult[0].uid,
                    name: userResult[0].full_name,
                    email: userResult[0].email,

                    totalAttempts:
                        statsResult[0].totalAttempts || 0,

                    averageScore:
                        statsResult[0].averageScore || 0,

                    highestScore:
                        statsResult[0].highestScore || 0,

                    history: historyResult
                });

            });

        });

    });

};

//all question
exports.getAllQuestions = (req, res) => {

    const sql = `
        SELECT *
        FROM quiz_questions
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            questions: results
        });
    });
};

//delete question
exports.deleteQuestion = (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM quiz_questions WHERE id=?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true,
                message: "Question deleted"
            });
        }
    );
};
exports.updateQuestion = (req, res) => {

    const id = req.params.id;

    const {
        question,
        option1,
        option2,
        option3,
        option4,
        answer_index,
        category,
        difficulty
    } = req.body;

    const sql = `
        UPDATE quiz_questions
        SET
            question = ?,
            option1 = ?,
            option2 = ?,
            option3 = ?,
            option4 = ?,
            answer_index = ?,
            category = ?,
            difficulty = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            question,
            option1,
            option2,
            option3,
            option4,
            answer_index,
            category,
            difficulty,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true,
                message: "Question updated successfully"
            });
        }
    );
};

exports.getRangeAnalytics = (req, res) => {

    const { from, to } = req.query;

    const analyticsSql = `
        SELECT
            COUNT(*) AS totalAttempts,
            COUNT(DISTINCT user_uid) AS uniqueUsers,
            ROUND(AVG(percentage), 2) AS averageScore,
            MAX(percentage) AS highestScore
        FROM quiz_results
        WHERE DATE(completed_at)
        BETWEEN ? AND ?
    `;

    const usersSql = `
        SELECT
            u.uid,
            u.full_name,
            u.email,

            COUNT(r.id) AS attempts,

            ROUND(
                AVG(r.percentage),
                2
            ) AS averageScore,

            MAX(r.percentage)
            AS highestScore

        FROM users u

        INNER JOIN quiz_results r
            ON u.uid = r.user_uid

        WHERE DATE(r.completed_at)
        BETWEEN ? AND ?

        GROUP BY
            u.uid,
            u.full_name,
            u.email

        ORDER BY attempts DESC
    `;

    db.query(
        analyticsSql,
        [from, to],
        (err, analyticsResult) => {

            if (err) {
                return res.status(500).json(err);
            }

            db.query(
                usersSql,
                [from, to],
                (err, usersResult) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.json({
                        success: true,
                        analytics:
                            analyticsResult[0],
                        users:
                            usersResult
                    });
                }
            );
        }
    );
};