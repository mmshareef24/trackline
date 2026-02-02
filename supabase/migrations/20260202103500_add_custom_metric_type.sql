-- Migration to add 'custom' to metric_type_enum
-- This fixes the error: invalid input value for enum metric_type_enum: "custom"

DO $$
BEGIN
    ALTER TYPE metric_type_enum ADD VALUE IF NOT EXISTS 'custom';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
