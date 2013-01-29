// Array containing names of all 'pages' in the site
var pages = new Array(
	"frontpage",	// Default page
	"load",
	"part1",
	"part2",
	"part3",
	"part4",
	"incompatible"
);

// Is the page a valid page?
function page()
{
	var curHash = window.location.hash.substring(1);
	var flag = true;
	var i;
	for(i=0; i<pages.length && flag; i++)
		if(pages[i] == curHash)
			flag = false;
	if(flag)
		return "";
	return pages[i-1];
}
var prevPage = ""; // This will always be set to the previously-visited page (except at load)

// Change to the page specified in the hash
function changePage() {
	// Check if all the "story" elements need to enter/exit
	var curPage = page();
	if(curPage == prevPage)
		return;
	if(prevPage.substring(0,4) == "part" && curPage.substring(0,4) != "part") {
		// unload story elements
		story.leave();
	}
	else if(prevPage.substring(0,4) != "part" && curPage.substring(0,4) == "part") {
		// load story elements
		story.enter();
	}
	// Otherwise we're already in a story

	if(prevPage != "") {
		eval(prevPage).leave(eval(curPage).enter);
	}
	else {
		eval(curPage).enter();
	}
	prevPage = curPage;
}

function flyLeft(div) {
	$(div).animate({
		left: '-=5000'
	},2000,"",function(){
		$(this).hide().css('left','+=5000')	});
}
function fadeIn(div, callback) {
	$(div).css('opacity','0').show().animate({
		opacity: '1'
	},500);
	if(callback)
		callback();
}
function fadeOut(div) {
	$(div).animate({
		opacity: '0'
	},500, function(){$(div).hide();});
}

// And actually change the size of the red bar
function redbarResize() {
	var parentThis = story;
	var index = eval(page().substring(4))-1;
	var newPercent = (parentThis.interview[index].getTime() / parentThis.interview[index].getDuration())*100
	$('div#redbar').css('width',newPercent+'%');
	
	$('h2#audioTime').html(buzz.toTimer(parentThis.interview[index].getDuration() - parentThis.interview[index].getTime()));
}

function refitButtons() {
		$('div#redbar').css('top',$(window).height()-20);
		$('div#greybar').addClass('greybarPlay').css('top',$(window).height()-20);
		$('div#audiocontrols').css('top',$(window).height()-70).delay(400);
		$('div#partcontrols').css('top',$(window).height()-100).delay(400);
}

// Convert from minutes to hours
function minToHours(val) {
	var minutes = val%60;
	if(minutes >= 10)
		return Math.floor(val/60)+":"+minutes;
	return Math.floor(val/60)+":0"+minutes;
}

// Photo gallery
var imageGalleries = new Array();
function loadGalleries() {
	// Please don't use this unless you absolutely need to
	$('div.photogallery').each(function(){
		var index = eval($(this).attr('id').substr(7,8))-1;
		imageGalleries[index] = new photoGallery(this);
		imageGalleries[index].init();
	});
}

