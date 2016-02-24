// User selects one author
// Ajax call for author id using search.author, 
// Use author ID, make another Ajax call using author.show. We need author profile link,  


app = {};
app.author = "Lisa Moore" 
app.apiKey = "7CgssNsOg0UlotmGhMjhg";
app.authorSearchUrl = "https://www.goodreads.com/api/author_url/";
app.authorInfoUrl = "https://www.goodreads.com/author/show/";

app.getAuthorID = function(){

	$.ajax({
	    url: 'http://proxy.hackeryou.com',
	    dataType: 'json',
	    method:'GET',
	    data: {
	        reqUrl: app.authorSearchUrl + app.author,
			params : {
				key: app.apiKey
			},
	        xmlToJSON: true
	    }
	}).then(function(data) {
	    console.log(data);
	    app.authorID = data.GoodreadsResponse.author.id;
	    // console.log(app.authorID);
	    app.getAuthorInfo();

	});
}

app.getAuthorInfo = function(){

	$.ajax({
	    url: 'http://proxy.hackeryou.com',
	    dataType: 'json',
	    method:'GET',
	    data: {
	        reqUrl: app.authorInfoUrl + app.authorID,
			params : {
				key: app.apiKey
			},
	        xmlToJSON: true
	    }
	}).then(function(data) {
	    console.log(data);
	    app.getBookInfo(data);
	});
}

app.getBookInfo = function(authorData){
	var authorProfile = authorData.GoodreadsResponse.author.link;
	console.log(authorProfile);
}

app.init = function(){
	app.getAuthorID();
};


$(function() {
   app.init();
});