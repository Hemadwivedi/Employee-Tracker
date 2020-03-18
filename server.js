const mysql = require("mysql");
const inquirer = require("inquirer");
const dotenv = require('dotenv').config();
const roleDb = require("./db/roleDb");
const departmentDb = require("./db/departmentDb");
const employeesDb = require("./db/employeeDb");




var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
});

start = () => {
    inquirer.prompt({
        type: "list",
        message: " What would you like to do?",
        name: "option",
        choices: ["ADD", "VIEW", "UPDATE", "DELETE", "DONE"]
    }).then(answer => {
        const option = answer.option;
        switch (option) {
            case "ADD":
                add_data();
                break;
            case "VIEW":
                view_data();
                break;
            case "UPDATE":
                update_data();
                break;
            case "DELETE":
                delete_data();
                break;
            case "DONE":
                //connection.end();
                break;

        };
    });
};
add_data = () => {
    inquirer.prompt({
        type: "list",
        message: "In which table you like to add?",
        name: "option",
        choices: ["employee", "role", "departments", "DONE"]
    }).then(answer => {
        const option = answer.option;
        switch (option) {
            case "employee":
                addEmployee();
                break;
            case "role":
                addRole();
                break;
            case "departments":
                addDepartment();
                break;
            case "DONE":
                start();
                break;

        }
    })
};
view_data = () => {
    inquirer
        .prompt({
            type: "list",
            message: "Please select what you would like to view: ",
            choices: ["departments", "role", "employee", "employee by manager", "DONE"],
            name: "view"
        }).then(answer => {
            const option = answer.view;
            switch (option) {
                case "departments":
                    departmentDb.getAllDepartment(connection).then(res => console.table(res));
                    break;
                case "role":
                    roleDb.getAllRoles(connection).then(res => console.table(res));
                    break;
                case "employee":
                    employeesDb.getAllEmp(connection).then(res => console.table(res));
                    break;
                case "employee by manager":
                    viewEmployeesByManager();
                    break;
                case "DONE":
                    start();
                    break;
            };
        });
};

update_data = async () => {
    inquirer
        .prompt({
            type: "list",
            message: "Please select your category to update: ",
            choices: ["ROLE", "MANAGER", "DONE"],
            name: "update"
        }).then(answer => {
            const option = answer.update;
            switch (option) {
                case "ROLE":
                    updateEmployeeRole();
                    break;
                case "MANAGER":
                    updateManager();
                    break;
                case "DONE":
                    start();
                    break;
            };
        });
}; {


    delete_data = () => {
        inquirer
            .prompt({
                type: "list",
                message: "Please select what you would like to delete: ",
                choices: ["departments", "role", "employee", "DONE"],
                name: "delete"
            }).then(answer => {
                const option = answer.delete;
                switch (option) {
                    case "departments":
                        deleteDepartment();
                        break;
                    case "role":
                        deleteRole();
                        break;
                    case "employee":
                        deleteEmployee();
                        break;

                    case "DONE":
                        start();
                        break;
                };
            });
    };


    addEmployee = async () => {
        inquirer
            .prompt([{
                    type: "input",
                    message: "Please input your employee's first name: ",
                    name: "firstName"
                },
                {
                    type: "input",
                    message: "Please input your employee's last name: ",
                    name: "lastName"
                },
                {
                    type: "list",
                    message: "Please select the role of your employee: ",
                    choices: await roleDb.getAllRoleTitle(connection),
                    name: "role"
                },
                {
                    type: "list",
                    message: "Please select the manager of the employee or no if there isn't one: ",
                    choices: await employeesDb.getAllManager(connection).then(res => {
                        const manager = res.map(emp => emp.id + " " + emp.first_name + " " + emp.last_name)
                        manager.push("None")
                        return manager;
                   }),
                    name: "manager"
                }
            ])
            .then(async answer => {
                console.log(answer)
                console.log("Inserting a new employee...\n");
                const firstName = answer.firstName;
                const lastName = answer.lastName;
                const roleId = await roleDb.getRoleIdByTitle(connection, answer.role);
                const managerId = answer.manager === "None" ? null : answer.manager.split(" ")[0];
                const emp = {
                    first_name: firstName,
                    last_name: lastName,
                    role_id: roleId,
                    manager_id: managerId
                };
                employeesDb.createEmployee(connection, emp)
                    .then(res => {
                        console.log(res.affectedRows + " employee added!\n")
                        start();
                    });
            });
    };




    addRole = async () => {
        inquirer
            .prompt([{
                    type: "input",
                    message: "Please enter the title of the role: ",
                    name: "title"
                },
                {
                    type: "number",
                    message: "Please enter the salary of the role: ",
                    name: "salary"
                },
                {
                    type: "list",
                    message: "Please select the department of the role: ",
                    choices: await departmentQuery(),
                    name: "department"
                }
            ])
            .then(async answer => {
                console.log("Inserting a new role...\n");
                const newRole = answer.title;
                const newSalary = answer.salary;
                const departmentId = await departmentDb.getDepartmentIdByName(connection, answer.department);
                const role = {
                    title: newRole,
                    salary: newSalary,
                    department_id: departmentId
                };
                roleDb.createRole(connection, role)
                    .then(res => {
                        console.log(res.affectedRows + " role added!\n")
                        start();
                    });
            });
    };


    addDepartment = async () => {
        inquirer
            .prompt([{
                    type: "input",
                    message: "Please enter the name of the department: ",
                    name: "name"
                },

            ])
            .then(async answer => {
                console.group(answer);
                console.log("Inserting a new department...\n");
                const newDepartment = answer.name;
                departmentDb.createDepartment(connection, {
                        department_name: newDepartment
                    })
                    .then(res => {
                        console.log(res.affectedRows + " department added!\n")
                        start();
                    })
            });
    };




    viewEmployeesByManager = async () => {
        inquirer
            .prompt({
                type: "list",
                message: "Select a MANAGER to view employees (or NONE to see unmanaged employees): ",
                choices: await employeesDb.getAllManager(connection).then(res => {
                    const manager = res.map(emp => emp.id + " " + emp.first_name + " " + emp.last_name)
                    manager.push("None")
                    return manager;
               }),
                name: "manager"
            })
            .then(async answer => {
                const managerId = answer.manager === "None" ? null : answer.manager.split(" ")[0];
                if (managerId === null) {
                    employeesDb.getEmpNameWithoutManager(connection)
                        .then(res => {
                            console.table(res);
                            start();
                        })
                } else {
                    employeesDb.getEmpNameByManagerId(connection, managerId)
                        .then(res => {
                            if (res.length < 1) {
                                console.log("No employees to show!");
                            } else {
                                console.table(res);
                            }
                            start();
                        })
                };
            });
    };
    deleteDepartment = async () => {
        inquirer
            .prompt([{
                    type: "list",
                    message: " Please select the department which you want to delete: ",
                    choices: await departmentDb.getAllDepartmentName(connection),
                    name: "name"
                },

            ])
            .then(async answer => {
                console.group(answer);
                console.log("Deleting a  department...\n");
                const newDepartment = answer.name;
                departmentDb.deleteDepartment(connection, {
                        department_name: newDepartment
                    })
                    .then(res => {
                        console.log(res.affectedRows + " department deleted!\n")
                        start();
                    })
            });
    };
    deleteRole = async () => {
        inquirer
            .prompt([{
                    type: "list",
                    message: "Please select the role you want to delete o: ",
                    choices: await roleDb.getAllRoleTitle(connection),
                    name: "title"
                }

            ])
            .then(async answer => {
                console.group(answer);
                console.log("Deleting a  role...\n");
                const newRole = answer.title;
                roleDb.deleteRole(connection, {
                        title: newRole
                    })
                    .then(res => {
                        console.log(res.affectedRows + " role deleted!\n")
                        start();
                    });
            });
    };
    deleteEmployee = async () => {
        inquirer
            .prompt({
                type: "list",
                message: "Please select the employee to delete: ",
                choices: await employeesDb.getAllEmp(connection)
                .then(res => res.map( emp => emp.id + " " + emp.first_name + " " +emp.last_name  )),
                name: "employee"
            }).then(async answer => {
                console.log("Deleting selected employee...\n");
                const emp = answer.employee
                const employeeId  = emp.split(" ")[0];
                employeesDb.deleteemp(connection,employeeId).then(res=>{
                    console.log(res.affectedRows + " employee deleted!\n");
                    start();  
                })
               
            });
    };
};

