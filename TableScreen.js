(function(exports){
	var Class = function(parent){
	    var klass = function(){
	        this.init.apply(this, arguments);
	    }
	    if(parent){
	        var subClass = function(){};
	        subClass.prototype = parent.prototype;
	        klass.prototype = new subClass;
	    }
	    
	    klass.prototype.init = function(){};
	    klass.fn = klass.prototype;
	    klass.fn.parent = klass;
	    
	    klass.extend = function(obj){
	        var extended = obj.extended;
	        for(var i in obj){
	            klass[i] = obj[i];
	        }
	        if(extended) extended(klass);
	    }
	    
	    klass.include = function(obj){
	        var included = obj.included;
	        for(var i in obj){
	            klass.fn[i] = obj[i];
	        }
	        if(included) included(klass);
	    }
	    
	    return klass;
	};
	
	exports.Class = Class;
})(window);


(function(exports){
	var TableScreen = new Class;
	
	TableScreen.include({
	    init: function(tableHeaderId, tableContentId, btnContentId, filterMap){
	        var t = this;
	        t.seqName = filterMap.x;
	        t.headerContent = $('#'+tableHeaderId);
	        t.header = t.headerContent.find('tr:first');
			t.header.find('td').css('position','relative');
	        t.content = $('#'+tableContentId);
	        t.btnContent = $('#'+btnContentId);
	        
	        //bind hide button hover
	        t.header.delegate('td', 'mouseenter', function(){
	            var tip = t.addTips($(this));
	            tip.show();
	        });
	        
	        t.header.delegate('td', 'mouseleave', function(){
	            var tip = t.addTips($(this));
	            tip.hide();
	        });
	        
	        //bind hide button
	        t.header.delegate('.tips', 'click', function(){
	            var headerOfBtn = $(this).parent();
	            t.hide(headerOfBtn);
	        });
	        
	        //bind show button
	        t.btnContent.delegate('.tips', 'click', function(){
	            var tipId = $(this).attr('id');
	            var headerOfBtn = t.header.find('[tipId='+tipId+']');
				t.show(headerOfBtn);
	        });
	    },
	    addTips: function(headerEle){
	        var headerTips = headerEle.find('.tips');
	        if(headerTips.length>0){
	            return headerTips;
	        }
	        var title = $.trim(headerEle.text());
	        var id = headerEle.attr(t.seqName)+ '_' + parseInt(Math.random()*10000);
	        headerEle.attr('tipId', id);
	        
	        //TODO: use templete next time
	        headerEle.append(
			    '<div class="hideBtn tips" id="'+id+'">'
			        +'<span class=hideTip style="padding: 1px 2px;font-size:0.7em;cursor:hand">x</span>'
				    +'<span class=showTip style="display:none;padding: 1px 2px;cursor:hand">'+title+'</span>'
			    +'</div>');
	        headerTips = headerEle.find('.tips');
			headerTips.css('position', 'absolute').css('top','0').css('right',0).css('float','left');
	        return headerTips;
	    },
	    findReShowTips: function(id){
	    	var tip = t.btnContent.find('#'+id);
	    	return tip;
	    },
	    addReShowBtn: function(headerEle){
	        var tip = this.addTips(headerEle).css('position', 'relative');
			tip.find('.hideTip').hide();
			tip.find('.showTip').show();
	        t.btnContent.append(tip);
	    },
	    removeReShowBtn: function(headerEle){
	        var id = headerEle.attr('tipId');
	        var tip = this.findReShowTips(id).css('position', 'absolute');
			tip.find('.hideTip').show();
			tip.find('.showTip').hide();
	        headerEle.append(tip);
	    },
	    findOperationArea: function(headerEle){
	        var attrName = this.seqName;
		    var attrVal = headerEle.attr(attrName)
		    //type=filter <- single
		    //type^=filter. <- multiple
			var eles = jQuery.merge(t.headerContent, t.content).find('['+attrName+'='+attrVal+'], ['+attrName+'^='+attrVal+'.]');
			
			return eles;
	    },
		hide: function(headerEle){
			var eles = this.findOperationArea(headerEle).addClass('hideByTableControl');
		    this.addReShowBtn(headerEle);
		},
		show: function(headerEle){
			var eles = this.findOperationArea(headerEle).removeClass('hideByTableControl');
		    this.removeReShowBtn(headerEle);
		}
	});
	
	exports.TableScreen = function(tableHeaderId, tableContentId, btnContentId, filterMap){
	    var t = new TableScreen(tableHeaderId, tableContentId, btnContentId, filterMap);
	    return t;
	}
})(window);