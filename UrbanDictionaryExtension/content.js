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
         Parse examples better
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
var cY = 0;

document.ondblclick = function (e) {
    cY = e.clientY;
    var selection = window.getSelection().toString().replace(" ", "");
    if (selection != "" && encodeURIComponent(selection) != "%0A") {
        // GET THE DEFINITION
        var apiUrl = 'https://api.urbandictionary.com/v0/define?term=' + encodeURIComponent(selection);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', apiUrl)
        xhr.responseType = 'json'
        xhr.onload = function () {
            var response = xhr.response;
            if (response.result_type == "no_results") {
                console.log("no_results")
                displayResult("¯\_(ツ)_/¯", "No results", "Es nada", e.pageX, e.pageY)
            } else {
                console.log(response.list[0].definition)
                displayResult(response.list[0].word, response.list[0].definition, response.list[0].example, e.pageX, e.pageY)
            }
        }
        xhr.onerror = function () {
            console.log("xhr error")
        }
        xhr.send(null)
    }

}



function displayResult(term, definition, example, x, y) {
    $('#defbox').remove();
    var $div = $('<div>', {
        id: "defbox"
    });
    var $titletext = $('<a>', {
        id: "deftitle"
    })
    var $deftext = $('<h2>', {
        id: "deftext"
    })
    var $defexample = $('<h3>', {
        id: "defexample"
    })

    $(document.body).append($div);
    $titletext.text(term);
    $titletext.attr("href", "http://www.urbandictionary.com/define.php?term=" + term)
    $titletext.attr("target", "_blank")
    $titletext.wrap("<h1>")
    $deftext.text(definition);
    $defexample.text(example);
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
    var yy, xx
    if (cY > window_height / 2) {
        yy = y - (div_height + 35)
    } else {
        yy = y
    }
    if (x < div_width / 2) {
        xx = 0
    } else if (x > window_width - x_offset) {
        xx = window_width - div_width
    } else {
        xx = x - x_offset
    }
    $div.css({
        "top": yy + "px",
        "left": xx + "px"
    });
    // 

}
// remove box when clicking outside
$(document).mouseup(function (e) {
    var cont = $("#defbox");
    if (cont) {
        if ($(e.target).parents("#defbox").length === 0) {
            cont.remove();
        }
    }
});