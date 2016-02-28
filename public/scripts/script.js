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

app.promise = function () {
	$.when(app.authorInfo, app.getBookList).done(function (authorData, bookData) {
		app.getBookInfo(authorData);

		var books = bookData.GoodreadsResponse.author.books.book;
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
		app.displayBio(data);
	});
};

//app.bookArray will be the array we will store all the authors books
//app.allBookArray is the general array that will store the array of books passed on to display from the filter function to display and from initial ajax call to display
// Function to choose author/get name by clicking pictures
app.selectAuthor = function () {
	$("label").on("click", function (e) {
		app.bookArray = [];
		app.allBookArray = [];
		e.preventDefault();
		app.author = $(this).prev().val();
		app.getAuthorID();
		console.log(app.author);
		$(this).siblings().hide();
		//$(this).find("p").hide();
		$(this).find("p").css("font-size", "24px");
		$(this).css("position", "absolute").animate({
			left: 0
		}, "slow").find("img").animate({
			width: 200,
			height: 200
		}, "slow");
		$(".authorHeading").fadeIn();
		// On author select, calls the function to get
		app.getBookInfo;
		//$(".authorHeading h2").text(app.author);
	});
};

// Function to access list of author's books
app.page = 1;

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
		app.compareBookList(data);
	});
};

// If the number at the end of the page is equal to the total number of books, then console.log the list of books

app.compareBookList = function (bookList) {

	if (bookList.GoodreadsResponse.author.books.end === bookList.GoodreadsResponse.author.books.total) {

		app.bookArray = app.allBookArray;
		console.log(app.bookArray);
		app.displayBooks();

		// If the number at the end of the page is equal to the total number of books, then console.log the list of books
		// Otherwise, add one to app.page and run the function again.
	} else {
			app.page++;
			app.getBookList();
			console.log(bookList.GoodreadsResponse.author.books.end);
			console.log(bookList);
		};
};

// Display author's biography information
app.displayBio = function (bioInformation) {
	console.log("hi");
	$.each(bioInformation, function (i, info) {
		var authorProfile = $("<p class='link-to-goodreads'>").html("<a href='" + bioInformation.GoodreadsResponse.author.link + "'>See her Goodreads profile</a>");
		console.log(bioInformation.GoodreadsResponse.author.link);
		var authorHometown = $("<p class='hometown'>").html(bioInformation.GoodreadsResponse.author.hometown);

		// Author's Goodreads bio
		var weirdAbout = bioInformation.GoodreadsResponse.author.about;
		// This is not secure and should not be used but we used it!
		var authorAbout = $("<p>").html(weirdAbout).text();
		$("#authorBio").empty();
		$("#authorBio").append(authorAbout, authorProfile);

		var hometown = $("<p>").html(bioInformation.GoodreadsResponse.author.hometown);
		$(".authorLabel").append(hometown);
	});
};
var $container;
// Display list of author's books
app.displayBooks = function () {
	console.log("entered displayBooks");
	$(".filters").show();
	// $("#books").empty();

	var bookHtml = $("#authorTemplate").html();
	var bookTemplate = Handlebars.compile(bookHtml);
	app.bookArray.forEach(function (data, i) {
		$("#books").append(bookTemplate(data));
	});

	$container = $('#books').isotope({
		itemSelector: '.book-gallery',
		percentPosition: true,
		// layoutMode: 'vertical',
		masonry: {
			columnWidth: '.book-gallery'
		},
		getSortData: {
			name: '.name',
			year: '.publicationYear span',
			number: function number(bookRating) {
				var rating = $(bookRating).find('.rating span').text();
				return parseFloat(rating.replace(/[\(\)]/g, ''));
			} //closes number
		} //closes getSortData
	}); // closes $container

	$container.imagesLoaded().progress(function () {
		$container.isotope('layout');
	});
};

app.sortBooks = function () {

	$("#sortByTitle").on("click", function (e) {
		e.preventDefault();
		$container.isotope({ sortBy: 'name' });
	});

	$("#sortByRating").on("click", function (e) {
		e.preventDefault();
		console.log("sort by rating click");
		$container.isotope({
			sortBy: 'number',
			sortAscending: {
				number: false
			}
		});
	});

	$("#sortByPubYear").on("click", function (e) {
		e.preventDefault();
		$container.isotope({
			sortBy: 'year',
			sortAscending: {
				year: false
			}
		});
	});

	$('.star').on('click', function () {
		if ($(this).hasClass("selected") && $(this).hasClass("hover")) {
			$(".star").not(".hover").removeClass("selected");
		}
		$(this).addClass("selected").prevAll().addClass("selected");
		var filterValue = $(this).data('rating');
		console.log(filterValue);

		$container.isotope({
			// filter element with numbers greater than filterValue
			filter: function filter() {
				// _this_ is the item element. Get text of element's .number
				var number = $(this).find('.rating span').text();
				return parseFloat(number) >= filterValue;
			} //close filter fn
		}); //close $container

		app.noResults();
	});

	$("#showAll").on("click", function (e) {
		e.preventDefault();
		$(".books p").hide();
		$(".star").removeClass("selected");
		$container.isotope({
			filter: '*'
		});
	});
};

app.noResults = function () {

	//arrayOfDisplayBlock = [];
	$(".book-gallery").each(function () {
		var displayStatus = $(this).css("display");
		console.log(displayStatus);
		if ($(this).css("display") === "block") {
			console.log("displayblock");
			//	arrayOfDisplayBlock.push($(this));
		}
		//console.log(arrayOfDisplayBlock);
	});
};

// Reset button for authors
app.resetSearch = function () {
	$(".reset").on("click", function (e) {
		var $label = $("label");
		e.preventDefault();
		$container.isotope('destroy');
		$('#books').empty();
		$(".filters").hide();
		$(".stars").removeClass("selected");
		$label.show();
		$label.animate({}, function () {
			$(this).removeAttr("style");
		});
		$label.find("p").removeAttr('style');
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
	});
};

app.init = function () {
	// app.getAuthorID();
	app.selectAuthor();
	app.starHover();
	app.resetSearch();
	app.sortBooks();
};

$(function () {
	console.log("running");
	app.init();
});