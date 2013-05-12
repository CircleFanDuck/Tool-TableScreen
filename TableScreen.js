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
	    init: function(headerContent, tableContent, filterMap, btnContent){
	        var t = this;
			t.seqName = filterMap.x||filterMap.y;
			t.headerContent = headerContent;
			t.content = tableContent;
			t.btnContent = btnContent;
			t.header = t.headerContent;
			t.header.find('td').css('position','relative');
			
			t.root = $([]);
			t.root = jQuery.merge(t.root, t.headerContent);
			t.root = jQuery.merge(t.root, t.content);
				        
	        //bind hide button hover
	        t.headerContent.delegate('td', 'mouseenter', function(){
	            var tip = t.addTips($(this));
	            tip.show();
	        });
	        
	        t.headerContent.delegate('td', 'mouseleave', function(){
	            var tip = t.addTips($(this));
	            tip.hide();
	        });
	        
	        //bind hide button
	        t.headerContent.delegate('.tips', 'click', function(){
	            var headerOfBtn = $(this).parent();
	            t.hide(headerOfBtn);
	        });
	        
	        //bind show button
	        t.btnContent.delegate('.tips', 'click', function(){
	            var tipId = $(this).attr('id');
	            var headerOfBtn = t.headerContent.find('[tipId='+tipId+']');
				t.show(headerOfBtn);
	        });
	    },
		createSeq: function(header, type){
		    var headerTr = header.find('tr');
			//TODO: can not support colspan and rowspan together now
			var regArr [];
			
		},
	    addTips: function(headerEle){
	        var headerTips = headerEle.find('.tips');
	        if(headerTips.length>0){
	            return headerTips;
	        }
	        var title = $.trim(headerEle.text());
	        var id = headerEle.attr(this.seqName)+ '_' + parseInt(Math.random()*10000);
	        headerEle.attr('tipId', id);
	        
	        //TODO: use templete next time
	        headerEle.append(
			    '<div class="hideBtn tips" id="'+id+'">'
			        +'<span class=hideTip style="padding: 1px 2px;font-size:0.7em;cursor:hand">x</span>'
				    +'<span class=showTip style="display:none;padding: 1px 3px;cursor:hand">'+title+'</span>'
			    +'</div>');
	        headerTips = headerEle.find('.tips');
			headerTips.css('position', 'absolute').css('top','0').css('right',0).css('float','left');
	        return headerTips;
	    },
	    findReShowTips: function(id){
	    	var tip = this.btnContent.find('#'+id);
	    	return tip;
	    },
	    addReShowBtn: function(headerEle){
	        var tip = this.addTips(headerEle).css('position', 'relative').show();
			tip.find('.hideTip').hide();
			tip.find('.showTip').show();
	        this.btnContent.append(tip);
			
			var t = this;
			var subHeader = t.getSubHeader(headerEle);
			subHeader.each(function(){
			    t.removeReShowBtn($(this));
			})
	    },
	    removeReShowBtn: function(headerEle){
	        var id = headerEle.attr('tipId');
	        var tip = this.findReShowTips(id).css('position', 'absolute').hide();
			tip.find('.hideTip').show();
			tip.find('.showTip').hide();
	        headerEle.append(tip);
			
			//remove sub reshow btn
			var t = this;
			var subHeaders = t.getSubHeader(headerEle);
			subHeaders.each(function(){
			    t.removeReShowBtn($(this))
			})
	    },
		getParentHeader: function(attrVal){
		    var index = attrVal.lastIndexOf('_');
			if(index >= 0){
				var attrName = this.seqName;
			    var parentAttrVal = attrVal.substring(0, index);
				var parentHeader = this.headerContent.find('['+attrName+'='+parentAttrVal+']');
				return parentHeader;
			}
			return null;
		},
		getSubHeader: function(parentHeader){
	        var attrName = this.seqName;
		    var attrVal = parentHeader.attr(attrName);
			var visibleSubHeader = this.headerContent.find('['+attrName+'^='+attrVal+'_]');
			return visibleSubHeader;
		},
	    findOperationArea: function(headerEle){
	        var attrName = this.seqName;
		    var attrVal = headerEle.attr(attrName)
		    //type=filter <- single
		    //type^=filter_ <- multiple
			var t = this;
			var eles = t.root.find('['+attrName+'='+attrVal+'], ['+attrName+'^='+attrVal+'_]');
			
			return eles;
	    },
		suitParentHeader: function(headerEle){
			//check parent
		    var attrVal = headerEle.attr(this.seqName)
			var parentHeader = this.getParentHeader(attrVal);
			if(parentHeader&&parentHeader.length>0){
				var subHeaderVisible = this.getSubHeader(parentHeader).filter(':visible');
				if(subHeaderVisible.length==0){
					this.hide(parentHeader);
				}
			}
			
		},
		hide: function(headerEle){
			var eles = this.findOperationArea(headerEle).addClass('hideByTableControl');
		    this.addReShowBtn(headerEle);
			this.suitParentHeader(headerEle);
		},
		show: function(headerEle){
			var eles = this.findOperationArea(headerEle).removeClass('hideByTableControl');
		    this.removeReShowBtn(headerEle);
		}
	});
	
	exports.prototype.headOf = function(tableContent, filterMap, btnContent){
	    var headerContent = $(this);
	    var t = new TableScreen(headerContent, tableContent, filterMap, btnContent);
	    return headerContent;
	}
})($);