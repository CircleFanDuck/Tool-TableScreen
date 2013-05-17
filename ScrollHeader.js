(function(exports){
    var DragHandle = new Class;
    DragHandle.include({
        init: function(ele, des){
            var d = this;
            d.scrollDes = (des=='x'?'scrollLeft':'scrollTop');
            d.getEventPos = 'getEvent'+des;
            ele.css('overflow-'+des, 'hidden');
            d.MIN_DIS = 2;
            
	        ele.mousedown(function(e){
	            d.positionStart = d[d.getEventPos]();
	            function syncScroll(e){
	                var positionEnd = d[d.getEventPos]();
	                var moveSize = d.positionStart - positionEnd;
	                if(moveSize>d.MIN_DIS||moveSize<(-1*d.MIN_DIS)){
		                d.positionStart = d[d.getEventPos]();
		                var result = ele.attr(d.scrollDes)*1 + moveSize;
		                ele.attr(d.scrollDes, result);
	                }
	            }
	            $(document.body).one('mouseup', function(){
	                $(document.body).unbind('mousemove', syncScroll);
	            });
	            $(document.body).mousemove(syncScroll);
	        })
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
		}
    });



	var ScrollHeader = new Class;
	ScrollHeader.include({
	    init: function(scrollHeader, scrollBody, desFilter){
	        this.scrollHeader = scrollHeader;
	        this.scrollBody = scrollBody;
	        
	        //set sync des
	        this.sync = {
	            x: null,
	            y: null
	        };
	        if(desFilter&&desFilter.x){
	            this.sync.x = 'scrollLeft';
	        }
	        if(desFilter&&desFilter.y){
	            this.sync.y = 'scrollTop';
	        }
	        
	        var s = this;
	        this.scrollHeader.scroll(function(){
	            s.syncScroll('x');
	            s.syncScroll('y');
	        });
	        
	    },
	    syncScroll: function(des){
	        var desAttr = this.sync[des];
	        if(desAttr){
	            this.scrollBody.attr(desAttr, this.scrollHeader.attr(desAttr));
	        }
	    }
	});
	
	exports.prototype.scrollHeaderOf = function(scrollBody, desFilter){
	    var scrollHeader = $(this);
	    var s = new ScrollHeader(scrollHeader, scrollBody, desFilter);
	    if(desFilter.x)var d = new DragHandle(scrollHeader, 'x');
	    if(desFilter.y)var d = new DragHandle(scrollHeader, 'y');
	    return scrollHeader;
	}
})($);

