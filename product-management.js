

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