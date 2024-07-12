USE referral_system;

-- Check if the tables exist before creating them
DROP TABLE IF EXISTS referrals;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL, 
    referral_code VARCHAR(10) UNIQUE NOT NULL
);

-- Referrals table with referral counts
CREATE TABLE IF NOT EXISTS referrals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_id INT NOT NULL,
    referee_id INT NOT NULL,
    referral_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (referrer_id) REFERENCES users(id),
    FOREIGN KEY (referee_id) REFERENCES users(id),
    UNIQUE (referrer_id, referee_id)
);

-- View to calculate referral counts for users
DROP VIEW IF EXISTS user_referral_counts;
CREATE VIEW user_referral_counts AS
SELECT u.id, u.username, u.email, COUNT(r.referee_id) AS referral_count
FROM users u
LEFT JOIN referrals r ON u.id = r.referrer_id
GROUP BY u.id, u.username, u.email;
