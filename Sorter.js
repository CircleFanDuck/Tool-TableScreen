(function(exports){
    var SortHandle = new Class;
    SortHandle.include({
        getElesMap: function(domRoot, sortName){
			var eleFirst = domRoot.find('['+sortName+']:first')
			var eles = $.merge([], eleFirst);
			eles = $.merge(eleFirst, eleFirst.siblings('['+sortName+']'));
			var elesMap = new Object();
			
			for(var i=0; i<eles.length; i++){
			    var ele = $(eles[i]);
			    var key = ele.attr(sortName);
			    if(elesMap[ele.attr(sortName)]==undefined){
			        elesMap[key] = ele;
			    } else {
			        elesMap[key] = $.merge([ele], elesMap[key]);
			    }
			}
			return elesMap;
        },
        getSortArr: function(domRoot, sortName, sortFactory){
			var sortVal = [];
			var elesMap = this.getElesMap(domRoot, sortName);

			if ($.isArray(sortFactory)){
			    sortVal = sortFactory;
			} else{
				$.each(elesMap, function(index, value){
			        sortVal.push(index);
			    }); 
				if($.isFunction(sortFactory)){
				    sortVal = this.sortByCompareFunc(sortVal, sortFactory);
				} else {
			        sortVal = $(sortVal).sort();
				}
			}
			
			this.sortDomByAttr(domRoot, elesMap, sortVal);
        },
		sortByCompareFunc: function(sortVal, sortFactory){
			var sortedVal = [];
			for(var i =0; i<sortVal.length; i++){
			   	var current = sortVal[i];
			   	for(var j=0; j<=sortedVal.length; j++){
			   	    if(j==sortedVal.length){
			   	        sortedVal.push(current);
			   	        break;
			   	    }
			   	    var val = sortedVal[j];
			   	    //val < current
			   	    if(sortFactory(val, current)||sortFactory(val, current)<0){
			   	        sortedVal[j] = current;
			   	        current = val;
			   	    }
			   	}
			}
			return sortedVal;
		},
		sortDomByAttr: function(domRoot, elesMap, sortVal){
			for(var i=0; sortVal[i]; i++){
			    domRoot.append(elesMap[sortVal[i]]);
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
