var mysql = require('mysql');
var inquirer = require('inquirer');
var divider = "***---------------------------------***";


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "flute0207",
    database: "bamazon"
  });
  

connection.connect(function(err) {
    if (err) throw err;
    console.log(divider);
    inquire();
  });

  function inquire(){
    inquirer.prompt([{
        type: 'list',
        message: 'Hey there, you Super Supervisor! \nWhat do you need to do today?',
        name: 'command',
        choices: ['View product sales by department', 'Create a new department'],
        validate: function(answer){
            if(answer.length<1){
                return 'You must choose an option, you are at work after all...'
            }
            return true;
            }
        }
    ])
    .then(answer=>{
        switch(answer.command){
            case 'View product sales by department':
            profit();
            break;
  
            case 'Create a new department':
            createDepartment();
            break;
        }
    })
    }

  function profit(){
    connection.query("SELECT departments.department_id, products.department_name, products.product_sales, departments.over_head_costs, (products.product_sales - departments.over_head_costs) AS total_profit FROM products INNER JOIN departments ON products.department_name=departments.department_name GROUP BY department_name ORDER BY SUM(product_sales) DESC", function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(divider);
        connection.end();
    });
  }

  function createDepartment(){
    console.log("Yeah...working on that...");
    connection.end();
  }