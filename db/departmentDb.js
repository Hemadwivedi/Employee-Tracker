const mysql = require("mysql");

const getAllDepartment = (connection) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM departments", async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res);
        })
    });
}

const getAllDepartmentName = (connection) => {
    const departmentNames = [];
    return new Promise((resolve, reject) => {
        connection.query("SELECT department_name FROM departments", async (err, res) => {
            if (err) throw err;
            res.forEach(dpt => {
                departmentNames.push(dpt.department_name);
            });
            return err ? reject(err) : resolve(departmentNames);
        })
    });
}
const createDepartment=(connection,department) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO departments SET ?", department, async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res);
        })
    });
}
const getDepartmentIdByName=(connection ,name)=>{
    return new Promise((resolve, reject) => {
        connection.query("SELECT id FROM departments WHERE department_name=?", name, async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res[0].id);
        });
    });
}
const deleteDepartment=(connection,input)=>{
    return new Promise((resolve, reject) => {
        connection.query("DELETE  FROM departments WHERE ?",input , async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res);
        })
    });
}
module.exports = {
    getAllDepartment: getAllDepartment,
    deleteDepartment:deleteDepartment,
    getAllDepartmentName :getAllDepartmentName,
    getDepartmentIdByName:getDepartmentIdByName,
    createDepartment : createDepartment
}