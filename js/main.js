var tumblr_url = "http://firebornegame.tumblr.com/api/read/json/?num=3";

var planet_filename = "img/logo/planet01.png"; //image de référence pour le resizing du logo

var logo_max_width = 0;
var logo_max_height = 0;
var logo_ratio = 0;

var imagesToLoad = new Array("img/logo/halo01.png","img/logo/halo02.png","img/logo/halo03.png","img/logo/halo04.png","img/logo/planet01.png","img/logo/planet02.png","img/logo/planet03.png");

months = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
days = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");

function url(url){
	return url;
}

$(function(){	
	
	
	var imagesLoaded = 0;
	for(var j in imagesToLoad){
		var image = new Image();
		image.onload = function(){
			imagesLoaded++;	
			var percentage = (imagesLoaded*100) / imagesToLoad.length;
			console.log(percentage);
			$("#progress").css("width",percentage+"%");
			if(imagesLoaded>=imagesToLoad.length)
				$("#loader").fadeOut("slow");
		}
		image.src = imagesToLoad[j];
	}	
	/* PARALLAX DES ETOILES ET DU TITRE */
	if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) { 	
		$(window).on("scroll",function(e){
			position = $(window).scrollTop();
			$("#firetitle").css("top",position/12);
			$(".stars-background").each(function(index,element){
				var ratio = $(this).attr("data-parallax-ratio");
				$(this).css({"background-position": "0px" + ' ' + '-' + position/ratio + "px"});			
			});									
		});
	}

	$(window).on("resize",function(){
		resizeLogo();
	});

	$(document).on("click",".devblog_media,.devblog_content",function(){
		var href = $(this).closest(".devblog_article").attr("href");
		window.open(href,'_blank');
	});	

	$(".lazy").lazyload();
	initializeLogo();
	readTumblrPosts();
});



/* INITIALISATION DU LOGO */
function initializeLogo(){
	var planet = new Image();
	planet.onload = function(){
		logo_max_width = planet.width;
		logo_max_height = planet.height;
		logo_ratio = logo_max_width/logo_max_height;
		resizeLogo();
	}
	planet.src = planet_filename;	
}

/* RESIZE DU LOGO */
function resizeLogo(){	
	var window_width = $(window).width();
	var window_height = $(window).height();			
	$(".logo").css("height",window_height);	
	$(".logo").css("min-height",Math.min(window_width,logo_max_width)/logo_ratio);	
}

/* RAPATRIEMENT DES POSTS TUMBLR */
function readTumblrPosts(){
	$.ajax({
		url:tumblr_url,
		dataType:"script",
		success:function(){
			console.log(tumblr_api_read);
			var template = $(".devblog_template")[0].outerHTML;

			for(var i in tumblr_api_read.posts){
				var post = tumblr_api_read.posts[i];				
				var postElement = $(template);
				
				var url = post.url;
				var date = new Date(post.date);
				var day = date.getDate();
				day = day + ordinal(day);
				var dayofweek = date.getDay();
				var month = date.getMonth();
				var dateString = days[dayofweek] + ', ' + months[month] + '. ' + day;
				postElement.attr("href",url);
				switch(post.type){
					case "regular":
						postElement.find(".devblog_content").html(post['regular-body']);
						postElement.find(".devblog_media").hide();
						break;
					case "photo":
						postElement.find(".devblog_content").html(post['photo-caption']);
						postElement.find(".devblog_media").css("background-image","url("+post['photo-url-250']+")");
						break;
				}
				
				postElement.find(".devblog_date").html(dateString);
	       		
	       		postElement
	       		.removeClass("devblog_template")
	       		.appendTo("#devblog-posts")	       		
			}
				
		}
	});	
}

function ordinal(number) {
  var d = number % 10;
  return (~~ (number % 100 / 10) === 1) ? 'th' :
         (d === 1) ? 'st' :
         (d === 2) ? 'nd' :
         (d === 3) ? 'rd' : 'th';
}
