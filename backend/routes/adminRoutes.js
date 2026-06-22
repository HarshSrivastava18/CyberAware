const express = require("express");
const router = express.Router();
const db = require("../db");
const adminController =
    require("../controllers/adminController");

const {getRangeAnalytics,

    getUserAnalytics,
    getAllQuestions,
    deleteQuestion,
    updateQuestion
} = require("../controllers/adminController");

router.post("/settings/question-limit", async (req, res) => {
    const { limit } = req.body;

    await db.promise().query(
        `UPDATE app_settings
         SET setting_value = ?
         WHERE setting_key = 'quiz_question_limit'`,
        [limit]
    );

    res.json({
        success: true,
        message: "Question limit updated"
    });
});

router.post(
    "/questions",
    adminController.addQuestion
);
router.get(
    "/analytics/range",
    adminController.getRangeAnalytics
);


router.get(
    "/questions",
    getAllQuestions
);

router.delete(
    "/questions/:id",
    deleteQuestion
);

router.put(
    "/questions/:id",
    updateQuestion
);

router.get(
    "/users",
    adminController.getAllUsers
);

router.post(
    "/login",
    adminController.adminLogin
);

router.get(
    "/user-analytics/:uid",
    getUserAnalytics
);

router.get("/test", (req, res) => {
    res.send("Admin Route Working");
});

router.get(
    "/stats",
    adminController.getStats
);
router.get("/leaderboard", async (req, res) => {

    try {

        const [rows] =
            await db.promise().query(`
                SELECT
                    u.uid,
                    u.full_name,
                    u.email,

                    COUNT(q.id) AS attempts,

                    ROUND(
                        AVG(q.percentage),
                        2
                    ) AS averageScore,

                    MAX(q.percentage)
                    AS highestScore

                FROM users u

                JOIN quiz_results q
                    ON u.uid = q.user_uid

                GROUP BY
                    u.uid,
                    u.full_name,
                    u.email

                ORDER BY
                    highestScore DESC,
                    attempts DESC

                LIMIT 20
            `);

        res.json({
            success: true,
            leaderboard: rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
router.get("/test-route", (req, res) => {
    res.send("Working");
});
router.get("/user-attempts/:uid", async (req, res) => {
    try {

        const { uid } = req.params;

        const [rows] = await db.promise().query(
            `
            SELECT
                percentage,
                score,
                completed_at
            FROM quiz_results
            WHERE user_uid = ?
            ORDER BY completed_at DESC
            `,
            [uid]
        );

        res.json({
            success: true,
            attempts: rows
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});
module.exports = router;