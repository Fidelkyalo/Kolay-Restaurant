-- Script to delete all CUSTOMER-only accounts from the database
-- This keeps Admin, Manager, Waiter, Chef, and other staff accounts intact

-- Step 1: Find the CUSTOMER role ID
SET @customer_role_id = (SELECT id FROM roles WHERE name = 'CUSTOMER');

-- Step 2: Delete user_roles entries for users who ONLY have the CUSTOMER role
-- (users who have CUSTOMER + other roles will NOT be deleted)
DELETE FROM user_roles 
WHERE user_id IN (
    SELECT user_id 
    FROM user_roles 
    WHERE role_id = @customer_role_id
    GROUP BY user_id 
    HAVING COUNT(*) = 1
);

-- Step 3: Delete the users themselves (only those with no roles left)
DELETE FROM users 
WHERE id NOT IN (SELECT DISTINCT user_id FROM user_roles);

-- Verification queries (run these after deletion to confirm)
-- SELECT COUNT(*) AS remaining_users FROM users;
-- SELECT u.username, r.name AS role FROM users u 
-- JOIN user_roles ur ON u.id = ur.user_id 
-- JOIN roles r ON ur.role_id = r.id;
