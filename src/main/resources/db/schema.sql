-- Drop tables if they exist
DROP TABLE IF EXISTS payment_reminders CASCADE;
DROP TABLE IF EXISTS payment_imports CASCADE;
DROP TABLE IF EXISTS payment_exports CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS member_trainers CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS membership_plans CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- Create users table with enhanced security and profile fields
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    last_login TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    is_email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create membership_plans table with enhanced features
CREATE TABLE membership_plans (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    duration_months INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    features JSONB,
    max_freeze_days INTEGER DEFAULT 0,
    guest_passes INTEGER DEFAULT 0,
    trainer_sessions INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create members table with enhanced tracking
CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    membership_plan_id BIGINT REFERENCES membership_plans(id),
    phone VARCHAR(20),
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    photo_url VARCHAR(255),
    membership_start_date DATE NOT NULL,
    membership_end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    health_conditions TEXT,
    remaining_freeze_days INTEGER DEFAULT 0,
    remaining_guest_passes INTEGER DEFAULT 0,
    remaining_trainer_sessions INTEGER DEFAULT 0,
    last_visit_date TIMESTAMP,
    total_visits INTEGER DEFAULT 0,
    preferred_notification_method VARCHAR(20) DEFAULT 'email',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create staff table with enhanced role management
CREATE TABLE staff (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    position VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    hire_date DATE NOT NULL,
    phone VARCHAR(20),
    photo_url VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    salary DECIMAL(10,2),
    commission_rate DECIMAL(5,2),
    specializations TEXT[],
    availability_hours JSONB,
    max_clients INTEGER,
    current_clients INTEGER DEFAULT 0,
    performance_rating DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create schedules table with enhanced scheduling
CREATE TABLE schedules (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT REFERENCES staff(id),
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_recurring BOOLEAN DEFAULT true,
    specific_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create member_trainers table with enhanced relationship tracking
CREATE TABLE member_trainers (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id),
    trainer_id BIGINT REFERENCES staff(id),
    start_date DATE NOT NULL,
    end_date DATE,
    sessions_package INTEGER,
    sessions_remaining INTEGER,
    session_duration INTEGER, -- in minutes
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create attendance table with enhanced tracking
CREATE TABLE attendance (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id),
    check_in TIMESTAMP NOT NULL,
    check_out TIMESTAMP,
    duration INTEGER, -- in minutes
    facility_area VARCHAR(50), -- gym, pool, class, etc.
    check_in_method VARCHAR(20), -- card, biometric, manual
    checked_by BIGINT REFERENCES staff(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table with enhanced payment tracking
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50),
    payment_date TIMESTAMP,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    description TEXT,
    invoice_number VARCHAR(50),
    transaction_id VARCHAR(100),
    is_recurring BOOLEAN DEFAULT false,
    recurrence_interval VARCHAR(20), -- monthly, quarterly, yearly
    last_reminder_sent TIMESTAMP,
    reminder_count INTEGER DEFAULT 0,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_reminders table for tracking reminder history
CREATE TABLE payment_reminders (
    id BIGSERIAL PRIMARY KEY,
    payment_id BIGINT REFERENCES payments(id),
    reminder_type VARCHAR(20) NOT NULL, -- email, whatsapp
    sent_at TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_imports table for tracking import history
CREATE TABLE payment_imports (
    id BIGSERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    imported_by BIGINT REFERENCES users(id),
    total_records INTEGER,
    successful_records INTEGER,
    failed_records INTEGER,
    error_log TEXT,
    status VARCHAR(20) NOT NULL,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_exports table for tracking export history
CREATE TABLE payment_exports (
    id BIGSERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    exported_by BIGINT REFERENCES users(id),
    format VARCHAR(20) NOT NULL,
    date_range_start DATE,
    date_range_end DATE,
    total_records INTEGER,
    file_size INTEGER,
    status VARCHAR(20) NOT NULL,
    download_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create settings table for system configuration
CREATE TABLE settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create or update indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_reset_token ON users(password_reset_token);
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_staff_user_id ON staff(user_id);
CREATE INDEX idx_payments_member_id ON payments(member_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);
CREATE INDEX idx_attendance_member_id ON attendance(member_id);
CREATE INDEX idx_attendance_date ON attendance(check_in);
CREATE INDEX idx_member_trainers_member_id ON member_trainers(member_id);
CREATE INDEX idx_member_trainers_trainer_id ON member_trainers(trainer_id);
CREATE INDEX idx_schedules_staff_id ON schedules(staff_id);
CREATE INDEX idx_payment_reminders_payment_id ON payment_reminders(payment_id);

-- Update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
DO $$ 
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();',
            t,
            t
        );
    END LOOP;
END $$;</content>