// Get the initial state
var imdbState;

// Open a persistent connection between the background and the content scripts
var port = chrome.extension.connect({name: "imdbLess"});
port.postMessage({whatState: "State"});
port.onMessage.addListener(function(msg) {
    console.log('Message received: ' + msg.theState);
    if (msg.theState == 'more') 
    {
        $('#off').addClass('selected');
        $('#on').removeClass('selected');
        //$('body').addClass('less-imdb-off');
        imdbState = 'more';
    }
    else if (msg.theState == 'less')
    {
        $('#on').addClass('selected');
        $('#off').removeClass('selected');
        //$('body').removeClass('less-imdb-off');
        console.log('Modify the page!');
        imdbState = 'less';
        modifyPage();
    }
});

$('html').addClass('webkit');

// ######### ADD MENU  ######### //
$('<div id="less-imdb-control"><span class="label">Less IMDb</span><div id="imdb-controls"><div id="on" class="imdb-toggle selected">On<div class="radio-outer"><div class="radio-inner"></div></div></div><div id="off" class="imdb-toggle">Off<div class="radio-outer"><div class="radio-inner"></div></div></div></div></div>').appendTo('body#styleguide-v2');
$('#less-imdb-control .label').css('background', 'url('+chrome.extension.getURL('assets/less-imdb-control-icon.png')+') no-repeat left top');

var firstRun = true;	