function photoGallery(div) {
	var curGallery = this;
	var curCaption;
	this.curImage = 0;
	this.images = new Array();
	this.imageCaptions = new Array();
	this.imageCredits = new Array();
	this.container = div;

	this.init = function() {
		var i = 0;
		$(div).children().children().each(function(){
			curGallery.images[i] = $(this).attr('src');
			curGallery.imageCaptions[i] = $(this).attr('title');
			if(!curGallery.imageCaptions[i])
				curGallery.imageCaptions[i] = "";
			curGallery.imageCredits[i] = $(this).attr('credit');
			if(!curGallery.imageCredits[i])
				curGallery.imageCredits[i] = "Daily Bruin";
			i++;
		});
				
		$(div).append("<div class='caption'></div>");
		curCaption = $(div).children().last();

		$(curCaption).append("<div class='gallerycap'></div>");
		$(curCaption).append("<div class='gallerycontrols'><span class='gallery_prev'>Previous</span><span class='gallery_next'>Next</span>");
		
		$(curCaption).children().last().children('.gallery_prev').bind('click',curGallery.prevImage);
		$(curCaption).children().last().children('.gallery_next').bind('click',curGallery.nextImage);

		
		// Change to first image
		changeImage(0);
	}
	
	this.nextImage = function() {
		changeImage(curGallery.curImage+1);
	}
	this.prevImage = function() {
		changeImage(curGallery.curImage-1);
	}

	
	function changeImage(nextID) {
		if(nextID >= curGallery.images.length || nextID < 0)
			return;
		$(curCaption).children().last().children('.gallery_prev').removeClass('disabled');
		$(curCaption).children().last().children('.gallery_next').removeClass('disabled');
		if(nextID == 0) {
			$(curCaption).children().last().children('.gallery_prev').addClass('disabled');
		}
		if(nextID == (curGallery.images.length-1))
			$(curCaption).children().last().children('.gallery_next').addClass('disabled');
		$(div).children().first().css('background-image','url("'+curGallery.images[nextID]+'")');
		
		$(curCaption).children().first().html(curGallery.imageCaptions[nextID]+"<span class='gallerycredit'>"+curGallery.imageCredits[nextID]+"</span>");
		
		curGallery.curImage = nextID;
	}
}

//-------------------------------------------------------------------//
//-----------------------------FRONTPAGE-----------------------------//
//-------------------------------------------------------------------//
var frontpage = new function() {
	function resizeBars() {
		$('div#redbar').css('width',$('div#frontpage').offset().left+300);
		$('div#greybarfront').css('width',$('div#frontpage').offset().left+200);
	}

	this.enter = function() {
		$('div#frontpage').fadeIn();
		$('div#redbar').css('width',$('div#frontpage').offset().left+300).fadeIn();
		$('div#greybarfront').css('width',$('div#frontpage').offset().left+200).fadeIn();
		
		$(window).bind('resize',resizeBars);
	},	
	this.leave = function(callback) {
		fadeOut('div#frontpage');
		fadeOut('div#greybarfront');
		$('div#redbar').addClass('redbarPlay');
		$(window).unbind('resize',resizeBars);
		
		if(callback)
			callback();
	}
}

//-------------------------------------------------------------------//
//-------------------------------LOAD--------------------------------//
//-------------------------------------------------------------------//
var load = new function() {
	// Not yet implemented.
	this.enter = function() {
		window.location.hash="part1";
	}
	this.leave = function(callback) {
	
		if(callback)
			callback();
	}
}

var redbarIntervalCheck;

//-------------------------------------------------------------------//
//------------------------------PART 1-------------------------------//
//-------------------------------------------------------------------//
var part1 = new function() {
	this.enter = function() {
		$('#prevpage').css('opacity','0.1').removeAttr('href');
		$('#nextpage').attr('href',"#part2");
		$('a#startlabel').animate({color:'#9b2520'},500);
		
		$('a#map_part1').css('color','white').children().css('color','white');

		// Part data
		$('span.partno').html('1');
		$('h2#info_hours').html('1:08:02');
		$('h2#info_distance').html('6.21');
		$('h2#info_time').html('8:47');
		$('h2#info_location').html('Downtown Los Angeles');
		$('h3#info_time_ampm').html('a.m.');
		
		$('img#redtrack1').fadeIn();
		$('div#part1').fadeIn();
		
		story.stopAllSounds();
		story.interview[0].load();		
		story.playInterview();
		
		// Poll the audio track for changes to resize the red bar
		redbarIntervalCheck = setInterval(redbarResize,100);
		
		// Toggle playback change and button state change when the playback ends
		var partno = 1;
		story.interview[partno-1].bind('ended',function(){
			story.stopInterview();
			if(partno < 4)
				$('a#nextpage').addClass('redglow')
		});
		
		$('h2#audioTime').html(buzz.toTimer(story.interview[0].getDuration()));		
		story.interview[0].bind('loadedmetadata',function(){
			$('h2#audioTime').html(buzz.toTimer(story.interview[0].getDuration()));
		});
		
		
		$('a#nextpage').removeClass('redglow')
		
	}
	this.leave = function(callback) {
		// Unbind for audio toggle
		var partno = 1;
		// Remove interval check to resize bar
		clearInterval(redbarIntervalCheck);

		$('a#nextpage').removeClass('redglow')
		$('#prevpage').css('opacity','1');
		$('a#startlabel').animate({color:'#AAA'},500);
		
		$('a#map_part1').css('color','#AAA').children().css('color','#AAA');
		
		$('img#redtrack1').fadeOut();
		$('div#part1').fadeOut();
		
		if(callback)
			callback();
	}


}


