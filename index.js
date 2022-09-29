
var plugin = function(options){
    var seneca = this;

    seneca.add({role:'products', cmd:'add'},function(msg, respond){
        this.make('products').data$(msg.data).save$(respond);
    });

    seneca.add({role:'products', cmd:'get'},function(msg, respond){
        this.make('products').load$(msg.data.user_id, respond);
    });
    seneca.add({role:'products', cmd:'get-all'},function(msg, respond){
        this.make('products').list$({},respond);
    });
    seneca.add({role:'products', cmd:'delete'},function(msg, respond){
        this.make('products').remove$(msg.data.user_id, respond);
    });
}
module.exports = plugin;

var seneca = require('seneca')()
seneca.use('seneca-entity');
seneca.use(plugin);

seneca.add('role:api, cmd:add-product',function(args,done){
    console.log("-->cmd: add-product");
    var products = {
        product:args.product,
        price:args.price,
        category:args.category
    }
    console.log("--> products "+JSON.stringify(products));
    seneca.act({role:'products',cmd:'add',products},function(err,msg){
        console.log(msg);
        done(err,msg);
    });
});

seneca.add('role:api, cmd:get-all-products',function(args, done){
    console.log("--> cmd:get-all-products");
    seneca.act({role:'products',cmd: 'get-all'},function(err,msg){
        console.log(msg);
        done(err,msg);
    });
});
eneca.add('role:api, cmd:get-product',function(args, done){
    console.log("--> cmd:get-product,args.user_id: "+args.user_id);
    seneca.act({role:'products',cmd: 'get',data:{user_id: args.user_id}},function(err,msg){
        console.log(msg);
        done(err,msg);
    });
});
seneca.add('role:api,cmd:delete-all-products',function(args,done){
    done(null,{cmd:"delete-all-products"});
});

seneca.act('role:web',{
    use:{
        prefix:'/prod',
        pin:{role:'api',cmd:'*'},
        map:{
            'add-product':{GET:true,POST:true},
            'get-all-products':{GET:true},
            'get-product':{GET:true, },
            'delete-product':{GET:true, }
        }
    }
})

let countGET =0;
let countPOST = 0;

function countMiddleware(req,res,next){
    if(req.method === "GET")countGET++;
    if(req.method === "POST")countPOST++;
    console.log("Processed Request Count--> Get: "+ countGET+" , Post: "+ countPOST);
    if(next)next();
}
var express = requrie('express');
var app = express();
//app.use(countMiddleware);
app.use(requrie("body-parser").json())
app.use(seneca.export('web'));

app.listen(3000)
console.log("Server Listening on localhost: 3000 ...");
console.log("--------requests--------------------");
console.log("http://localhost:3000/prod/add-product?product=mobile&price=300&category=phone");
console.log("http://localhost:3000/prod/get-all-products");
console.log("http://localhost:3000/prod/get-product?user-id=1245");
console.log("http://localhost:3000/prod/delete-product?user-id = 1245");