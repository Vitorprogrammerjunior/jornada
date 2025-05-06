
-- Database creation script for Jornada Digital

-- Create database
CREATE DATABASE IF NOT EXISTS jornada_digital;
USE jornada_digital;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('coordinator','leader','student','inactive','pending') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_by VARCHAR(36) NULL,
  group_id VARCHAR(36) NULL,
  course_id VARCHAR(10) NULL,
  period_semester INT NULL,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

SELECT * FROM users;
-- Create initial coordinator account (password will be hashed in application)
INSERT INTO users (id, name, email, password, role) VALUES 
('1', 'Admin Coordinator', 'admin@example.com', 'password', 'coordinator');

INSERT INTO users (
  id,
  name,
  email,
  password,       -- já em hash
  role,
  created_at
) VALUES (
  UUID(),
  'Super Admin',
  'admin@seu-dominio.com',
  'password',
  'superadmin',
  NOW()
);

ALTER TABLE phases
ADD COLUMN updated_At DATETIME NOT NULL
  DEFAULT CURRENT_TIMESTAMP
  ON UPDATE CURRENT_TIMESTAMP;

UPDATE users
SET password = '$2b$10$bvQ2VvZrH3dYlCqRHkdk8eRAX2Th7iZvjgOoAguSH0u1yf.TpwAxC'
WHERE email = 'admin@seu-dominio.com';

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Insert some default courses
INSERT INTO courses (id, name) VALUES
('ENG', 'Engenharia'),
('ADM', 'Administração'),
('DIR', 'Direito'),
('MED', 'Medicina'),
('PSI', 'Psicologia');

SELECT * from users; 

-- Groups table
CREATE TABLE IF NOT EXISTS grupos (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  leader_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP NULL,
  approved_by VARCHAR(36) NULL,
  course_id VARCHAR(10) NULL,
  period_semester INT NULL,
  FOREIGN KEY (leader_id) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- Add foreign key constraint to users table (for group_id)
ALTER TABLE users ADD CONSTRAINT fk_user_group FOREIGN KEY (group_id) REFERENCES grupos(id) ON DELETE SET NULL;

-- Group join requests table
CREATE TABLE IF NOT EXISTS join_requests (
  id VARCHAR(36) PRIMARY KEY,
  group_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  reviewed_by VARCHAR(36) NULL,
  FOREIGN KEY (group_id) REFERENCES grupos(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Leader requests table
CREATE TABLE IF NOT EXISTS leader_requests (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  reviewed_by VARCHAR(36) NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

SELECT * FROM leader_requests;
  



-- Phases table (for journey schedule)
CREATE TABLE IF NOT EXISTS phases (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  order_num INT NOT NULL
);

ALTER TABLE phases
MODIFY COLUMN start_date TIMESTAMP NULL;


-- Insert default phases
INSERT INTO phases (id, name, description, start_date, end_date, is_active, order_num) VALUES
('1', 'Formação das Equipes', 'Período para formação e cadastro das equipes participantes', DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY), FALSE, 1),
('2', 'Entrega da Proposta Inicial', 'Entrega do documento com a proposta inicial do projeto', DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), FALSE, 2),
('3', 'Desenvolvimento do Projeto', 'Período principal de desenvolvimento do projeto proposto', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), TRUE, 3),
('4', 'Entrega do Relatório Parcial', 'Entrega do relatório com o andamento parcial do projeto', DATE_ADD(NOW(), INTERVAL 30 DAY), DATE_ADD(NOW(), INTERVAL 45 DAY), FALSE, 4),
('5', 'Finalização e Testes', 'Período para finalização e testes do projeto', DATE_ADD(NOW(), INTERVAL 45 DAY), DATE_ADD(NOW(), INTERVAL 60 DAY), FALSE, 5),
('6', 'Apresentação Final', 'Apresentação final dos projetos desenvolvidos', DATE_ADD(NOW(), INTERVAL 60 DAY), DATE_ADD(NOW(), INTERVAL 62 DAY), FALSE, 6);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id VARCHAR(36) PRIMARY KEY,
  group_id VARCHAR(36) NOT NULL,
  phase_id VARCHAR(36) NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_by VARCHAR(36) NOT NULL,
  grade DECIMAL(5,2) NULL,
  feedback TEXT NULL,
  graded_by VARCHAR(36) NULL,
  graded_at TIMESTAMP NULL,
  FOREIGN KEY (group_id) REFERENCES grupos(id) ON DELETE CASCADE,
  FOREIGN KEY (phase_id) REFERENCES phases(id) ON DELETE CASCADE,
  FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id VARCHAR(36) PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  value TEXT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  updated_by VARCHAR(36) NULL,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_setting (category, name)
);

-- Insert default settings
INSERT INTO settings (id, category, name, value) VALUES
-- General settings
('1', 'general', 'siteName', 'Jornada Digital'),
('2', 'general', 'siteDescription', 'Plataforma para coordenação da jornada de aprendizado digital'),
('3', 'general', 'logoUrl', '/assets/logo.png'),
('4', 'general', 'primaryColor', '#166534'),
('5', 'general', 'maxGroupSize', '5'),
('6', 'general', 'academicYear', '2024-2025'),

-- Deliveries settings
('7', 'deliveries', 'submissionFormat', 'pdf,doc,docx,ppt,pptx'),
('8', 'deliveries', 'maxFileSize', '10'),
('9', 'deliveries', 'allowLateSubmissions', 'true'),
('10', 'deliveries', 'latePenaltyPercentage', '10'),
('11', 'deliveries', 'notifyOnSubmission', 'true'),
('12', 'deliveries', 'requireGroupApproval', 'true'),

-- Journey settings
('13', 'journey', 'journeyName', 'Jornada de Desenvolvimento de Projetos'),
('14', 'journey', 'journeyDescription', 'Uma jornada de aprendizado para desenvolvimento de projetos inovadores'),
('15', 'journey', 'currentPhaseId', '3'),
('16', 'journey', 'autoAdvancePhases', 'false'),
('17', 'journey', 'notifyPhaseChange', 'true'),
('18', 'journey', 'requirePhaseApproval', 'true');

-- Create indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_course ON users(course_id);
CREATE INDEX idx_groups_course ON grupos(course_id);
CREATE INDEX idx_submissions_phase ON submissions(phase_id);

-- Primeiro, apaga a tabela antiga se ela existir
DROP TABLE IF EXISTS grupo_requests;

-- Agora cria a tabela corrigida
CREATE TABLE grupo_requests (
  id VARCHAR(36) PRIMARY KEY, -- ID da solicitação (UUID)
  student_id VARCHAR(36) NOT NULL, -- FK para a tabela users (aluno solicitante)
  grupo_id VARCHAR(36) NOT NULL, -- FK para a tabela groups (grupo solicitado)
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending', -- Estado da solicitação
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Foreign Keys corretas
  CONSTRAINT fk_grupo_requests_student FOREIGN KEY (student_id) REFERENCES users(id),
  CONSTRAINT fk_grupo_requests_group FOREIGN KEY (grupo_id) REFERENCES grupos(id)
);

SELECT * FROM grupo_requests;

CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(36) PRIMARY KEY,
  phase_id VARCHAR(36) NOT NULL,
  leader_id VARCHAR(36) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (phase_id) REFERENCES phases(id),
  FOREIGN KEY (leader_id) REFERENCES users(id)
);

ALTER TABLE documents
  ADD COLUMN group_id VARCHAR(36) NULL,
  ADD FOREIGN KEY (group_id) REFERENCES grupos(id);


