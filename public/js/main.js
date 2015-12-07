var J={
    init: function(){
        var actions = {
            togNav: function(){
                $('.header-nav').slideToggle(500);
            }
        };
        $('.header-collaspe').click(actions.togNav);

        try{
            S.init('welcome');
        }catch(e){
            console.log("这不是canvas的页面");
        }
    }
};
J.homepage = (function(){
    return {
        init: function(){

        }
    };
}());

J.init();