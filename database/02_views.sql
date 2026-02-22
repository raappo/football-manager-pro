-- 1. Updatable View (Contains no aggregates or joins, so we can UPDATE through it)
CREATE VIEW player_contact_view AS
SELECT player_id, f_name, l_name, city, state, pincode
FROM player;

-- 2. Complex View (Read-Only) combining Players, Clubs, and calculating Age dynamically
CREATE VIEW player_roster_view AS
SELECT 
    p.player_id,
    CONCAT(p.f_name, ' ', p.l_name) AS full_name,
    FLOOR(DATEDIFF(CURRENT_DATE, p.dob) / 365.25) AS age_calculated,
    UPPER(c.club_name) AS club_name,
    p.position
FROM player p
LEFT JOIN club c ON p.club_id = c.club_id;