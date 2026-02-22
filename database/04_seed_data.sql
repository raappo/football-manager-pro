-- DML Commands: Inserting Initial Data

-- Users (Password hashes would normally be encrypted, using plaintext just for DB seeding visibility)
INSERT INTO users (username, password_hash, role) VALUES 
('admin', 'admin123', 'Admin'),
('manager', 'user123', 'User');

-- Clubs
INSERT INTO club (club_name, founded_year, total_trophies, owner_name, club_email) VALUES
('Manchester United', 1878, 66, 'Glazers', 'contact@manutd.com'),
('Barcelona', 1899, 75, 'Laporta', 'info@fcbarcelona.com'),
('Real Madrid', 1902, 95, 'Perez', 'press@realmadrid.com');

-- Stadiums
INSERT INTO stadium (stadium_name, capacity, city) VALUES
('Old Trafford', 74000, 'Manchester'),
('Camp Nou', 99000, 'Barcelona'),
('Bernabeu', 81000, 'Madrid');

-- Players
INSERT INTO player (f_name, l_name, dob, position, city, state, pincode, club_id) VALUES
('Bruno', 'Fernandes', '1994-09-08', 'Midfielder', 'Manchester', 'England', '10001', 1),
('Pedri', 'Gonzalez', '2002-11-25', 'Midfielder', 'Barcelona', 'Spain', '20002', 2),
('Vinicius', 'Junior', '2000-07-12', 'Forward', 'Madrid', 'Spain', '30003', 3),
('Marcus', 'Rashford', '1997-10-31', 'Forward', 'Manchester', 'England', '10002', 1),
('Robert', 'Lewandowski', '1988-08-21', 'Striker', 'Barcelona', 'Spain', '20003', 2);

-- Player Phones
INSERT INTO player_phone (player_id, phone_no) VALUES
(1, '9123456789'), (1, '9876543210'), (2, '9988776655'), 
(3, '9090909090'), (4, '8888888888'), (5, '7777777777');

-- Contracts
INSERT INTO contract (start_date, end_date, salary, player_id, club_id) VALUES
('2021-01-01', '2026-01-01', 55000.00, 1, 1),
('2022-01-01', '2025-01-01', 88000.00, 2, 2),
('2023-01-01', '2027-01-01', 132000.00, 3, 3),
('2020-01-01', '2025-01-01', 66000.00, 4, 1),
('2022-06-01', '2025-06-01', 99000.00, 5, 2);

-- Matches (Demonstrating Home vs Away logic)
INSERT INTO matches (match_type, match_date, home_club_id, away_club_id, home_score, away_score, stadium_id) VALUES
('League', '2024-03-10', 1, 3, 2, 1, 1),
('Friendly', '2024-04-15', 2, 1, 0, 0, 2),
('Champions League', '2024-05-20', 3, 2, 3, 2, 3);