DROP DATABASE IF EXISTS employee_manageDB;
CREATE DATABASE employee_manageDB;

USE employee_manageDB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NULL,
    salary DECIMAL(8,2),
    department_id INT,
    PRIMARY KEY (id) 
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    role_id INT,
    manager_id INT NULL,
    PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Trevor", "King", 0205);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Bruno", "Buchiarrati", 0503);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Jotaro", "Kujo", 1989);

INSERT INTO role (title, salary, department_id)
VALUES ("Manager","200,000.00", 3922);
INSERT INTO role (title, salary, department_id)
VALUES ("Vice President","400,000.00", 1187);
INSERT INTO role (title, salary, department_id)
VALUES ("CEO","500,000.00", 0017);


INSERT INTO department (department_name)
VALUES ("Development");
INSERT INTO department (department_name)
VALUES ("Human Resources");
INSERT INTO department (department_name)
VALUES ("Administration");
