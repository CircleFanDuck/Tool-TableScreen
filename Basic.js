
  function bindOperation(e, btn, eventName){
		if(btn.filter(':disabled').length>0&&!window.bindOperationBlock){
	        return;
	    }
	    
	    var tips = $(btn).attr('tips');
	    var func = $(btn).attr('operation');
	    if(!func){
	        func = null;
	    }else{
	        var funcList = func.split(',')
	        func = [];
	        
	        var funcArr = window[eventName];
	        for(var i=0; funcArr&&i<funcList.length; i++){
	           if(funcArr[funcList[i]]){
	               func.push(funcArr[funcList[i]]);
	           }
	        }
	    }
	    
	    if(!func||func.length==0){
	        return;
	    }
	    
	    btn.attr('blockReg', func.length);
	    btn.attr('disabled','true');
	    if(tips!=undefined&&tips!=null&&tips!=''){
	        btn.after('<span id = "operationTip">'+tips+'</span>');
	    }
	    
	    
	    if(btn.attr('block')){
	        window.bindOperationBlock = true;
	    }
	    for(var j=0; j<func.length; j++){
			(function(func){
			    setTimeout(function(){
			    	func(btn, function(btn){
						btn.attr('blockReg', btn.attr('blockReg')*1-1);
						if(btn.attr('blockReg')==0){
						    btn.parent().find('#operationTip').remove();
					    	btn.removeAttr('disabled');
					    	window.bindOperationBlock = false;
						}
				    })
			    }, 10);
			})(func[j]);
		}
	}
	
    function paraPrepare(base){
        var inputs = base.find('input,select,textarea').filter('[id]');
        var para = {};
        inputs.each(function(){
            para[$(this).attr('id')] = $(this).val();
        })
        return para;
    }
