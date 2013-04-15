(function( $ ){

   $.fn.timeScroller = function(options){
        
        var options = $.extend({
            format : {1:23, 2:59, 3:59},
            seperator : ':',
            timeDefault : ''
        }, options)

        return this.each(function(){

            var $this = $(this),
              returntext = '',
                touchStart,
          touchEnd;
            
            //default
            if(options.timeDefault != ''){
              var defaultPieces = options.timeDefault.split(options.seperator);
            }
            
            //generate time
          for(x in options.format){
            
            var timeValue = (defaultPieces[x -1])? defaultPieces[x -1] : '00';
            returntext = ((returntext.length > 0)? returntext + options.seperator : '' ) + '<span id="timePicker_' + x + '">' + timeValue + '</span>';
            
            returntext = returntext + '<span id="timePicker_' + x + '_ov" style="position:absolute;"></span>';
          }
          $this.html(returntext);
          
          //set overlay placement
          for(x in options.format){
            
            var timePickerWidth = $('#timePicker_' + x).width(),
              timePickerHeight = $('#timePicker_' + x).height(),
              timePickerPadding = 6;
            
            $('#timePicker_' + x + '_ov').css('width',(timePickerHeight +timePickerPadding) + 'px');
            $('#timePicker_' + x + '_ov').css('height',(timePickerHeight +timePickerPadding) + 'px');
            $('#timePicker_' + x + '_ov').css('margin-left','-' + (timePickerWidth + (timePickerPadding /2)) + 'px');
            $('#timePicker_' + x + '_ov').css('margin-top','-' + (timePickerPadding /2) + 'px');
          }
          
          //prevent mouse wheel on container
          $this.on('mousewheel', function(event, delta){

              event.preventDefault();
              return false;
          });

          //on mousewheel
            $this.children().on('mousewheel', function(event, delta){
              
              var myId = '#' + this.id.replace('_ov','');             
              overflow(myId, delta);
            });
            
            //mobile finger scroll start
            $this.children().on('touchstart', function(event){
              
              touchStart = event.originalEvent.touches[0].pageY;
              touchId = this.id;

              event.preventDefault();
            });

            //mobile finger scroll move
            $('body').on('touchmove', function(event){
              
              touchEnd = event.originalEvent.touches[0].pageY;
              var touchDifferent = touchStart - touchEnd;

              if(touchStart > 0 && touchDifferent > 5 || touchDifferent < -5){
                
                touchDifferent = ((touchDifferent > 5)? 1 : -1 );
                
                    var myId = '#' + touchId.replace('_ov','');             
                    overflow(myId, touchDifferent);
              }
            });

            //mobile finger scroll end
            $('body').on('touchend', function(event){
              touchId = '';
            });
        });
        
        function overflow(thisId, delta){
          
          //overflow vars
          var currentValue = parseInt($(thisId).text(),10),
            newValue = currentValue + delta,
            layoutId = thisId.replace('#timePicker_',''),
          leftId = '#timePicker_' + (layoutId -1),
          leftHtml = parseInt($(leftId).text()),
                tempId = leftId.replace('#timePicker_',''),
                timer_sum = 0,
                totals_sum = 0;
          
          //overflow up
          if(newValue > options.format[layoutId]){
                
                //calculate left sum
                while(tempId > 0){
                  timer_sum = timer_sum + parseInt($('#timePicker_' + tempId).html(),10);
                  totals_sum = totals_sum + options.format[tempId];
                  tempId--;
                }
            
              //if left exists and left sum < total sum
            if($(leftId).is('*') && timer_sum < totals_sum){
              var leftCurrentValue = parseInt($(leftId).html(),10),
                leftNew_value = leftCurrentValue +1,
                leftLayoutId = leftId.replace('#timePicker_','');
              
              $(leftId).html(((leftNew_value < 10)? '0' : '' ) + leftNew_value);
              $(thisId).html('00'); 
              
              if(leftNew_value > options.format[leftLayoutId]){               
                overflow(leftId, 1);
              }
            }
            else{
              $(thisId).html(options.format[layoutId]);
            }               
          }
          //overflow down
          else if(newValue < 0){
                
                //calculate left sum
                while(tempId > 0){
                  timer_sum = timer_sum + parseInt($('#timePicker_' + tempId).html(),10);
                  tempId--;
                }
                
                //if left exists and left sum > 0
              if($(leftId).is('*') && timer_sum > 0){
                var leftCurrentValue = parseInt($(leftId).html(),10),
              leftNew_value = leftCurrentValue -1;
                  
                    $(leftId).html(((leftNew_value < 10)? '0' : '' ) + leftNew_value);
                    $(thisId).html(options.format[layoutId]);
                      
                    if(leftNew_value < 0){
                  overflow(leftId, -1);
                    }
              }
              else{
                $(thisId).html('00');
              } 
            }
          //no overflow
          else{
              
            newValue = Math.round(newValue);        //round
            if(newValue < 10) newValue = '0' + newValue;  //add leading zero
              
            $(thisId).html(newValue);
          }
        }
   }
})( jQuery );