updateEmployeeRole = async () => {
    inquirer
        .prompt([{
                type: "list",
                message: "Please select the employee you'd like to update: ",
                choices: await employeesDb.getAllEmp(connection)
                .then(res => res.map( emp => emp.id + " " + emp.first_name + " " +emp.last_name  )),
                name: "employee"
            },
            {
                type: "list",
                message: "Please select the role to update of previously selected employe: ",
                choices: await roleDb.getAllRoles(connection)
                .then(res => res.map( role => role.id + " " + role.title )),
                name: "role"
            }
        ])
        .then(async answer => {
            const emp = answer.employee
            const employeeId  = emp.split(" ")[0];
            const selectedRole = answer.role
            const roleId  = selectedRole.split(" ")[0];
            employeesDb.updateEmployeeRole(connection,roleId,employeeId).then(res=>{
                console.log(res.affectedRows + " employee updated!\n")
                    start();
            })
        });
};

updateManager = async () => {
    inquirer
        .prompt([{
                type: "list",
                message: "Please select the [EMPLOYEE] you'd like to update: ",
                choices: await employeesDb.getAllEmp(connection)
                .then(res => res.map( emp => emp.id + " " + emp.first_name + " " + emp.last_name  )),
                name: "employee"
            },
            {
                type: "list",
                message: "Please select the employee's updated [MANAGER] (Or [NONE] if there isn't one): ",
                choices: await employeesDb.getAllManager(connection).then(res => {
                     const manager = res.map(emp => emp.id + " " + emp.first_name + " " + emp.last_name)
                     console.log(manager)
                     manager.push("None")
                     return manager;
                }),
                name: "manager"
            }
        ])
        .then(async answer => {
            console.log("Updating employee's manager...\n")
            const emp = answer.employee
            const employeeId  = emp.split(" ")[0];
            let  newManagerID; 
            if(answer.manager === "None"){
                newManagerID = null;
            }else{
                newManagerID =  answer.manager.split(" ")[0];
            } ;
            employeesDb.updateManager(connection,newManagerID,employeeId).then(res=>{
                console.log(res.affectedRows + " employee updated!\n")
                start();
            })
           
        });
};