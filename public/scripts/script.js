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

// Find author's ID by searching their name
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

// Access author's Goodreads page via their author ID
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

// Get author's bio information from their Goodreads profile
app.getBookInfo = function (authorData) {
	// Author's Goodreads profile link
	var authorProfile = authorData.GoodreadsResponse.author.link;
	console.log(authorProfile);
	// Author's hometown
	var authorHometown = authorData.GoodreadsResponse.author.hometown;
	console.log(authorHometown);
	// Author's Goodreads bio
	var about = authorData.GoodreadsResponse.author.about;
	console.log(about);
};

<<<<<<< HEAD
=======
// Handlebars template to display books
app.displayBooks = function () {
	$("#books").empty();
	var bookHtml = $("#authorTemplate");
	var template = Handlebars.compile(bookHtml);
	//data.forEach(function(val, i){
	//	$("#books").append(template(val));
	//})
};

// Function to choose author/get name by clicking pictures
>>>>>>> 949e2df92c738c914b41a86453ba223212b693fe
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
<<<<<<< HEAD
//this will be the array we will store all the authors books
app.allBookArray = [];
=======

// Function to access list of author's books
>>>>>>> 949e2df92c738c914b41a86453ba223212b693fe
app.page = 1;
//app.bookArray is the general array that will store the array of books passed on to display from the filter function to display and from initial ajax call to display -
app.bookArray = [];

app.getBookList = function () {
	$.ajax({
		url: 'http://proxy.hackeryou.com',
		dataType: 'json',
		method: 'GET',
		data: {
			reqUrl: app.authorBooksUrl + app.authorID,
			params: {
				key: app.apiKey,
				page: app.page
			},
			xmlToJSON: true
		}
	}).then(function (data) {
		console.log(data);
		var books = data.GoodreadsResponse.author.books.book;

<<<<<<< HEAD
		if (data.GoodreadsResponse.author.books.end === data.GoodreadsResponse.author.books.total) {
			books.forEach(function (val, i) {
				app.allBookArray.push(val);
			});

			app.bookArray = app.allBookArray;

			console.log(app.bookArray);
			app.displayBooks();
		} else {
			app.page++;
			app.getBookList();
			console.log(data.GoodreadsResponse.author.books.end);
		};
=======
		books.forEach(function (val, i) {
			app.bookArray.push(val);
		});
		// If the number at the end of the page is equal to the total number of books, then console.log the list of books
		if (data.GoodreadsResponse.author.books.end === data.GoodreadsResponse.author.books.total) {
			console.log(data.GoodreadsResponse.author.books);
			// Otherwise, add one to app.page and run the function again.
		} else {
				app.page++;
				app.getBookList();
				console.log(data.GoodreadsResponse.author.books.end);
			};
		console.log(app.bookArray);
>>>>>>> 949e2df92c738c914b41a86453ba223212b693fe
	});
};

// Filter books by rating
app.filterBooks = function () {
<<<<<<< HEAD
	app.filteredBooksByRating = [];
	console.log("entered filterBooks");
	// console.log(app.rating);
	app.bookArray.forEach(function (val, i) {
		console.log(val);
		if (val.average_rating >= app.rating && val.average_rating <= app.rating + 0.99) {
			console.log("enter if");
			console.log(val.average_rating);
			app.filteredBooksByRating.push(val);
		}
	});
	console.log(app.filteredBooksByRating);
	if (app.filteredBooksByRating.length === 0) {
		$("#books").empty();
		$(".books h3").show().text("No books found with this rating");
	} else {
		$(".books h3").hide();
		app.bookArray = app.filteredBooksByRating;
		app.displayBooks();
	}

	$("#showAll").on("click", function (e) {
		console.log("showall");
		e.preventDefault();
		$(".books h3").hide();
		app.bookArray = app.allBookArray;
		app.displayBooks();
	});
};

app.displayBooks = function () {
	console.log("entered displayBooks");
	$("#books").empty();
	var bookHtml = $("#authorTemplate").html();
	var bookTemplate = Handlebars.compile(bookHtml);
	app.bookArray.forEach(function (data, i) {
		$("#books").append(bookTemplate(data));
	});
=======
	filteredBooksArray = [];
	data.forEach(function (val, i) {
		if (val.average_rating >= app.rating && val.average_rating <= app.rating + 1) {
			filteredBooksArray.push(val);
		}
	});
	//app.displayBooks()
>>>>>>> 949e2df92c738c914b41a86453ba223212b693fe
};

// Reset button for authors
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

// Hover effects for stars
app.starHover = function () {
	$(".oneStar, .twoStar, .threeStar, .fourStar, .fiveStar ").on("mouseenter", function () {
		$(this).addClass("hover").prevAll().addClass("hover");
	}).on("mouseleave", function () {
		$(this).removeClass("hover").prevAll().removeClass("hover");
	}).on("click", function (e) {
		e.preventDefault();
		app.rating = $(this).data("rating");
<<<<<<< HEAD
		app.rating = parseInt(app.rating);
		console.log(app.rating);
		app.bookArray = app.allBookArray;
		app.filterBooks();
=======
		console.log(app.rating);
		//app.filteredBooks();
>>>>>>> 949e2df92c738c914b41a86453ba223212b693fe
		if ($(this).hasClass("selected") && $(this).hasClass("hover")) {
			$(".star").not(".hover").removeClass("selected");
		}
		$(this).addClass("selected").prevAll().addClass("selected");
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