//-------------------------------------------------------------------//
//------------------------------PART 2-------------------------------//
//-------------------------------------------------------------------//
var part2 = new function() {
	this.enter = function() {
		$('#prevpage').attr('href',"#part1");
		$('#nextpage').attr('href',"#part3");
		
		// Part data
		$('span.partno').html('2');
		$('h2#info_hours').html('2:12:25');
		$('h2#info_distance').html('12.4');
		$('h2#info_time').html('9:51');
		$('h2#info_location').html('Hollywood');
		$('h3#info_time_ampm').html('a.m.');
		
		story.stopAllSounds();
		story.interview[1].load();		
		story.playInterview();
		
		$('img#redtrack2').fadeIn();
		$('div#part2').fadeIn();
		
		$('a#map_part2').css('color','white').children().css('color','white');
		
		// Poll the audio track for changes to resize the red bar
		redbarIntervalCheck = setInterval(redbarResize,100);
		
		// Toggle playback change and button state change when the playback ends
		var partno = 2;
		story.interview[partno-1].bind('ended',function(){
			story.stopInterview();
			if(partno < 4)
				$('a#nextpage').addClass('redglow')
		});
		
		$('h2#audioTime').html(buzz.toTimer(story.interview[1].getDuration()));		
		story.interview[1].bind('loadedmetadata',function(){
			$('h2#audioTime').html(buzz.toTimer(story.interview[1].getDuration()));
		});

		
		$('a#nextpage').removeClass('redglow')
	}
	this.leave = function(callback) {
		// Unbind for audio toggle
		var partno = 2;
		
		// Remove interval check to resize bar
		clearInterval(redbarIntervalCheck);

		$('img#redtrack2').fadeOut();
		$('div#part2').fadeOut();
		
		$('a#map_part2').css('color','#AAA').children().css('color','#AAA');

		$('a#nextpage').removeClass('redglow')
		if(callback)
			callback();
	}
}


//-------------------------------------------------------------------//
//------------------------------PART 3-------------------------------//
//-------------------------------------------------------------------//
var part3 = new function() {
	this.enter = function() {
		$('#prevpage').attr('href',"#part2");
		$('#nextpage').attr('href',"#part4");
		
		// Part data
		$('span.partno').html('3');
		$('h2#info_hours').html('3:19:01');
		$('h2#info_distance').html('18.6');
		$('h2#info_time').html('10:58');
		$('h2#info_location').html('Beverly Hills');
		$('h3#info_time_ampm').html('a.m.');
		
		story.stopAllSounds();
		story.interview[2].load();		
		story.playInterview();
		
		$('img#redtrack3').fadeIn();
		$('div#part3').fadeIn();
		
		$('a#map_part3').css('color','white').children().css('color','white');
		
		// Poll the audio track for changes to resize the red bar
		redbarIntervalCheck = setInterval(redbarResize,100);
		
		// Toggle playback change and button state change when the playback ends
		var partno = 3;
		story.interview[partno-1].bind('ended',function(){
			story.stopInterview();
			if(partno < 4)
				$('a#nextpage').addClass('redglow')
		});
		
		$('h2#audioTime').html(buzz.toTimer(story.interview[2].getDuration()));		
		story.interview[2].bind('loadedmetadata',function(){
			$('h2#audioTime').html(buzz.toTimer(story.interview[2].getDuration()));
		});
		
		$('a#nextpage').removeClass('redglow')
	}
	this.leave = function(callback) {
		// Unbind for audio toggle
		var partno = 3;
/* 		story.interview[partno-1].unbind('ended'); */

		// Remove interval check to resize bar
		clearInterval(redbarIntervalCheck);

		$('img#redtrack3').fadeOut();
		$('div#part3').fadeOut();
		
		$('a#map_part3').css('color','#AAA').children().css('color','#AAA');

		$('a#nextpage').removeClass('redglow')
		if(callback)
			callback();
	}
}


