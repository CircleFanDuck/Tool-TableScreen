(function(exports){
    var FilterHandle = new Class;
    FilterHandle.include({
        filter: function(domRoot, subTag, filterFactory, operation){
  		var sortVal = [];
			var eles = domRoot.find(subTag);
			if($.isFunction(filterFactory)){
			    eles.filter(function(){
			        return filterFactory($(this))
			    })
			} else if(typeof filterFactory == 'string'){
			    if(filterFactory!='*'){
			        eles = eles.filter(filterFactory);
			    }
			}
			this.show(domRoot, subTag, eles, operation||{});
        },
        show: function(domRoot, subTag, eles, operation){
            var allEles = domRoot.find(subTag);
            var reg = allEles.filter(':visible').length
            if($.isFunction(operation.hide)){
                hide(allEles);
            }else{
                allEles.hide();
            }
            
            if($.isFunction(operation.show)){
                show(eles);
            }else{
                eles.show();
            }
            if(reg != eles.length){
                domRoot.resize()
            }
        }
    });

	exports.prototype.showFilter = function(subTag, filterFactory, tipFactory, operation){
	    var domRoot = $(this);
	    var f = new FilterHandle();
	    domRoot.each(function(){
	        f.filter($(this), subTag, filterFactory);
	        if($.isFunction(tipFactory))tipFactory($(this));
	    })
	    return domRoot;
	}
})($);
