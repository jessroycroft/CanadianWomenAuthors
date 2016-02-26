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

// Function to choose author/get name by clicking pictures
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
		// On author select, calls the function to get
		app.getBookInfo;
		$(".authorHeading h2").text(app.author);
	});
};

//this will be the array we will store all the authors books
app.allBookArray = [];

// Function to access list of author's books
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
		books.forEach(function (val, i) {
			app.allBookArray.push(val);
		});

		// If the number at the end of the page is equal to the total number of books, then console.log the list of books

		if (data.GoodreadsResponse.author.books.end === data.GoodreadsResponse.author.books.total) {

			app.bookArray = app.allBookArray;
			console.log(app.bookArray);
			app.displayBooks();

			// If the number at the end of the page is equal to the total number of books, then console.log the list of books
			// Otherwise, add one to app.page and run the function again.
		} else {
				app.page++;
				app.getBookList();
				console.log(data.GoodreadsResponse.author.books.end);
			};
	});
};

// Filter books by rating
app.filterBooks = function () {
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

// Get author's bio information from their Goodreads profile
app.getBookInfo = function (authorData) {
	// Author's Goodreads profile link
	app.authorProfile = authorData.GoodreadsResponse.author.link;
	// Author's hometown
	app.authorHometown = authorData.GoodreadsResponse.author.hometown;
	// Author's Goodreads bio
	app.authorAbout = authorData.GoodreadsResponse.author.about;
	// Stores all of this information in an object for Handlebars to access
	app.bioInformation = {
		profile: app.authorProfile,
		hometown: app.authorHometown,
		about: app.authorAbout
	};
	console.log(app.bioInformation);
	// Calls the Handlebars function for displaying the author's biography info
	app.displayBio();
};

// Display author's biography information
app.displayBio = function () {
	console.log(app.bioInformation);
	console.log("enter display bio");
	$("#authorBio").empty();
	var bioHtml = $("#authorBioTemplate").html();
	var bioTemplate = Handlebars.compile(bioHtml);
	$("#authorBio").append(bioTemplate(app.bioInformation));
};

// Display list of author's books
app.displayBooks = function () {
	console.log("entered displayBooks");
	$("#books").empty();
	var bookHtml = $("#authorTemplate").html();
	var bookTemplate = Handlebars.compile(bookHtml);
	app.bookArray.forEach(function (data, i) {
		$("#books").append(bookTemplate(data));
	});
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
		app.rating = parseInt(app.rating);
		console.log(app.rating);
		app.bookArray = app.allBookArray;
		app.filterBooks();
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
	console.log("running");
	app.init();
});