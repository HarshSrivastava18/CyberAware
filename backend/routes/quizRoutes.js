const express = require("express");
const router = express.Router();

const quizController =
    require("../controllers/quizController");

router.post(
    "/result",
    quizController.saveResult
);

router.get(
    "/questions",
    quizController.getQuestions
);

module.exports = router;