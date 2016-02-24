// User selects one author
// Ajax call for author id using search.author, 
// Use author ID, make another Ajax call using author.show. We need author profile link,  


var app = {};
// app.author = "Lisa Moore" 
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

app.starHover = function(){
	$(".oneStar, .twoStar, .threeStar, .fourStar, .fiveStar ")
	.on("mouseenter", function(){
		$(this).addClass("hover").prevAll().addClass("hover");
	})
	.on("mouseleave", function(){
		$(this).removeClass("hover").prevAll().removeClass("hover");
	})
	.on("click", function(){
		app.rating = $(this).data("rating")
		console.log(app.rating);
		if ($(this).hasClass("selected") && ($(this).hasClass("hover")) ) {
			$(".star").not(".hover").removeClass("selected");
		}
		$(this).addClass("selected").prevAll().addClass("selected");
	});
};

app.selectAuthor = function(){
	$("label").on("click", function(e){
		e.preventDefault();
		app.author = $(this).prev().val();
		app.getAuthorID();
		console.log(app.author);
		$(this).siblings().hide();
		$(this).find("p").hide();
		$(this)
			.css("position", "absolute")
			.animate({
			left: 0	
			}, "slow")
			.find("img").animate ({
				width: 200,
				height: 200,
			}, "slow");
		$(".authorHeading").fadeIn();
		$(".authorHeading h2").text(app.author);
	})

	//code for reset author search link
		// $("a").on("click",function(e){
		// 	e.preventDefault();
		// 	$(".box").show();
		// 	$(".box").animate({
		// 	}, function(){ $(this).removeAttr("style")} )
		// })
	
}

app.init = function(){
	// app.getAuthorID();
	app.selectAuthor();
	app.starHover();

};


$(function() {
   app.init();
});