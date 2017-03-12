chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        console.log("request: "+request.data)

        // GET THE DEFINITION
        var apiUrl = 'http://api.urbandictionary.com/v0/define?term=' + encodeURIComponent(request.data);
        var xhr = new XMLHttpRequest();
        xhr.open('GET',apiUrl)
        xhr.responseType = 'json'
        xhr.onload = function()
        {
            var response = xhr.response;
            if(response.result_type == "no_results"){
                console.log("no_results")
                sendResponse({result:"no_results"})
            }else{
                console.log(response.list[0].definition)
                sendResponse({result:response.list[0].definition})
            }
        }
        xhr.onerror = function(){
            sendResponse({result:"error"})
        }
        xhr.send(null)
        
    }
    
)

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
