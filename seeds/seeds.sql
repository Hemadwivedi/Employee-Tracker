



TRUNCATE employee;
INSERT INTO employee(first_name, last_name, role_id) VALUES ("Asheesh", "Dwivedi", 4);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Hema", "Dwivedi", 2, 1);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Apoorva", "Dwivedi", 5, 1);
INSERT INTO employee(first_name, last_name, role_id) VALUES ("Rahul", "Singh", 4);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Payal", "Tyagi", 3, 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Urmila", "Tiwari", 7, 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Bijendra", "Tiwari", 4, 5);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("Priyanka", "Tiwari", 6, 3);

TRUNCATE role;
INSERT INTO role(title, salary, department_id) VALUES ("General Manager", 100000, 1);
INSERT INTO role(title, salary, department_id) VALUES ("Assistant Manager", 80000, 1);
INSERT INTO role(title, salary, department_id) VALUES ("HR Specialist", 60000, 3);
INSERT INTO role(title, salary, department_id) VALUES ("Recruiter", 50000, 3);
INSERT INTO role(title, salary, department_id) VALUES (" Senior Software Engineer", 100000, 4);



TRUNCATE departments;
INSERT INTO departments(department_name ) VALUES ("Finance");
INSERT INTO departments(department_name ) VALUES ("Sales");
INSERT INTO departments(department_name ) VALUES ("Human Resources");
INSERT INTO departments(department_name ) VALUES ("Engineering");

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM departments;


