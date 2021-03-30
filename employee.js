
const mysql = require('mysql');
const inquirer = require('inquirer');
var AsciiTable = require('ascii-table');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: process.env.DB_PASSWORD,
    database: 'employee_manageDB',
});

const startingQuestion = () => {
    inquirer
        .prompt({
            name: 'startQuestion',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View all employees', 'View departments', 'View roles'],
        })
        // SWTICH CASE HERE
        .then((answer) => {
            if (answer.startQuestion === 'View all employees') {
                allEmployees();
            } else if (answer.startQuestion === 'View departments') {
                departments();
            } else if (answer.startQuestion === 'View roles') {
                roles();
            } else {
                connection.end();
            }
        });
};

const allEmployees = () => {
    const query = connection.query(
        'SELECT * FROM employee', (err, res) => {
            if (err) throw err;
            let table = new AsciiTable()
            table
                .setHeading('First Name', 'Last Name', 'Role ID', 'Manager ID')

            res.forEach(({ first_name, last_name, role_id, manager_id }) => {
                table.addRow(first_name, last_name, role_id, manager_id);
            })

            console.log(table.toString())
            inquirer.prompt([
                {
                    name: 'actionSelect',
                    type: 'list',
                    message: 'What would you like to do with the employee data?',
                    choices: ['View all employees', 'Add employee', 'Update employee role', 'Remove employee'],
                }
            ])
                // SWITCH CASE HERE
                .then((answer) => {
                    if (answer.actionSelect === 'View all employees') {
                        allEmployees();
                    } else if (answer.actionSelect === 'Add employee') {
                        addEmployee();
                    } else if (answer.actionSelect === 'Update employee role') {
                        updateRole();
                    } else if (answer.actionSelect === 'Remove employee') {
                        removeEmployee();
                    } else if (answer.actionSelect === 'View employees by manager') {
                        managerEmployees();
                    } else {
                        connection.end();
                    }
                });
        }
    );
    console.log(query.sql);

}

const departments = () => {
    const query = connection.query(
        'SELECT * FROM department', (err, res) => {
            if (err) throw err;
            let departmentTable = new AsciiTable()
            departmentTable
                .setHeading('Department Name')

            res.forEach(({ department_name }) => {
                departmentTable.addRow(department_name);
            })
            console.log(query.sql);
            console.log(departmentTable.toString())

            inquirer
                .prompt([
                    {
                        name: 'departmentChoice',
                        type: 'list',
                        message: 'What would you like to do?',
                        choices: ['Add department', 'Delete department', 'Exit']
                    }
                ])
                .then((answer) => {
                    if (answer.departmentChoice === 'Add department') {
                        addDepartment();
                    } else if (answer.departmentChoice === 'Delete department') {
                        removeDepartment();
                    } else {
                        startingQuestion();
                    }
                });
        }
    );
};

const roles = () => {
    const query = connection.query(
        'SELECT * FROM role', (err, res) => {
            if (err) throw err;
            let rolesTable = new AsciiTable()
            rolesTable
                .setHeading('Title', 'Salary', 'Department ID')

            res.forEach(({ title, salary, department_id }) => {
                rolesTable.addRow(title, salary, department_id);
            })
            console.log(query.sql);

            console.log(rolesTable.toString());

            inquirer
                .prompt([
                    {
                        name: 'roleChoice',
                        type: 'list',
                        message: 'What would you like to do?',
                        choices: ['Add role', 'Delete role', 'Exit']
                    }
                ])
                .then((answer) => {
                    if (answer.roleChoice === 'Add role') {
                        addRoles();
                    } else if (answer.roleChoice === 'Delete role') {
                        removeRole();
                    } else {
                        startingQuestion();
                    }
                });
        }
    )
};

const addEmployee = () => {
    inquirer
        .prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the first name of the employee you would like to add?',
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the last name of the employee you would like to add?',
            },
            {
                name: 'roleID',
                type: 'input',
                message: 'What is their role id?',
            },
            {
                name: 'managerID',
                type: 'input',
                message: 'What is their manager id?',
            },
        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.roleID,
                    manager_id: answer.managerID
                },
                (err) => {
                    if (err) throw err;
                    console.log('You successfully added an employee!');
                    startingQuestion();
                }
            );
        });
}

const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'departmentName',
                type: 'input',
                message: 'What is the name of the department you would like to add?',
            },
        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO department SET ?',
                {
                    department_name: answer.departmentName
                },
                (err) => {
                    if (err) throw err;
                    console.log('You successfully added a department!');
                    startingQuestion();
                }
            );
        });
}

const addRoles = () => {
    inquirer
        .prompt([
            {
                name: 'roleName',
                type: 'input',
                message: 'What is the name of the role you would like to add?',
            },
            {
                name: 'roleSalary',
                type: 'input',
                message: 'What is the salary you would like to add?',
            },
            {
                name: 'roleDepartment',
                type: 'input',
                message: 'What is the department ID you would like to add?',
            },
        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.roleName,
                    salary: answer.roleSalary,
                    department_id: answer.roleDepartment
                },
                (err) => {
                    if (err) throw err;
                    console.log('You successfully added a role!');
                    startingQuestion();
                }
            );
        });
};

const updateRole = () => {
    const query = connection.query(
        'SELECT * FROM employee', (err, res) => {
            if (err) throw err;
            let table = new AsciiTable()
            table
                .setHeading('First Name', 'Last Name', 'Role ID', 'Manager ID')

            res.forEach(({ first_name, last_name, role_id, manager_id }) => {
                table.addRow(first_name, last_name, role_id, manager_id);
            })
            console.log(query.sql);

            console.log(table.toString())
            // 
        })
    inquirer.prompt([
        {
            name: 'employee',
            type: 'number',
            message: "Enter current employee ID"
        },
        {
            name: 'newRole',
            type: 'number',
            message: "What is the employee's updated role ID?"
        }
    ])
        .then((answer) => {

            console.log('Updating employees...\n');
            connection.query(
                'UPDATE employee SET ? WHERE ?',
                [
                    {
                        role_id: answer.newRole,
                    },
                    {
                        role_id: answer.employee
                    }
                ],
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} employee information updated!\n`);
                    startingQuestion();
                    // console.log(query.sql);

                }
            );
        })
};

const removeEmployee = () => {
    inquirer.prompt([
        {
            name: 'removeID',
            type: 'input',
            message: 'What is the role ID of the employee you would like to remove?'
        },
    ])
        .then((answer) => {

            console.log('Deleting employee...\n')
            connection.query(
                'DELETE FROM employee WHERE ?',
                {
                    role_id: answer.removeID
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} employee deleted!\n`);
                    startingQuestion();
                }
            );
        });
};

const removeRole = () => {
    inquirer.prompt([
        {
            name: 'removeTitle',
            type: 'input',
            message: 'What is the title of the role you would like to remove?'
        },
    ])
        .then((answer) => {

            console.log('Deleting role...\n')
            connection.query(
                'DELETE FROM role WHERE ?',
                {
                    title: answer.removeTitle
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} role deleted!\n`);
                    startingQuestion();
                }
            );
        });
};

const removeDepartment = () => {
    inquirer.prompt([
        {
            name: 'removeDepartment',
            type: 'input',
            message: 'What is the department you would like to remove?'
        },
    ])
        .then((answer) => {

            console.log('Deleting department...\n')
            connection.query(
                'DELETE FROM department WHERE ?',
                {
                    department_name: answer.removeDepartment
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} department deleted!\n`);
                    startingQuestion();
                }
            );
        });
};


connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    startingQuestion();
});
