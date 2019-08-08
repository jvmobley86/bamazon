var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon",

});
connection.connect(function (err) {
    if (err) throw err;

    inventory();
});
//query database to show all items available for purchase 
function inventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        //prompt user to purchase an item
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "list",
                    choices: function () {
                        var choices = [];
                        for (var i = 0; i < results.length; i++) {
                            choices.push(results[i].product_name);
                        }
                        return choices;
                    },
                    message: "What is the ID of the product you would like to buy?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to buy?"
                }
            ])
            .then(function (answer) {
                var selection;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        selection = results[i];
                    }
                }
                if (selection.stock_quantity < parseInt (answer.quantity)){
                    console.log("Insufficient Quantity!")
                    inventory();
                } else {
                //else if (selection.stock_quantity >= parseInt(answer.quantity)){
                    var purchased = answer.quantity;
                    var total = selection.stock_quantity - purchased;
                    console.log(typeof total,total,selection.item_id)
                    console.log("Thank you for purchasing " + answer.quantity + " " + selection.product_name + "'s!")
                    connection.query("UPDATE products SET ? WHERE ?",
                    
                        [{
                            stock_quantity: total
                        }, 
                        {   item_id: selection.item_id
                        }],  
                    
                    
                        
                        )

                }
            });
    })
}

