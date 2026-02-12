CREATE TABLE user_verification
(
    user_id INT PRIMARY KEY NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    verification_id VARCHAR(200) NOT NULL UNIQUE,
    created_At TIMESTAMP NOT NULL DEFAULT NOW()
)