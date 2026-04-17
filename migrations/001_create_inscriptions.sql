-- Migration: Create inscriptions table for Turso
-- Based on existing schema from src/lib/server/db/schema.ts

CREATE TABLE IF NOT EXISTS inscriptions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    name TEXT NOT NULL,
    script_type TEXT NOT NULL CHECK (script_type IN ('Brahmi', 'Vatteluttu')),
    content TEXT NOT NULL,
    translation TEXT
);

-- Seed data for Mangulam and Pulankurichi inscriptions

INSERT INTO inscriptions (id, name, script_type, content, translation) VALUES
    (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))), 'Mangulam Inscription', 'Brahmi', 'Kaniyan Nanda-Asiriyan', NULL),
    (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))), 'Pulankurichi Inscription', 'Vatteluttu', 'Ko-Chendan-Kootran', NULL);
