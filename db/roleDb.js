const mysql = require("mysql");

const getAllRoleTitle = (connection) => {
    return new Promise((resolve, reject) => {
        const roleArr = [];
        connection.query("SELECT title FROM role", (err, res) => {
            if (err) throw err;
            console.log(res)
            res.forEach(role => {
                roleArr.push(role.title);
            });
            return err ? reject(err) : resolve(roleArr);
        });
    });
}

const getRoleIdByTitle = (connection , title) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM role WHERE title=?", title, async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res[0].id);
        });
    });
}

const createRole = (connection, role) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO role SET ?", role, async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res);
        })
    });
}

const getAllRoles = (connection) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM role", async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res);
        })
    });
}

const deleteRole = (connection ,input ) => {
    return new Promise((resolve, reject) => {
        connection.query("DELETE  FROM role WHERE ?", input, async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res);
        })
    });
}


module.exports = {
    getAllRoleTitle: getAllRoleTitle,
    getRoleIdByTitle: getRoleIdByTitle,
    createRole : createRole,
    getAllRoles: getAllRoles,
    deleteRole: deleteRole
}