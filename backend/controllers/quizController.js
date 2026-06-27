const db = require("../db");

exports.saveResult = (req, res) => {
    console.log(req.body);
    const {
        user_uid,
        score,
        total_questions,
        correct_answers,
        skipped_que,
        not_attempted,
        wrong_answers
    } = req.body;

    const percentage =
        (correct_answers / total_questions) * 100;

    const sql = `
INSERT INTO quiz_results
(user_uid, score, total_questions,
correct_answers,skipped_que, not_attempted, wrong_answers,
percentage)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;
    db.query(sql, [
        user_uid,
        score,
        total_questions,
        correct_answers,
        skipped_que,
        not_attempted,
        wrong_answers,
        percentage
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
                message: "Result saved"
            });

        }
    );

};
exports.getQuestions = async (req, res) => {
    try {

        const [setting] = await db.promise().query(
            `SELECT setting_value
             FROM app_settings
             WHERE setting_key = 'quiz_question_limit'`
        );

        const limit = setting.length > 0
            ? parseInt(setting[0].setting_value)
            : 25;

        const [results] = await db.promise().query(
            `SELECT *
             FROM quiz_questions
            
             LIMIT ?`,
            [limit]
        );

        const questions = results.map(q => ({
            section: q.section,
            q: q.question,
            options: [
                q.option1,
                q.option2,
                q.option3,
                q.option4
            ].filter(Boolean),
            answer: q.answer_index -1,
            category: q.category,
            difficulty: q.difficulty
        }));

        res.json(questions);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};