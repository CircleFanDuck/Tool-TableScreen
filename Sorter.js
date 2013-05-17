(function(exports){
    var SortHandle = new Class;
    SortHandle.include({
        getSortArr: function(domRoot, sortName, sortFactory){
  		var sortVal = [];
			var eles = domRoot.find('['+sortName+']');
			if ($.isArray(sortFactory)){
			    sortVal = sortFactory;
			} else{
				eles.each(function(){
				    var ele = $(this);
				    var val = $(ele).attr(sortName);
				    sortVal.push(val);
				})
				
				if($.isFunction(sortFactory)){
			        sortVal = sortFactory(sortVal);
				} else {
			        sortVal = $(sortVal).sort();
				}
			}
			
			var filterFactory = function (sortName){
			    return function(sortVal){ 
			        return '['+sortName+'="'+sortVal+'"]';
			    }
			}
			
			this.sortDomByAttr(domRoot, eles, sortVal, filterFactory(sortName));
        },
		sortDomByAttr: function(domRoot, eles, sortVal, filter){
			for(var i=0; sortVal[i]; i++){
			    var f = filter(sortVal[i]);
			    domRoot.append(eles.filter(f));
			}
		}
    });

	exports.prototype.order = function(sortName, sortFactory){
	    var domRoot = $(this);
	    var s = new SortHandle();
	    domRoot.each(function(){
	        s.getSortArr($(this), sortName, sortFactory);
	    })
	    return domRoot;
	}
})($);