function modifyPage() {
	 // Get the URL then see if it's a /title or /name page
	var requestURL = window.location.href;
	var pagePattern = /^http\:\/\/(www|uk).imdb.com\/(title|name)\/.*/;
	if (firstRun == true && requestURL.match(pagePattern)) {
    firstRun = false;
		if($('#on').hasClass('selected')){

// ######### BEGIN MODIFY TITLE & NAME PAGE LAYOUT  ######### //


			//Add classes to divs we want to show
			$("#maindetails_sidebar_top .mediastrip_big").parent('div').addClass('video');
			$("#filmography").parent('.article').addClass('filmography');
			$("table.cast_list").parent('.article').addClass('cast-list');
			$(".article > h2:contains('Storyline')").parent('.article').addClass('storyline');
			$(".article > h2:contains('Did You Know?')").parent('.article').addClass('trivia');
			$(".article > h2:contains('Details')").parent('.article').addClass('details');
			$(".article h4:contains('Season')").parent().parent('.article').addClass('season-year');
			
			//Move things to the sidebar
			var awards = $('.highlighted').html();
			var photos = $('.mediastrip').parent().html();			
			var movie = $('#title-overview-widget-layout').parent('div').parent().html();
			var bio = $('#name-overview-widget-layout').parent().html();
			
			if(photos != ''){
				photos = '<div class="article">'+photos+'</div>';
			} else {
				photos = '';
			}
			if(movie != null){
				movie = '<div class="article movie">'+movie+'</div>';
			} else {
				movie = '';
			}
			if(bio != null){
				bio = '<div class="article bio">'+bio+'</div>';
			} else {
				bio = '';
			}
			if(awards != null){
				awards = '<div class="article highlighted">'+awards+'</div>';
			} else {
				awards = '';
			}

			var alldivs = bio + movie + awards + photos;
			$('#maindetails_sidebar_top').prepend(alldivs);
			
			$("#maindetails_sidebar_top .star-box").addClass("gradient-box").removeClass("star-box giga-star")
			
			//Moving things around for the alternate layout
			$('#maindetails_sidebar_top #overview-top .infobar').appendTo('#maindetails_sidebar_top > div.movie');
			$('#maindetails_sidebar_top h1.header').prependTo('#maindetails_sidebar_top > div.movie');
			$('#maindetails_sidebar_top #overview-top .infobar').prependTo('#maindetails_sidebar_top > div.bio');
			$('#maindetails_sidebar_top h1.header').prependTo('#maindetails_sidebar_top > div.bio');
			$('#maindetails_sidebar_top .highlighted').appendTo('#maindetails_sidebar_top div.star-box');
			//$('#maindetails_sidebar_top .highlighted').appendTo('#maindetails_sidebar_top #name-overview div.txt-block');
			$('#maindetails_sidebar_top h1.header').after('<div class="star-box giga-star"></div>');
			$("#maindetails_sidebar_top .star-box-giga-star").prependTo('#maindetails_sidebar_top > div.movie > div.giga-star');
			//Save copy of writer/director/castandcrew
			var castCrew = $("#main div.see-more a:contains('Full cast and crew')").parent('.see-more').html();
			var writerCreator = $(".txt-block > h4:contains('Writer:'), .txt-block > h4:contains('Writers:'),.txt-block > h4:contains('Creator:'), .txt-block > h4:contains('Creators:')").parent('.txt-block').html();
			var director = $(".txt-block > h4:contains('Director:'), .txt-block > h4:contains('Directors:')").parent('.txt-block').html();

			if(writerCreator != null){
				writerCreator = '<div class="writer-director">'+writerCreator+'</div>';
			} else {
				writerCreator = '';
			}
			if(director != null){
				director = '<div class="writer-director">'+director+'</div>';
			} else {
				director = '';
			}
			if(castCrew != null){
				castCrew = '<div class="writer-director">'+castCrew+'</div>';
			} else {
				castCrew = '';
			}

			//Hide the original writer/director/castandcrew
			$("#main div.see-more a:contains('Full cast and crew')").parent('.see-more').hide();
			$(".txt-block > h4:contains('Writer:'), .txt-block > h4:contains('Writers:'),.txt-block > h4:contains('Creator:'), .txt-block > h4:contains('Creators:')").parent('.txt-block').hide();
			$(".txt-block > h4:contains('Director:'), .txt-block > h4:contains('Directors:')").parent('.txt-block').hide();
			
			//Move copy of writer/director/castandcrew to sidebar
			// $('td#img_primary').append(director);
			$('td#img_primary').append(writerCreator);
			$('td#img_primary').append(castCrew);

			$("#maindetails_sidebar_top #title-overview-widget").prepend($("#maindetails_sidebar_top [itemprop='description']"));
			$('#maindetails_sidebar_top h1.header').append("<div id=director-box></div>");
			$('#director-box').append(director);
			
			//Disable show/hide functionality
			//headOnClick = $('.head').attr('onclick');
			//$('.less-imdb .head').attr('onclick', '');
			
			//Expand all filmography
			$('#filmography > div').show();
			
			//No more show/hide links
			$('.filmo-show-hide-all').addClass('hide');
			$('.hide-link').addClass('hide');
			$('.show-link').addClass('hide');

			// Add our new styles
			$('html').addClass('webkit');
			$('body').removeClass('less-imdb-off');
			$('body').addClass('less-imdb');
			$('#maindetails_sidebar_top').prependTo('#content-2-wide');
			
			// Show it all again
			$('#content-2-wide').css('opacity','1');
			
			
			//var shittyAds = $('style#css-style-generic').html();
			//alert(shittyAds);
			//var shittyAds = $("#styleguide-v2").getStyleObject(); // copy all computed CSS properties
			
			//$('style#css-style-generic').remove();
			//shittyAds = '<style type="text/css" id="css-style-generic">'+shittyAds+'</div>';

// ######### BEGIN RESTORE TITLE & NAME PAGE LAYOUT  ######### //

		} else {
		
			$('body').removeClass('less-imdb');
			//Remove articles from the sidebar
			$('#maindetails_sidebar_top .article').remove();
			$('.writer-director').remove();
			$("#maindetails_sidebar_top div.see-more a:contains('Full cast and crew')").parent('.see-more').remove();
			
			//Show original writer/director/castandcrew
			$(".txt-block > h4:contains('Writer:'), .txt-block > h4:contains('Writers:'),.txt-block > h4:contains('Creator:'), .txt-block > h4:contains('Creators:')").parent('.txt-block').show();
			$(".txt-block > h4:contains('Director:'), .txt-block > h4:contains('Directors:')").parent('.txt-block').show();
			$("#main div.see-more a:contains('Full cast and crew')").parent('.see-more').show();
			
			//Re-enableDisable show/hide functionality
			$('.head').attr('onclick', headOnClick);
			
			
			$('body').addClass('less-imdb-off');
			$('body').removeClass('less-imdb-global');
			
			// Restore shitty ads
			//shittyAds = '<style type="text/css" id="css-style-generic">'+shittyAds+'</div>';
			//$('head').append('<style type="text/css" id="css-style-generic">'+shittyAds+'</div>');
			//$('head').append(shittyAds);
			//alert(shittyAds);
			
		} // End if #on has class selected

	} // End if url pattern matches
	
	else {
	
    firstRun = false;
		if($('#on').hasClass('selected')){

// ######### BEGIN MODIFY OF NON-TITLE & NAME PAGE LAYOUT  ######### //

			$('body').addClass('less-imdb-global');

// ######### BEGIN RESTORE OF NON-TITLE & NAME PAGE LAYOUT  ######### //

		} else {

			$('body').removeClass('less-imdb-global');
			$('body').addClass('less-imdb-off');
			
		} // End if #on has class selected (general pages)
	
	} // End else url pattern matches

} // End modify page function

var fadeDuration = 120; //time in milliseconds
      
  $('#on').click(function() {
    if(!$(this).hasClass('selected')){
      $(this).addClass('selected');
      $('#off').removeClass('selected');
      $('body').removeClass('less-imdb-off');
      firstRun = true;
      modifyPage();
      port.postMessage({changeStateTo: 'less'});
    }
  });

  $('#off').click(function() {
    if(!$(this).hasClass('selected')){
      $(this).addClass('selected');
      $('#on').removeClass('selected');
      $('body').removeClass('title-name');
      $('body').removeClass('lookfor');
      $('body').addClass('less-imdb-off');
      firstRun = true;
      modifyPage();
      port.postMessage({changeStateTo: 'more'});
    }
  });
  modifyPage();