//-------------------------------------------------------------------//
//------------------------------PART 4-------------------------------//
//-------------------------------------------------------------------//
var part4 = new function() {
	var currentView = 0; // Views are: photos, race times, and race weather
	var maxView = 2;
	var graph1plotted=false;
	var graph2plotted=false;
	function changeView(nextView) {
		if(nextView > maxView || nextView < 0 || nextView == currentView)
			return;
		$('div#part4 div ul li.selected').removeClass('selected');
		if(nextView == 0) 
			$('div#part4 div ul').children().first().addClass('selected');
		else
			$('div#part4 div ul li:nth-child('+(nextView+1)+')').addClass('selected');
		
		// Fade out all possible elements
		$('div#gallery4').fadeOut();
		$('div#graph4_1').fadeOut();
		$('div#graph4_2').fadeOut();
		
		switch(nextView) {
			case 0:
				$('div#gallery4').fadeIn();	
				break;
			case 1:
				$('div#graph4_1').fadeIn();
				// Plot graph
				if(!graph1plotted) {
					$.plot($("#graph4_1_graph"), 
						[ { label: "Marathon", data: [ [1110088800000,345], [1110088800000,345], [1142748000000,289], [1162706400000,279], [1172988000000,285], [1204437600000,296], [1243227600000,308], [1269147600000,269], [1300597200000,313], [1332046800000,290]] },
						  {label: "1/2 Marathon", data:[ [1097384400000,125], [1102226400000,119], [1107669600000,117], [1129438800000,115], [1136700000000,122], [1160888400000,117], [1241240400000,120], [1246165200000,123], [1255237200000,115], [1273899600000,117] ]}
						 ],
						{ xaxis: {tickDecimals: 0, mode:"time", timeformat:"%y" ,monthNames:["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."], },
						  yaxis: {min:0, tickFormatter: function(val, axis) {
								return minToHours(val);
						},},
						  legend: {backgroundColor:''},
						  points: {show:true,radius:5},
						  lines: {show:true},
						  grid: {hoverable:true}
						}
					);
					$("#graph4_1_graph").bind('plothover',function(event,pos,item){
						if(item) {
							$("div#graph4_1_hover").stop(true).animate({
								top:item.pageY-$("div#graph4_1").offset().top-32,
								left:item.pageX-$("div#graph4_1").offset().left-6
							},100).html(minToHours(item.datapoint[1]));
							if($("div#graph4_1_hover").is(":hidden"))
								$("div#graph4_1_hover").show();
						}
					});
					$("div#graph4_1_hover").bind('mouseover',function(){$(this).hide();});
					graph1plotted = true;
				}
				break;
			case 2:
				$('div#graph4_2').fadeIn();
				// Plot graph
				if(!graph2plotted) {
					$.plot($("#graph4_2_graph"), 
						[ { label: "Race Start", data: [ [2004,62], [2005,56],[2006,49], [2007,66],[2008,53], [2009,59], [2010,54],[2011,55] ] },
						  { label: "Noon", data: [ [2004,84], [2005,68], [2006,59], [2007,83], [2008,67], [2009,66], [2010,66], [2011,57] ] },
						  {label: "Race Finish", data: [ [2004,76], [2005,63], [2006,56], [2007,77], [2008,60], [2009,63], [2010,58], [2011,54] ]}, ],
						{ xaxis: {tickDecimals: 0},
						  legend: {backgroundColor:''},
						  points: {show:true,radius:5},
						  lines: {show:true},
						  grid: {hoverable:true}
						}
					);
					$("#graph4_2_graph").bind('plothover',function(event,pos,item){
						if(item) {
							$("div#graph4_2_hover").stop(true).animate({
								top:item.pageY-$("div#graph4_2").offset().top-32,
								left:item.pageX-$("div#graph4_2").offset().left-6
							},100).html(item.datapoint[1]+"&deg;");
							if($("div#graph4_2_hover").is(":hidden"))
								$("div#graph4_2_hover").show();
						}
					});
					$("div#graph4_2_hover").bind('mouseover',function(){$(this).hide();});
					graph2plotted = true;
				}
				break;
		}
		currentView = nextView;
	}
	this.enter = function() {
		$('#prevpage').attr('href',"#part3");
		$('#nextpage').css('opacity','0.1').removeAttr('href',"");
		
		$('a#finishlabel').animate({color:'#9b2520'},500);
		
		$('a#map_part4').css('color','white').children().css('color','white');
		
		// Part data
		$('span.partno').html('4');
		$('h2#info_hours').html('4:50:05');
		$('h2#info_distance').html('26.8');
		$('h2#info_time').html('12:29');
		$('h2#info_location').html('Santa Monica');
		$('h3#info_time_ampm').html('p.m.');
			
		story.stopAllSounds();
		story.interview[3].load();		
		story.playInterview();

		$('img#redtrack4').fadeIn();
		$('div#part4').fadeIn();

		// Poll the audio track for changes to resize the red bar
		redbarIntervalCheck = setInterval(redbarResize,100);

		// Toggle playback change and button state change when the playback ends
		var partno = 4;
		story.interview[partno-1].bind('ended',function(){
			story.stopInterview();
			if(partno < 4)
				$('a#nextpage').addClass('redglow')
		});

		// Bind change story buttons
		var i = 0;
		$('div#part4 div.part_nav ul li').each(function() {
			var j = i;
			$(this).bind('click',function(){changeView(j);});
			i++;
		});

		$('h2#audioTime').html(buzz.toTimer(story.interview[3].getDuration()));		
		story.interview[3].bind('loadedmetadata',function(){
			$('h2#audioTime').html(buzz.toTimer(story.interview[3].getDuration()));
		});
			
		$('a#nextpage').removeClass('redglow')
		
	}
	this.leave = function(callback) {
		// Unbind for audio toggle
		var partno = 4;
/* 		story.interview[partno-1].unbind('ended'); */

		// Remove interval check to resize bar
		clearInterval(redbarIntervalCheck);

		$('a#finishlabel').animate({color:'#AAA'},500);

		$('img#redtrack4').fadeOut();
		$('div#part4').fadeOut();
		
		$('a#map_part4').css('color','#AAA').children().css('color','#AAA');

		$('a#nextpage').removeClass('redglow')
		$('#nextpage').css('opacity','1');
		if(callback)
			callback();
	}
}

