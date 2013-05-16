(function(exports){
  var Resize = new Class;
	Resize.include({
	    init: function(resizeEle, des, option){
	        var r = this;
	        //static value
	        r.RESIZER_WEIGHT = 5;
	        r.FUZZY_WEIGHT = 10;
	        r.HOVER = 'gray';
	        r.RESIZING = 'red';
	        
	        r.des = des;
	        r.root = resizeEle;
	        r.option = option;
	        
	        //set usage func name
	        r.sizeFunc = (r.des=='x'? 'width': 'height');
	        r.nSizeFunc = (r.des=='x'?'height':'width');
	        r.positionFuc = (r.des=='x'? 'left': 'top');
	        r.npositionFuc = (r.des=='x'? 'top': 'left');
	        r.eventFunc = 'getEvent'+des;
	        
	        //set usage class name
	        r.hoverClass = 'resize'+des;
	        r.resizeClass = '.resizing'+des
	        
			//create resize ruler
	        r.id = 'resizeBorder'+parseInt(Math.random()*10000)+'_'+parseInt(Math.random()*10000)+'_'+r.des;
	        $(document.body).append(r.getRulerDom(r.des, r.id));
	        r.resizer = $('#' + r.id);
	        
	        //set default size
	        r.oriSize = r.root[r.sizeFunc]();
	        r.regSize = r.oriSize;
	        
	        //bind and set default size
	        r.resizableStart();
	        r.root.resize();
	    },
	    getInitSize: function(){
	        var option = this.option;
	        if(option.initSize==undefined){
	            return null;
	        }
	        if(option.initSize > this.oriSize){
	            return this.oriSize;
	        }
	        return option.initSize;
	    },
	    inRange: function(val){
	        var checkFunc = this.option.rangeCheck||function(){return true;};
	        return checkFunc(val);
	    },
	    resizableStart: function(){
	        var r = this;
	        
	    	function mousemove(e){
	            r.setHover(e)
	        }
			function mouseleave(){
	            r.endHover(r.des);
	        }
			function mousedown(e){
	            var resizeFlag = r.inResizeFuzzyField(e, r.FUZZY_WEIGHT, r.des);
	            
	            if(resizeFlag){
	                r.startEditing(r.des);
	            }
	            if(r.root.filter('.resizing'+r.des).length==0){
	                return;
	            }
	            var resizeFunc = function(e){
	                r.resizeFuncHandle(e, r.des);
	            };
	            
	            $(document.body).bind('mousemove', resizeFunc);
	            $(document.body).one('mouseup',function(){
	                $(document.body).unbind('mousemove', resizeFunc);
		            if(r.root.filter('.resizingx,.resizingy').length==0){
		                return;
		            }
		            r.endEditing(r.des);
		            r.setHover(r.des)
		            r.resize();
	            });
	        }
	        r.root.mousemove(mousemove);
	        r.root.mouseleave(mouseleave)
			r.root.mousedown(mousedown);
			r.root[r.sizeFunc](r.getInitSize())
	    
			r.stopResizable = function(){
			    r.regSize = r.root.width();
		        r.root.unbind('mousemove', mousemove);
		        r.root.unbind('mouseleave', mouseleave)
				r.root.unbind('mousedown', mousedown);
				r.root[r.sizeFunc]('auto');
			}
	    },
	    resizableEnd: function(){
	        this.stopResizable();   
	    },
	    distroy: function(){
	        this.resizer.remove();
	        this.stopResizable();
	    },
	    getRulerDom: function(des, id){
	        var r = this;
	        var position = this.getResizeRelativePosition(des);
	        var style = this.getPostionStyle(position);
	        var dom = '<div id='+id+' style="display:none;z-index:1000;position:absolute;left:0px;top:0px;'
	            +'width:'+r.RESIZER_WEIGHT+'px;height:'+r.RESIZER_WEIGHT+'px;background-color:'+r.HOVER+';"></div>';
	        return dom;
	    },
	    getPostionStyle: function(pos){
	        var style = '';
	        if(pos.top!=undefined)style = style += ('top:'+pos.top+'px;');
	        if(pos.left!=undefined)style = style += ('left:'+pos.left+'px;');
	        return style;
	    },
	    getResizeRelativePosition: function(des, pos){
	        var position = {
	            top: (des=='x'?0:-1),
	            left: (des=='x'?-1:0)
	        }
	        if(pos&&pos.top!=undefined){
	            position.top = pos.top;
	        }
	        if(pos&&pos.left!=undefined){
	            position.left = pos.left;
	        }
	        return position;
	    },
	    approachSmartLine: function(des, size){
	        var r = this;
	        var smartSize = r.option.smartSize;
	        var distent = smartSize - size;
	        if(distent>=r.FUZZY_WEIGHT*(-1)&&distent<=r.FUZZY_WEIGHT){
	            return smartSize;
	        }
	        return size;
	    },
	    resizeFuncHandle: function(e, des){
	        var r = this;
	        var resizePos = r.getLeftTopCorner(r.root);
		    if(r.root.filter(r.resizeClass).length!=0){
	            var newSize = r.approachSmartLine(des, r[r.eventFunc](e) - resizePos[des]);
	            
	            if(!r.inRange(newSize)){
	                return;
	            }
		        r.root[r.sizeFunc](newSize);
		        var style = r.positionFuc +':' + (r[r.eventFunc](e));
		        r.resizer.attr('style', r.resizer.attr('style')+ style+';');
		    }
	    },
	    inHover: function(des){
	        var r = this;
	        if(r.root.filter('.resize'+des)){
	            return true;
	        }
	        return false;
	    },
	    setHover: function(e){
	        var r = this;
	        var des = r.des;
	        var flag = r.inResizeFuzzyField(e, r.FUZZY_WEIGHT, des);
		    if(flag){
		        r.startHover(des);
		    }else{
		        r.endHover(des);
		    }
	    },
	    startHover: function(des){
	        var r = this;
	        r.root.addClass(r.hoverClass);
	        var resizer = r.resizer.show();
	        resizer[r.nSizeFunc]($(document.body)[r.nSizeFunc]());
	        
	        var offSetAttr = r.npositionFuc + ':' + r.getDocumentScroll((des=='x'?'y':'x'))+'px;';
	        resizer.attr('style', resizer.attr('style')+ r.positionFuc +':'+ r.getRightBottomCorner(r.root)[des]+'px'+';'+offSetAttr);
	    },
	    endHover: function(des){
	        var r = this;
		    if(r.root.filter(r.resizeClass).length==0){
	        	r.root.removeClass(r.hoverClass);
	        	r.resizer.hide();
	        }
	    },
	    inEditing: function(des){
	        var r = this;
	        if(r.root.filter(r.resizeClass)){
	            return true;
	        }
	        return false;
	    },
	    startEditing: function(des){
	        var r = this;
	        r.root.addClass('resizing'+des);
	        r.resizer.css('background', r.RESIZING);
	    },
	    endEditing: function(des){
	        var r = this;
	        r.root.removeClass('resizing'+des);
	        r.resizer.css('background', r.HOVER);
	    },
	    getLeftTopCorner: function(ele){
	        var base = ele.offset();
	        var pos = {
	            x: base.left,
	            y: base.top,
	        };
	        for(var offsetEle = $(ele).offsetParent(); offsetEle.filter('body').length==0; offsetEle = offsetEle.offsetParent()){
	            var offsetObj = offsetEle.offset();
	            pos.x = pos.x  - offsetObj.left;
	            pos.y = pos.y  - offsetObj.top;
	        }
	        
	        return pos;
	    },
	    getRightBottomCorner: function(ele){
	        var ele = $(ele)
	        var pos = this.getLeftTopCorner(ele)
	        
	        pos.x = pos.x  + ele.width()*1;
	        pos.y = pos.y  + ele.height()*1;
	        
	        return pos;
	    },
	    getDocumentScroll: function(des){
	        var ele = document.body?document.body:document.documentElement;
	        var scroll = (des=='x'?'scrollLeft':'scrollTop');
	        return ele[scroll];
	    },
	    getEventx: function(evt) {
		    evt = evt || window.event;
			if (evt.pageX){
				return evt.pageX;
			} else if (evt.clientX){
			    return evt.clientX + this.getDocumentScroll(this.des); 
			}
			return null;
		},
		getEventy: function(evt) {
		    evt = evt || window.event;
			if (evt.pageY){
				return evt.pageY;
			} else if (evt.clientY){
			    return evt.clientY + this.getDocumentScroll(this.des); ;   
			}
			return null;
		},
	    inResizeFuzzyField: function(e, fuzzy, des){
	        var pos = this[this.eventFunc](e);
	        if(this.getRightBottomCorner(this.root)[des] - pos <=fuzzy){
	            return true;
	        }
	        return false;
	    },
	    resize: function(des){
	        this.root.resize();
	    }
	});
	

	exports.prototype.resizable = function(des, option){
	    var resizeEle = $(this);
	    var resize = new Resize(resizeEle, des, option||{});
	    
	    if(option){
		    option.stopResizable = function(){
		        resize.resizableEnd();
		    }
		    option.unResizable = function(){
		        resize.distroy();
		    }
		    option.startResizable = function(){
		        resize.resizableStart();
		    }
	    }
	    return resizeEle;
	}
})($);
