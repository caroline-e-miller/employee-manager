const mysql = require('mysql');
var AsciiTable = require('ascii-table');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password: '',
    database: 'employeeDB',
});

// view all employees / view employees by department / view all employees by manager / add employee / remove employee / update employee role / update employee manager

const startingQuestion = () => {
    inquirer
        .prompt({
            name: 'startQuestion',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View all employees', 'View employees by department', 'View employees by manager', 'Add employee', 'Remove employee', 'Update employee role', 'Update employee manager'],
        })
        .then((answer) => {
            // based on their answer, either call the bid or the post functions
            if (answer.startQuestion === 'View all employees') {
                allEmployees();
            } else if (answer.startQuestion === 'View employees by department') {
                departmentEmployees();
            } else if (answer.startQuestion === 'View employees by manager') {
                managerEmployees();
            } else if (answer.startQuestion === 'Add employee') {
                addEmployee();
            } else if (answer.startQuestion === 'Remove employee') {
                removeEmployee();
            } else if (answer.startQuestion === 'Update employee role') {
                updateRole();
            } else if (answer.startQuestion === 'Update employee manager') {
                updateManager();
            } else {
                connection.end();
            }
        });
};

const allEmployees = () => {
    const query = connection.query(
        'SELECT * FROM employee', (err, res) => {
            if (err) throw err;
            res.forEach(({ first_name, last_name, role_id, manager_id }) => {
                console.log(`${first_name} | ${last_name} | ${role_id} | ${manager_id}`);
            })
        }
    );
    console.log(query.sql);
    connection.end();

    inquirer.prompt([
        {
            name: 'actionSelect',
            type: 'list',
            message: 'What would you like to do with the employee data?',
            choices: ['View all employees', 'View departments', 'View roles', 'Add employee', 'Add department', 'Add role', 'Update employee role', 'Remove employee'],
        }
    ])
        .then((answer) => {
            // based on their answer, either call the bid or the post functions
            if (answer.startQuestion === 'View all employees') {
                allEmployees();
            } else if (answer.startQuestion === 'View departments') {
                departments();
            } else if (answer.startQuestion === 'View roles') {
                roles();
            } else if (answer.startQuestion === 'Add employee') {
                addEmployee();
            } else if (answer.startQuestion === 'Add department') {
                addDepartment();
            } else if (answer.startQuestion === 'Add role') {
                addRole();
            } else if (answer.startQuestion === 'Update employee role') {
                updateRole();
            } else if (answer.startQuestion === 'Remove employee') {
                removeEmployee();
            } else {
                connection.end();
            }
        });
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
    connection.end();
};

const roles = () => {
    const query = connection.query(
        'SELECT * FROM role', (err, res) => {
            if (err) throw err;
            res.forEach(({ department_name }) => {
                console.log(`${department_name}`);
            })
        }
    );
    console.log(query.sql);
    connection.end();
};

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
