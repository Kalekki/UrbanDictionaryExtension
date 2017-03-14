// Urban Dictionary Defining Extension!

$(document).ready(function(){
	$("#searchBar").focus();
})

$(document).keypress(function(e) {
    if(e.which == 13) {
		var term = $("#searchBar").val();
		if(term != ""){
			define(term);
		}
    }
});

$("#searchButton").on('click',function(){
	var term = $("#searchBar").val();
	$("#searchBar").focus();
	if(term != ""){
		define(term);
	}
})

$(document).on('click',"#defineTerm",function(e){
		chrome.tabs.create({active: true, url:$(this).attr('href')})
})

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
	if($("#defineArea").length){
		$("#defineArea").remove();
	}

	$defineDiv = $("<div>",{"id":"defineArea"})
	$defineTerm = $("<div>",{"id":"defineTerm"})
	$defineDef = $("<div>",{"id":"defineDefinition"})
	$defineEx = $("<div>",{"id":"defineExample"})

    $(document.body).append($defineDiv);
    $defineTerm.text(term);
	$defineTerm.wrap("<a>")
    $defineTerm.attr("href", "http://www.urbandictionary.com/define.php?term=" + term)
    $defineTerm.attr("target", "_blank")
    $defineDef.html(definition.replace(new RegExp('\r?\n','g'), '<br />'));
    $defineEx.html(example.replace(new RegExp('\r?\n','g'), '<br />'));
    $defineDiv.append($defineTerm);
    $defineDiv.append($defineDef);
    $defineDiv.append($defineEx);
	$("#searchBar").focus();
}