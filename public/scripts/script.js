"use strict";

// User selects one author
// Ajax call for author id using search.author,
// Use author ID, make another Ajax call using author.show. We need author profile link, 

var app = {};
// app.author = "Lisa Moore"
app.apiKey = "7CgssNsOg0UlotmGhMjhg";
app.authorSearchUrl = "https://www.goodreads.com/api/author_url/";
app.authorInfoUrl = "https://www.goodreads.com/author/show/";
app.authorBooksUrl = "https://www.goodreads.com/author/list/";

app.getAuthorID = function () {

	$.ajax({
		url: 'http://proxy.hackeryou.com',
		dataType: 'json',
		method: 'GET',
		data: {
			reqUrl: app.authorSearchUrl + app.author,
			params: {
				key: app.apiKey
			},
			xmlToJSON: true
		}
	}).then(function (data) {
		console.log(data);
		app.authorID = data.GoodreadsResponse.author.id;
		// console.log(app.authorID);
		app.getAuthorInfo();
		app.getBookList();
	});
};

app.getAuthorInfo = function () {

	$.ajax({
		url: 'http://proxy.hackeryou.com',
		dataType: 'json',
		method: 'GET',
		data: {
			reqUrl: app.authorInfoUrl + app.authorID,
			params: {
				key: app.apiKey
			},
			xmlToJSON: true
		}
	}).then(function (data) {
		console.log(data);
		app.getBookInfo(data);
	});
};

app.getBookInfo = function (authorData) {
	var authorProfile = authorData.GoodreadsResponse.author.link;
	console.log(authorProfile);
};

app.displayBooks = function () {
	$("#books").empty();
	var bookHtml = $("#authorTemplate");
	var template = Handlebars.compile(bookHtml);
	//data.forEach(function(val, i){
	//	$("#books").append(template(val));
	//})
};

app.starHover = function () {
	$(".oneStar, .twoStar, .threeStar, .fourStar, .fiveStar ").on("mouseenter", function () {
		$(this).addClass("hover").prevAll().addClass("hover");
	}).on("mouseleave", function () {
		$(this).removeClass("hover").prevAll().removeClass("hover");
	}).on("click", function (e) {
		e.preventDefault();
		app.rating = $(this).data("rating");
		console.log(app.rating);
		//app.filteredBooks();
		if ($(this).hasClass("selected") && $(this).hasClass("hover")) {
			$(".star").not(".hover").removeClass("selected");
		}
		$(this).addClass("selected").prevAll().addClass("selected");
	});
};

app.filterBooks = function () {
	filteredBooksArray = [];
	data.forEach(function (val, i) {
		if (val.average_rating >= app.rating && val.average_rating <= app.rating + 1) {
			filteredBooksArray.push(val);
		}
	});
	//app.displayBooks()
};

app.selectAuthor = function () {
	$("label").on("click", function (e) {
		e.preventDefault();
		app.author = $(this).prev().val();
		app.getAuthorID();
		console.log(app.author);
		$(this).siblings().hide();
		$(this).find("p").hide();
		$(this).css("position", "absolute").animate({
			left: 0
		}, "slow").find("img").animate({
			width: 200,
			height: 200
		}, "slow");
		$(".authorHeading").fadeIn();
		$(".authorHeading h2").text(app.author);
	});
};

app.resetSearch = function () {
	$(".reset").on("click", function (e) {
		var $label = $("label");
		e.preventDefault();
		$label.show();
		$label.animate({}, function () {
			$(this).removeAttr("style");
		});
		$label.find("p").show();
		$label.find("img").animate({
			width: 150,
			height: 150
		}, "slow");
		$(".authorHeading").hide();
	});
};

app.getBookList = function () {
	$.ajax({
		url: 'http://proxy.hackeryou.com',
		dataType: 'json',
		method: 'GET',
		data: {
			reqUrl: app.authorBooksUrl + app.authorID,
			params: {
				key: app.apiKey
			},
			xmlToJSON: true
		}
	}).then(function (data) {
		console.log(data);
	});
};

app.init = function () {
	// app.getAuthorID();
	app.selectAuthor();
	app.starHover();
	app.resetSearch();
};

$(function () {
	app.init();
});