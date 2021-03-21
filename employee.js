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

const queryAllEmployeeData = () => {
    connection.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;
        res.forEach(({ first_name, last_name, role_id, manager_id, department_name, title, salary, department_id, }) => {
            console.log(`${first_name} | ${last_name} | ${role_id} | ${manager_id}| ${department_name} | ${title} | ${salary} | ${department_id}`);
        });
        console.log('-----------------------------------');
    });
};

const queryRole = () => {
    connection.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;
        res.forEach(({ title, salary, department_id }) => {
            console.log(`${title} | ${salary} | ${department_id} }`);
        });
        console.log('-----------------------------------');
    });
};



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
    //   queryAllSongs();
    //   queryDanceSongs();
});
