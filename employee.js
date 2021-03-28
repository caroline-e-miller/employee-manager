// write addRole function
// ask about undeveloped 'no'
const mysql = require('mysql');
const inquirer = require('inquirer');
var AsciiTable = require('ascii-table');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password: 'thisIsMySQL2021a2*',
    database: 'employee_manageDB',
});

// view all employees / view employees by department / view all employees by manager / add employee / remove employee / update employee role / update employee manager

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
            // based on their answer, either call the bid or the post functions
            if (answer.startQuestion === 'View all employees') {
                allEmployees();
            } else if (answer.startQuestion === 'View departments') {
                departments();
            } else if (answer.startQuestion === 'View roles') {
                roles();
                // } else if (answer.startQuestion === 'Add employee') {
                //     addEmployee();
                // } else if (answer.startQuestion === 'Add department') {
                //     addDepartment();
                // } else if (answer.startQuestion === 'Add role') {
                //     addRole();
                // } else if (answer.startQuestion === 'Update employee role') {
                //     updateRole();
                // } else if (answer.startQuestion === 'Remove employee') {
                //     removeEmployee();
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
                    choices: ['View all employees', 'Add employee', 'Update employee role', 'View employee by manager', 'Remove employee'],
                }
            ])
                // SWITCH CASE HERE
                .then((answer) => {
                    // based on their answer, either call the bid or the post functions
                    if (answer.actionSelect === 'View all employees') {
                        allEmployees();
                        // } else if (answer.startQuestion === 'View departments') {
                        //     departments();
                        // } else if (answer.startQuestion === 'View roles') {
                        //     roles();
                    } else if (answer.actionSelect === 'Add employee') {
                        addEmployee();
                        // } else if (answer.startQuestion === 'Add role') {
                        //     addRole();
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
    //connection.end();

}

const departments = () => {
    const query = connection.query(
        'SELECT * FROM department', (err, res) => {
            if (err) throw err;
            res.forEach(({ department_name }) => {
                console.log(`${department_name}`);
            })
        }
    );
    console.log(query.sql);

    inquirer.prompt([
        {
            name: 'addDepartment',
            type: 'list',
            message: 'Would you like to add a department?',
            choices: ['Yes', 'No']
        }
    ])
        .then((answer) => {
            if (answer.addDepartment === 'Yes') {
                return addDepartment();
            } else {
                return startingQuestion();
            }
            // based on their answer, either call the bid or the post functions
            // if (answer.actionSelect === 'View all employees') {
            //     allEmployees();
            //     // } else if (answer.startQuestion === 'View departments') {
            //     //     departments();
            //     // } else if (answer.startQuestion === 'View roles') {
            //     //     roles();
            // } else if (answer.actionSelect === 'Add employee') {
            //     addEmployee();
            //     // } else if (answer.startQuestion === 'Add role') {
            //     //     addRole();
            // } else if (answer.actionSelect === 'Update employee role') {
            //     updateRole();
            // } else if (answer.actionSelect === 'Remove employee') {
            //     removeEmployee();
            // } else if (answer.actionSelect === 'View employees by manager') {
            //     managerEmployees();
            // } else {
            //     connection.end();
            // }
        });


    // if (answer.addDepartment === 'Yes') {
    //     return addDepartment();
    // } else {
    //     return startingQuestion();
    // }
    // connection.end();
};

const roles = () => {
    const query = connection.query(
        'SELECT * FROM role', (err, res) => {
            if (err) throw err;
            res.forEach(({ role_id }) => {
                console.log(`${role_id}`);
            })
        }
    )
    console.log(query.sql)

    inquirer
        .prompt([
            {
                name: 'addRole',
                type: 'list',
                message: 'Would you like to add an employee role?',
                choices: ['Yes', 'No']
            }
        ])
        .then((answer) => {
            // when finished prompting, insert a new item into the db with that info
            if (answer.addRole === 'Yes') {
                addRoles();
            } else {
                startingQuestion();
            }
        });


    // inquirer
    //     .prompt([
    //         {
    //             name: 'addRole',
    //             type: 'list',
    //             message: 'Would you like to add an employee role?',
    //             choice: ['Yes', 'No']
    //         }
    //     ]);
    // if (answer.addRole === 'Yes') {
    //     addRole();
    // } else {
    //     startingQuestion();
    // }
    // connection.end();
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
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                'INSERT INTO employee SET ?',
                // QUESTION: What does the || 0 do?
                {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: answer.roleID,
                    manager_id: answer.managerID
                },
                (err) => {
                    if (err) throw err;
                    console.log('You successfully added an employee!');
                    // re-prompt the user for if they want to bid or post
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
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                'INSERT INTO department SET ?',
                // QUESTION: What does the || 0 do?
                {
                    department_name: answer.departmentName
                },
                (err) => {
                    if (err) throw err;
                    console.log('You successfully added a department!');
                    // re-prompt the user for if they want to bid or post
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
        ])
        .then((answer) => {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                'INSERT INTO role SET ?',
                // QUESTION: What does the || 0 do?
                {
                    title: answer.roleName
                },
                (err) => {
                    if (err) throw err;
                    console.log('You successfully added a role!');
                    // re-prompt the user for if they want to bid or post
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
            message: "Enter Employee ID"
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
                ], { id: answer.employee },
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
            name: 'removeFirstName',
            type: 'input',
            message: 'What is the first name of the employee you would like to remove?'
        },
        {
            name: 'removeLastName',
            type: 'input',
            message: 'What is the last name of the employee you would like to remove?'
        }
    ])
    console.log('Deleting employee...\n')

        .then((answer) => {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                'DELETE FROM employee WHERE ?',
                {
                    first_name: answer.removeFirstName,
                    last_name: answer.removeLastName
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} employee deleted!\n`);
                    // Call readProducts AFTER the DELETE completes
                    readProducts();
                }
            );
        });


    // connection.query(
    //     'DELETE FROM employee WHERE ?',
    //     {
    //         first_name: answer.removeFirstName,
    //         last_name: answer.removeLastName
    //     },
    //     (err, res) => {
    //         if (err) throw err;
    //         console.log(`${res.affectedRows} products deleted!\n`);
    //         // Call readProducts AFTER the DELETE completes
    //         readProducts();
    //     }
    // );
};

// const managerEmployees = () => {
//     inquirer
//         .prompt({
//             name: 'managerChoice',
//             type: 'input',
//             message: "What manager's employees would you like?",
//         })

// };

// const queryAllEmployeeData = () => {
//     connection.query('SELECT * FROM employees', (err, res) => {
//         if (err) throw err;
//         res.forEach(({ first_name, last_name, role_id, manager_id, department_name, title, salary, department_id, }) => {
//             console.log(`${first_name} | ${last_name} | ${role_id} | ${manager_id}| ${department_name} | ${title} | ${salary} | ${department_id}`);
//         });
//         console.log('-----------------------------------');
//     });
// };

// const queryRole = () => {
//     connection.query('SELECT * FROM employees', (err, res) => {
//         if (err) throw err;
//         res.forEach(({ title, salary, department_id }) => {
//             console.log(`${title} | ${salary} | ${department_id} }`);
//         });
//         console.log('-----------------------------------');
//     });
// };



// const queryDanceSongs = () => {
//   const query = connection.query(
//     'SELECT * FROM songs WHERE genre=?',
//     ['Dance'],
//     (err, res) => {
//       if (err) throw err;
//       res.forEach(({ id, title, artist, genre }) => {
//         console.log(`${id} | ${title} | ${artist} | ${genre}`);
//       });
//     }
//   );

//   // logs the actual query being run
//   console.log(query.sql);
//   connection.end();
// };

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    startingQuestion();
});
