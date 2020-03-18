const mysql = require("mysql");

const getAllEmp = (connection) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM employee", async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res);
        })
    });
};
const getAllManager = (connection) => {
    return new Promise((resolve, reject) => {
        const managerArr = ["None"]
        connection.query('SELECT employee.* FROM employee INNER JOIN role ON employee.role_id = role.id WHERE role.title = "General Manager" OR role.title = "Assistant Manager" OR role.title = "Sales Lead" OR role.title = "HR Specialist"', (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res);
        })
    });
};
const getEmpIdByName = (connection, name) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name)=?', name, async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res[0].id);
        });
    });
}

const getEmpNameWithoutManager = (connection) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT CONCAT(first_name, ' ', last_name) as employees FROM employee where manager_id is null", async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res);
        });
    });
}

const getEmpNameByManagerId = (connection, managerId) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT CONCAT(first_name, ' ', last_name) as employees FROM employee where manager_id=?", [managerId], async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res);
        });
    });
}
const createEmployee = (connection, employee) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO employee SET ?", employee, async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res);
        })
    });
}
const deleteemp = (connection, input) => {
    return new Promise((resolve, reject) => {
        connection.query("DELETE FROM employee WHERE id=?", input, async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res);
        })
    });
}
const updateEmployeeRole = (connection, roleId, employeeId) => {
    return new Promise((resolve, reject) => {
        console.log("Updating employee role...\n");

        const query = connection.query("UPDATE employee SET ? WHERE id=?",
            [{
                    role_id: roleId
                },
                employeeId
            ], async (err, res) => {
                if (err) throw err;
                return err ? reject(err) : resolve(res);
            });

    });
}

const updateManager = (connection, newManagerID, employeeId) => {
    return new Promise((resolve, reject) => {
        console.log("Updating employee's manager...\n");
        connection.query("UPDATE employee SET ? WHERE id=?",
            [{
                    manager_id: newManagerID
                },
                employeeId
            ], async (err, res) => {
                if (err) throw err;
                return err ? reject(err) : resolve(res);
            });


    })
}

module.exports = {
    getAllEmp: getAllEmp,
    getAllManager: getAllManager,
    getEmpIdByName: getEmpIdByName,
    getEmpNameWithoutManager: getEmpNameWithoutManager,
    getEmpNameByManagerId: getEmpNameByManagerId,
    createEmployee: createEmployee,
    deleteemp: deleteemp,
    updateEmployeeRole: updateEmployeeRole,
    updateManager: updateManager
}