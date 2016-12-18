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

promptUser();

function promptUser(){

    inquirer.prompt([
        {
            name: "choice",
            choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"],
            message:"Choose",
            type:"list"

        }
    ]).then(handleUserChoice)
}


function handleUserChoice(ans){
 
 switch (ans.choice){
     case "View Products for Sale":{
         viewProducts();
         break;
     }
     case "View Low Inventory":{
         lowInventory();
         break;
     }
     case "Add to Inventory":{
         addInventory();
         break;
     }
     case "Add New Product":{
         addProduct();
         break;
     }
 }

}


function addProduct(){

    inquirer.prompt([
        {
            name: "name",
            message:"Enter name",
            type:"input"
        },
         {
            name: "dep",
            message:"Enter department: ",
            type:"input"
        },
         {
            name: "price",
            message:"Enter price: ",
            type:"input"
        },
         {
            name: "quantity",
            message:"Enter quantity: ",
            type:"input"
        }
    ]).then(addTodb);
}

function addTodb(ans){

    
connection.query("insert into products (product_name , department_name, price, stock_quantity) values (? , ? , ? , ?); ", [ans.name, ans.dep, ans.price, ans.quantity], function(err, res){
        if(err){
            throw err;
        }
        else{
            console.log("Added");
        }
});
}


function addInventory(){
    

    inquirer.prompt([
        { 
            name: "name",
            message:"Enter name of product: ", 
            type:"input"
        },
        {
            name: "amount",
            message:"Enter amount to add: ",
            type:"input"
        }
    ]).then(getCurrentAmount);
}

function handleAddInventory(qua, name){


connection.query("update products SET stock_quantity=? WHERE product_name=?",[qua, name], function(err, res){
        if(err){
            throw err;
        }

promptUser();

});



}

function getCurrentAmount(ans){

connection.query("select stock_quantity from products where product_name = ?",[ans.name], function(err, res){
        if(err){
            throw err;
        }

    var addQuantity =  parseInt(res[0].stock_quantity) + parseInt(ans.amount);

console.log(res[0].stock_quantity);
        handleAddInventory(addQuantity ,ans.name);


});

}

function viewProducts(){

    
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

promptUser();

     
    });
}

function lowInventory(){

connection.query("select * from products where stock_quantity < 5", function(err, res){
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

promptUser();
     
    });
}



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
   prom
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