//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
//--------------------------STORY ELEMENTS---------------------------//
// Elements that are loaded or unloaded as part of the story. This---//
// includes the audio player, map, etc.------------------------------//
//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
var story = new function() {
	this.interview = new Array();
	this.stopAllSounds = function() {
		for(var i = 0; i < 4; i++)
			this.interview[i].stop(300);
		story.playButton.play();
	}
	this.playButton = new function() {
		this.play = function() {
			$('button#playpause').css('background-position','left');
		}
		this.pause = function() {
			$('button#playpause').css('background-position','right');
		}
		// Returns what state the button is currently in
		this.state = function() {
			var position = $('button#playpause').css('background-position').substring(0,1);
			if (position == "1")
				return "pause";
			return "play";
		}

	}
	this.playInterview = function() {
		var parentThis = story;
		var index = eval(page().substring(4))-1;
		parentThis.interview[index].play()
		parentThis.playButton.pause();
	}
	this.pauseInterview = function() {
		var parentThis = story;
		var index = eval(page().substring(4))-1;
		parentThis.interview[index].pause()
		parentThis.playButton.play();
	}
	this.stopInterview = function() {
		var parentThis = story;
		var index = eval(page().substring(4))-1;
		parentThis.interview[index].stop()
		parentThis.playButton.play();
	}
	this.toggleInterview = function() {
		var parentThis = story;
		var index = eval(page().substring(4))-1;
		if(story.playButton.state() == "play") {
			parentThis.interview[index].play()
			parentThis.playButton.pause();
		}
		else {
			parentThis.interview[index].pause();
			parentThis.playButton.play();
		}
	}
	this.setVolume = function(newVolume) {
		// change volume for every sound
		for(var i = 0; i < 4 && newVolume <= 100; i++)
			this.interview[i].setVolume(newVolume);
			
		// set color of all blocks to grey
		for(i = 1; i <= 7; i++)
			$('div#volumebutton'+i).css('background-color','#333');
		// set proper blocks to white
		var conversionConstant = 7/100;
		for(i = 0; i <=7; i++)
		{
			if((newVolume*.07) >= (i-1))
			$('div#volumebutton'+i).css('background-color','white');
		}

	}
	this.enter = function() {
		mapImage = new Image(); 
		mapImage.src = "img/track_grey.png";
		infoboxImage = new Image(); 
		infoboxImage.src = "img/infobox.png";
		playImage = new Image();
		playImage.src = "img/playsprite.png";
			
		// Attach all sound files
		for(var i = 0; i < 4; i++)
		{
			this.interview[i] = new buzz.sound("audio/part"+(i+1), {
				formats: [ "ogg", "mp3", "aac", "wav" ]});
		}

		// Load redbar
/*
		if($('div#redbar').is(":visible")) {
			$('div#redbar').animate({
				width:'100%',
			},1000, function() {
				$(this).animate({left:'0',top:$(window).height()-40,width:'10',paddingleft:'10'},700)
			}).addClass('redbarPlay');
		}
		
		if($('div#redbar').is(":hidden")) {
*/
			$('div#redbar').addClass('redbarPlay').css('top',$(window).height()-20);
			fadeIn('div#redbar');
/* 		} */
		
		// Load greybar
		$('div#greybar').addClass('greybarPlay').css('top',$(window).height()-20);
		fadeIn('div#greybar');

		// Load audiocontrols
		$('div#audiocontrols').css('top',$(window).height()-70).delay(400);
		fadeIn('div#audiocontrols');
		
		$('div#partcontrols').css('top',$(window).height()-100).delay(400);
		fadeIn('div#partcontrols');

		// Bind audio controls
		$('button#playpause').bind('click',story.toggleInterview);
		
		// Bind audio bars for control
		$('div#redbar').bind('click',function(e){ scrubAudio(e);});
		$('div#greybar').bind('click',function(e){ scrubAudio(e);});
		
		function scrubAudio(event) {
			var parentThis = story;
			var mouseOffset = event.pageX-10;
			if(mouseOffset < 0)
				mouseOffset == 0;
			var newPercent = (mouseOffset/($(window).width()-10))*100;
			parentThis.interview[eval(page().substring(4))-1].setPercent(newPercent);
		}
		
		// Initialize volume controls
		story.setVolume(story.interview[0].getVolume());
		// Bind volume controls
		$('div#volumebuttons').bind('click',function(e){
			var volumeOffset = e.pageX - $(this).children().offset().left;
			story.setVolume((volumeOffset/$(this).width())*100);
		});
		
		// Bind window resize to replace play/pause controls
		$(window).resize(refitButtons);
		
		$('div#story').fadeIn();
		
		// Load all photo galleries
		loadGalleries();
		

	}
	this.leave = function(callback) {
		$('div#story').hide();
		// Unbind audio controls
		$('button#playpause').unbind('click',story.toggleInterview);
		
		// Unbind audio bars for control
		$('div#redbar').unbind('click',scrubAudio);
		$('div#greybar').unbind('click',scrubAudio);


		if(callback)
			callback();
	}
}


// Primary page load handler
$('document').ready(function(){
	$('div#error_nojs').hide();
	// Default page
	if(page()=="")
		window.location.hash=pages[0];

	// Incompatible browser
	if(!buzz.isSupported())
		alert("Your browser is too old to interact with this site and important features will not work unless you upgrade your browser.");

	// Bind to when the hash changes
	$(window).hashchange(changePage);
	changePage();
});