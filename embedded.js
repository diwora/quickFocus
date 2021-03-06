function qfdefer(method) {
    if (window.qfjq && qfjq) {
        setTimeout(function() { method() }, 250);
    } else {
        setTimeout(function() { qfdefer(method) }, 50);
    }
}

var quickFocusListening = false;
var quickFocusDictionary = {};

qfdefer(function () {
    qfjq( "body" ).keydown(function( event ) {
        if(quickFocusListening){
            if(event.which == 13){
                var selectionString = qfjq('#quickFocusInput').val();
                var selected = "";
                if(selectionString == ""){                    
                    selected = qfjq(qfjq('.quickFocusLabel.firstLabel')).text();
                }
                else{
                    selected = Number(selectionString);
                }
                
                selected_element = quickFocusDictionary[selected];     
                selected_element.focus();
                qfjq('.quickFocusLabel').remove();
                qfjq('#quickFocusOverlay').remove();
                qfjq('#quickFocusInput').remove();
                qfjq('#quickFocusOverlayHorizontal').remove();
                qfjq('#quickFocusOverlayVertical').remove();
                quickFocusListening = false;
                console.log(event.ctrlKey);
                if(!event.ctrlKey){
                    event.preventDefault();       
                }
                else{
                    console.log('not entering');

                }

            }
            else if (event.which == 27 || (event.which == 219 && event.ctrlKey== true)) {
                qfjq('.quickFocusLabel').remove();
                qfjq('#quickFocusOverlay').remove();
                qfjq('#quickFocusOverlayHorizontal').remove();
                qfjq('#quickFocusOverlayVertical').remove();
                qfjq('#quickFocusInput').remove();
                quickFocusListening = false;
            }
            
            else if(event.which >= 37 && event.which <= 40){
                arrows = ["left", "up", "right", "down"];
                clicked_arrow = 3 - (40 - event.which);
                subselect_overlay(arrows[clicked_arrow]);
            }
            

        }
        else if (event.which == 219 && event.ctrlKey== true){
            showOverlay();
            quickFocusListening = true;
            event.preventDefault();      
        }            
    });

});       

function showOverlay(){
    var inputs = qfjq('input:enabled:visible').withinviewport();
    var buttons = qfjq('button:enabled:visible').withinviewport();
    var links = qfjq('a:visible').withinviewport();
    quickFocusDictionary = {};
    all_elements = buttons.add(links).add(inputs);

    var body = qfjq('body');
    body.append('<div id="quickFocusOverlay"/>');
    body.append('<div id="quickFocusOverlayHorizontal"/>');
    body.append('<div id="quickFocusOverlayVertical"/>');
    
    body.append('<input id="quickFocusInput"/>');

    all_elements.each(function(index){
        var offset = qfjq(this).offset();
        quickFocusDictionary[index] = qfjq(this);
        body.append('<div class="quickFocusLabel" style="top:'+offset.top+'px; left:'+offset.left+'px">'+index+'</div>');
    });
    qfjq('#quickFocusInput').focus();
}


function subselect_overlay(arrow){
    var inputs = qfjq('input:enabled:visible').withinviewport();
    var buttons = qfjq('button:enabled:visible').withinviewport();
    qfjq('#quickFocusOverlayHorizontal').css('visibility', 'visible');
    qfjq('#quickFocusOverlayVertical').css('visibility', 'visible');
    var links = qfjq('a:visible').withinviewport();
    quickFocusDictionary = {};
    all_elements = buttons.add(links).add(inputs);

    var qfol = qfjq('#quickFocusOverlay');
    ow = Number(qfol.css('width').replace("px", ""));
    oh = Number(qfol.css('height').replace("px", ""));
    ol = Number(qfol.css('left').replace("px", ""));
    ot = Number(qfol.css('top').replace("px", ""));

    switch(arrow){
        case "right":
            ol = ol + Math.floor(ow/2); 
            ow = Math.floor(ow/2);
            break;
        case "left":
            ow = Math.floor(ow/2);
            break;
        case "up":
            oh = Math.floor(oh/2);
            break;
        case "down":
            ot = ot + Math.floor(oh/2); 
            oh = Math.floor(oh/2);
            break;
    }

    qfjq('.quickFocusLabel').remove();
    all_elements.each(function(index){
        var curel = qfjq(this);
        var offset = curel.offset();
        quickFocusDictionary[index] = qfjq(this);
        var offsetTop = qfjq(window).scrollTop()
        var offsetLeft = qfjq(window).scrollLeft()
        if(offset.top >= ot + offsetTop && offset.top <= (ot + offsetTop + oh) && offset.left >= ol + offsetLeft && offset.left <= (ol + offsetLeft+ ow)){
            qfjq('body').append('<div class="quickFocusLabel" style="top:'+offset.top+'px; left:'+offset.left+'px">'+index+'</div>');
        }
    });
    qfjq(qfjq('.quickFocusLabel')[0]).addClass('firstLabel');
    
    var qfolh = qfjq('#quickFocusOverlayHorizontal');
    var qfolv = qfjq('#quickFocusOverlayVertical');

    var nw = ow;
    var nwh = nw/2;
    var nh = oh;
    var nhh = nh/2;
    var lm = ol;
    var tm = ot;
    var bm = oh;
    var rm = ow;

    qfol.css('width', rm - lm + "px");
    
    qfol.css('width', nw + "px");
    qfol.css('height', nh + "px");
    qfol.css('left', lm + "px");
    qfol.css('top', tm + "px");
    
    qfolh.css('width', nwh + "px");
    qfolh.css('height', bm + "px");
    qfolh.css('left', (lm + nwh) + "px");
    qfolh.css('top', tm + "px");

    qfolv.css('width', nw + "px");
    qfolv.css('height', nhh + "px");
    qfolv.css('left', lm + "px");
    qfolv.css('top', (tm + nhh) + "px");

    qfjq('#quickFocusInput').focus();
}
