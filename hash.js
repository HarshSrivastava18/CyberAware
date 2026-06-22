const bcrypt = require("bcrypt");

bcrypt.hash("Admin@2026", 10).then(hash => {
    console.log(hash);
});