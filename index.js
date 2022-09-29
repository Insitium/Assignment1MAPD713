var seneca = require('seneca')().use('product-management')
seneca.use('seneca-entity');
var products = {
    product:"Laptop",
    price:"201.99",
    category:"PC"
}
function add_product(){
    seneca.act({role:'products',cmd:'add',data:products},function(err,msg){
        console.log(msg);
    });
}
add_product();