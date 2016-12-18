var mysql = require("mysql");



var inquirer = require("inquirer");


var Table = require('cli-table');

var id;
var quantity;


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "yanish",
  database: "bamazon"


});

connection.query("select * from products", function(err, res){
        if(err){
            throw err;
        }



 
// instantiate 
var table = new Table({
    head: ['Id', 'Name', 'Department', 'Price', 'Quantity']
  , colWidths: [20,20,20,20,20]
});
 
// table is an Array, so you can `push`, `unshift`, `splice` and friends 

for ( var i = 0 ; i < res.length ; i++){
table.push(
    [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price , res[i].stock_quantity]
);
 
}

console.log(table.toString());
     
start();
    });


function start(){

inquirer.prompt([
    {
        name:"id",
        message:"Enter Id: ",
        type:"input"
    }
]).then(howMuch);
}

function howMuch(ans){

id  = ans.id;
inquirer.prompt([
     {
        name:"quantity",
        message: "Enter Quantity: ",
        type:"input"
    }
]).then(handleData);

}


function handleData(ans){

quantity = ans.quantity;
 
connection.query("select stock_quantity, price from products where item_id= ? ", [parseInt(id)], function(err, res){

   if(err){
            throw err;
        }
var inStockQuantity  = res[0].stock_quantity;
var price = res[0].price;

console.log(res.stock_quantity);
console.log(res);
if (inStockQuantity < quantity) {
    
console.log("Insufficient quantity!");
    start();
}
else{

var updateQuatity = inStockQuantity - quantity;
    connection.query("update products SET stock_quantity=? WHERE item_id=?;", [parseInt(updateQuatity), id], function(err){

        if (err) {
            console.log(err);
        }
    
console.log("Total cost is " + quantity * (price));



})

}
})
}