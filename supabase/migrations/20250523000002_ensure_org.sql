
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM organizations LIMIT 1) THEN
        INSERT INTO organizations (id, name) VALUES (gen_random_uuid(), 'Default Org');
    END IF;
END $$;
