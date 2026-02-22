DELIMITER $$

-- TRIGGER 1: BEFORE INSERT
-- Prevents adding a player younger than 15 years old.
CREATE TRIGGER before_player_insert
BEFORE INSERT ON player
FOR EACH ROW
BEGIN
    IF DATEDIFF(CURRENT_DATE, NEW.dob) / 365.25 < 15 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error: Player must be at least 15 years old.';
    END IF;
END$$

-- TRIGGER 2: AFTER DELETE
-- Logs the deletion of a player for audit purposes.
CREATE TRIGGER after_player_delete
AFTER DELETE ON player
FOR EACH ROW
BEGIN
    INSERT INTO player_log (player_id, deleted_at)
    VALUES (OLD.player_id, CURRENT_TIMESTAMP);
END$$

-- CURSOR: Row-by-row processing to apply a "Loyalty Bonus"
-- Increases salary by 10% if the player's contract is older than 2 years.
CREATE PROCEDURE apply_loyalty_bonus()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE c_id INT;
    DECLARE c_start DATE;
    DECLARE current_sal DECIMAL(12,2);
    
    -- Declare Cursor
    DECLARE contract_cursor CURSOR FOR 
        SELECT contract_id, start_date, salary FROM contract;
        
    -- Declare Continue Handler
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN contract_cursor;
    
    read_loop: LOOP
        FETCH contract_cursor INTO c_id, c_start, current_sal;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- If contract started more than 730 days (2 years) ago
        IF DATEDIFF(CURRENT_DATE, c_start) > 730 THEN
            UPDATE contract 
            SET salary = current_sal * 1.10 
            WHERE contract_id = c_id;
        END IF;
    END LOOP;
    
    CLOSE contract_cursor;
END$$

DELIMITER ;