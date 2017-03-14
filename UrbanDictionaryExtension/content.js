/* -------------------- Urban Dictionary --------------------
    A place formerly used to find out about slang,
    and now a place that teens with no life use as a burn book to whine about celebrities, their friends, etc.,
    let out their sexual frustrations,
    show off their racist/sexist/homophobic/anti-(insert religion here) opinions,
    troll, and babble about things they know nothing about.

    Urbandictionary.com isn't a burn book or a webjournal site.

        by Lucy March 18, 2005
*/


/* TODO:
         Make a toggle between context menu and double click
         Parse [urls]
         de-spaghettify
 */

/*  Urban Dictionary API JSON structure
  {
  "tags":[""],
  "result_type":"exact",
  "list":[{
              "definition"  : "",
              "permalink"   : "",
              "thumbs_up"   : number,
              "author"      : "",
              "word"        : "",
              "defid"       : number,
              "current_vote": "",
              "example"     : "",
              "thumbs_down" : number
          }],
    "sounds":[
              "url_string.mp3"
            ]
  }
*/

//Mouse coords
var pX,pY,cY;

// DoubleClick to define!
document.ondblclick = function (e) {
    var selection = window.getSelection().toString().replace(" ", "");
    if (selection != "" && encodeURIComponent(selection) != "%0A") {
        define(selection);
    }

}

// remove box when clicking outside, and update mouse coords
$(document).mouseup(function (e) {
    cY = e.clientY;
    pX = e.pageX;
    pY = e.pageY;
    var cont = $("#defbox");
    if (cont) {
        if ($(e.target).parents("#defbox").length === 0) {
            cont.remove();
        }
    }
    // Just select to define!
    if(true /* TODO:  replace with option! */){
        var selection = window.getSelection().toString();
            if (selection != "" && encodeURIComponent(selection) != "%0A") {
                define(selection.trim());
            }
    }
});

function define(term){
    var apiUrl = 'https://api.urbandictionary.com/v0/define?term=' + encodeURIComponent(term);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl)
    xhr.responseType = 'json'
    xhr.onload = function () {
        var response = xhr.response;
        if (response.result_type == "no_results") {
            console.log("no_results")
            displayResult("No results", ":(", "Maybe you could define this?")
        } else {
            console.log(response.list[0].definition)
            console.log(response.list[0].example)
            displayResult(response.list[0].word, response.list[0].definition, response.list[0].example)
        }
    }
    xhr.onerror = function () {
        console.log("xhr error")
    }
    xhr.send(null)
}

function displayResult(term, definition, example) {
    $('#defbox').remove();
    var $div = $('<div>', {
        id: "defbox"
    });
    var $titletext = $('<a>', {
        id: "deftitle"
    })
    var $deftext = $('<div>', {
        id: "deftext"
    })
    var $defexample = $('<div>', {
        id: "defexample"
    })

    $(document.body).append($div);
    $titletext.text(term);
    $titletext.attr("href", "http://www.urbandictionary.com/define.php?term=" + term)
    $titletext.attr("target", "_blank")
    //$titletext.wrap("<h1>")
    $deftext.html(definition.replace(new RegExp('\r?\n','g'), '<br />'));
    $defexample.html(example.replace(new RegExp('\r?\n','g'), '<br />'));
    $div.append($titletext);
    $div.append($deftext);
    $div.append($defexample);

    //This simple task of positioning the div while constraining it within bounds, yet not obstructing selection took way longer than i am willing to admit
    var window_width = Math.max(window.innerWidth, document.documentElement.clientWidth);
    var window_height = window.innerHeight;
    var div_height = $div.outerHeight();
    var div_width = $div.outerWidth();
    var x_offset = div_width / 2;
    var y_offset = div_height / 2;
    var x,y
    if (cY > window_height / 2) {
        y = pY - (div_height + 35)
    } else {
        y = pY
    }
    if (pX < div_width / 2) {
        x = 0
    } else if (pX > window_width - x_offset) {
        x = window_width - div_width
    } else {
        x = pX - x_offset
    }
    $div.css({
        "top": y + "px",
        "left": x + "px"
    });
    // 

}
