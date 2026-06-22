const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const adminRoutes =
    require("./routes/adminRoutes");




const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);

const PORT = process.env.PORT || 5250;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.get("/", (req, res) => {
    res.send("CyberAware Backend Running");
});
app.get("/api/admin/test", (req, res) => {
    res.send("Admin Test Working");
});
