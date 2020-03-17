const mysql=require("mysql");
const inquirer=require("inquirer");



var connection=mysql.createConnection({
   host:"localhost" ,
   port:"3306",
   user:"root",
   password:"password",
   database:"employeesDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
  start();
  });

  start=()=>{
      inquirer.prompt({
         type:"list",
          message:" What would you like to do?",
          name:"option",
          choices:["ADD","VIEW","UPDATE","DELETE","DONE"]
      }).then(answer=>{
          const option=answer.option;
          switch(option){
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
  add_data=()=>{
      inquirer.prompt({
        type:"list",
        message:"In which table you like to add?",
        name:"option",
        choices:["employee","role","departments","DONE"]
      }).then(answer=>{
         const option=answer.option;
         switch(option){
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
  view_data=()=>{
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
          viewDepartment();
          break;
        case "role":
          viewRole();
          break;
        case "employee":
          viewEmployee();
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
            updateRole();
            break;
          case "MANAGER":
            updateManager();
            break;
          case "DONE":
            start();
            break;
        };
      });
  };{
   

  delete_data=()=>{
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
          .prompt([
            {
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
              choices: await getAllRoleTitle(),
              name: "role"
            },
            {
              type: "list",
              message: "Please select the manager of the employee or no if there isn't one: ",
              choices: await managerQuery(),
              name: "manager"
            }])
          .then(async answer => {
            console.log(answer)
            console.log("Inserting a new employee...\n");
            const firstName = answer.firstName;
            const lastName = answer.lastName;
            
            const roleId = await getRoleIdByTitle(answer.role);
            const managerId = answer.manager === "None" ? null : await managerIdQuery(answer.manager);
            const query = connection.query("INSERT INTO employee SET ?",
              {
                first_name: firstName,
                last_name: lastName,
                role_id: roleId,
                manager_id: managerId
              }, (err, res) => {
                if (err) throw err;
                console.log(res.affectedRows + " employee added!\n")
                start();
              });
            console.log(query.sql);
            
          });
      };
      getAllRoleTitle = () => {
        return new Promise((resolve, reject) => {
            const roleArr = [];
            connection.query("SELECT title FROM role", (err, res) => {
              if (err) throw err;
              console.log(res)
              res.forEach(role => {
                roleArr.push(role.title);
                return err ? reject(err) : resolve(roleArr);
              });
            });
          });
     };
     getRoleIdByTitle = (title)=>{
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM role WHERE title=?",title, async (err, res) => {
              if (err) throw err;
              return err ? reject(err) : resolve(res[0].id);
            });
          });
     };
     managerQuery = () => {
        return new Promise((resolve, reject) => {
          const managerArr = ["None"]
          connection.query('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employee, role.title FROM employee INNER JOIN role ON employee.role_id = role.id WHERE role.title = "General Manager" OR role.title = "Assistant Manager" OR role.title = "Sales Lead" OR role.title = "HR Specialist"', (err, res) => {
            if (err) throw err;
            console.log(res);
            res.forEach(manager => {
              managerArr.push(manager.employee);
              return err ? reject(err) : resolve(managerArr);
            });
          })
        });
      };
      managerIdQuery = manager => {
        return new Promise((resolve, reject) => {
          connection.query('SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name)=?', manager, async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res[0].id);
          });
        });
      };

      addRole = async () => {
        inquirer
          .prompt([
            {
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
            }])
          .then(async answer => {
            console.log("Inserting a new role...\n");
            const newRole = answer.title;
            const newSalary = answer.salary;
            const departmentId = await getDepartmentIdByname(answer.department);
            const query = connection.query("INSERT INTO role SET ?",
              {
                title: newRole,
                salary: newSalary,
                department_id: departmentId
              }, (err, res) => {
                if (err) throw err;
                console.log(res.affectedRows + " role added!\n")
                start();
              });
            console.log(query.sql);
            
          });
      };
      departmentQuery= () => {
        return new Promise((resolve, reject) => {
          const departmentArr = [];
          connection.query("SELECT department_name FROM departments" , (err, res) => {
            if (err) throw err;
            console.log(res);
            res.forEach(department => {
                departmentArr.push(department.department_name);
                return err ? reject(err) : resolve(departmentArr);
              });
            });
          
        });
      };
      getDepartmentIdByname = (name)=>{
        return new Promise((resolve, reject) => {
            connection.query("SELECT id FROM departments WHERE department_name=?",name, async (err, res) => {
              if (err) throw err;
              return err ? reject(err) : resolve(res[0].id);
            });
          });
     };
     addDepartment = async () => {
        inquirer
          .prompt([
            {
              type: "input",
              message: "Please enter the name of the department: ",
              name: "name"
            },
           
            ])
          .then(async answer => {
              console.group(answer);
            console.log("Inserting a new department...\n");
            const newDepartment = answer.name;
            
            
            const query = connection.query("INSERT INTO departments SET ?",
              {
                department_name :newDepartment
              }, (err, res) => {
                if (err) throw err;
                console.log(res.affectedRows + " department added!\n")
                start();
              });
            console.log(query.sql);
            
          });
      };
      viewDepartment=()=>{
          const query="SELECT * FROM departments"
          connection.query(query,(err,res)=>{
          if(err) throw err;
          console.table(res);
          
          } );
         
      };
      viewRole=()=>{
        const query="SELECT * FROM role"
        connection.query(query,(err,res)=>{
        if(err) throw err;
        console.table(res);
        
        } );
       
    }
    viewEmployee=()=>{
        const query="SELECT * FROM employee"
        connection.query(query,(err,res)=>{
        if(err) throw err;
        console.table(res);
        
        } );
       
    }
   
    viewEmployeesByManager = async () => {
        inquirer
          .prompt({
            type: "list",
            message: "Select a MANAGER to view employees (or NONE to see unmanaged employees): ",
            choices: await managerQuery(),
            name: "manager"
          })
          .then(async answer => {
            const managerId = answer.manager === "None" ? null : await managerIdQuery(answer.manager);
            if (managerId === null) {
              connection.query("SELECT CONCAT(first_name, ' ', last_name) as employees FROM employee where manager_id is null", (err, res) => {
                if (err) throw err;
                console.table(res);
               
                start();
              })
            } else {
              connection.query("SELECT CONCAT(first_name, ' ', last_name) as employees FROM employee where manager_id=?", [managerId], (err, res) => {
                if (err) throw err;
                console.log()
                if (res.length < 1) {
                  console.log("No employees to show!");
                 
                  
                  start();
                } else {
                  console.table(res);
                 
                  
                  start();
                }
              });
            };
          });
      };
      deleteDepartment = async () => {
        inquirer
          .prompt([
            {
              type: "input",
              message: " Enter the name of the department which you want to delete: ",
              name: "name"
            },
           
            ])
          .then(async answer => {
              console.group(answer);
            console.log("Deleting a  department...\n");
            const newDepartment = answer.name;
            
            
            const query = connection.query("DELETE FROM departments WHERE ?",
              {
                department_name :newDepartment
              }, (err, res) => {
                if (err) throw err;
                console.log(res.affectedRows + " department deleted!\n")
                start();
              });
            console.log(query.sql);
            
          });
      };
      deleteRole= async () => {
        inquirer
          .prompt([
            
            {
                type: "list",
                message: "Please select the role you want to delete o: ",
                choices: await departmentQuery(),
                name: "department"
            }
           
            ])
          .then(async answer => {
              console.group(answer);
            
              console.log("Deleting a  role...\n");
              const newRole = answer.title;
              
            
              const query = connection.query("DELETE  FROM role WHERE ?",
                {
                  title: newRole,
                 
                 }, (err, res) => {
                  if (err) throw err;
                  console.log(res.affectedRows + " role deleted!\n")
                  start();
                });
             // console.log(query.sql);
          });
      };
      deleteEmployee = async () => {
        inquirer
          .prompt({
            type: "list",
            message: "Please select the employee to delete: ",
            choices: await getAllRoleTitle(),
            name: "employee"
          }).then(async answer => {
            console.log("Deleting selected employee...\n");
            const employeeId = await  getRoleIdByTitle(answer.employee);
            const query = connection.query("DELETE FROM employee WHERE id=?", [employeeId], (err, res) => {
              if (err) throw err;
              console.log(res.affectedRows + " employee deleted!\n");
              start();
            });
            console.log(query.sql);
            
          });
      };

