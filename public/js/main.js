var J={
    init: function(){
        var actions = {
            togNav: function(){
                $('.header-nav').slideToggle(500);
            }
        };
        $('.header-collaspe').click(actions.togNav);
    }
};
J.homepage = (function(){
    return {
        init: function(){

        }
    };
}());

J.init();