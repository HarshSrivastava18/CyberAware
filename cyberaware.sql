CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    uid VARCHAR(30) UNIQUE NOT NULL,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_uid VARCHAR(50),
    score INT,
    total_questions INT,
    correct_answers INT,
    skipped_que INT
    wrong_answers INT,
    percentage DECIMAL(5,2),
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255)
);

CREATE TABLE quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT,
    option1 VARCHAR(255),
    option2 VARCHAR(255),
    option3 VARCHAR(255),
    option4 VARCHAR(255),
    answer_index INT,
    category VARCHAR(100),
    difficulty VARCHAR(50)
);

ALTER TABLE quiz_questions
ADD COLUMN section VARCHAR(50) NOT NULL
AFTER id;