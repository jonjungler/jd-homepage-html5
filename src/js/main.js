$(document).ready(function () {

	initSize();
	window.onresize = function (event) {
		initSize();
	}

	$(document).on("scroll",changeHeaderBg);

	$(".banner-wrapper").each(function () {
		var $this = $(this);
		var banner = new initBanner($this.children(".top-banner"),".item");
		var $focus = $this.find(".focus-list .focus");
		banner.addEventListener(bannerListener($focus));
	})

	// 添加测试秒杀时间
	var testDate = new　Date();
	testDate.setHours(testDate.getHours()+6);
	$(".seckill .time-des").attr("data-time",testDate.getTime());
	initSecKillTime($(".seckill .time-des"));

	$(".scroll2Top").on("click",function () {
		$(document).scrollTop(0);
		return false;
	})

	initMoveByTouch($(".seckill-item-list"));

	newsAnim($(".express-news .news-list"),".express-news .news-list .news");
})

function initSecKillTime ($timeEl) {
	var endTime = parseInt($timeEl.attr("data-time"));
	var nowTime = new Date().getTime();
	var remanentTime = nowTime < endTime ? endTime - nowTime :0;
	$timeEl.text(timeToStr(remanentTime));
	var timeInverval = setInterval(function () {
		remanentTime -= 1000;
		$timeEl.text(timeToStr(remanentTime));
		if (remanentTime == 0) {
			clearInterval(timeInverval);
		}
	}, 1000)
}

function timeToStr (timeNum) {
	var time = timeNum;
	time = Math.floor(time / 1000);
	var sec = time % 60;
	time = Math.floor(time / 60);
	var min = time % 60;
	time = Math.floor(time / 60);
	var hour = time % 60;
	return (hour > 99 ? "99+":vailTime2Str(hour))+" : "+vailTime2Str(min)+" : "+vailTime2Str(sec);
}

function vailTime2Str (num) {
	return num > 9 ? num + "" : "0"+num;
}

function newsAnim (list,itemSel,timeout) {
	var listH = list.height();
	var $item = $(itemSel)
	list.append($item.eq(0).clone())
	var onceTime = timeout ? timeout : 3000;
	var moveY = oneStep = listH / $item.length;
	setInterval(function () {
		list.css({
			WebkitTransition:"all 300ms ease",
			transition:"all 300ms ease",
		});
		list.css({
			WebkitTransform:"translate3d(0,-"+moveY+"px,0)",
			transform:"translate3d(0,-"+moveY+"px,0)"
		});
		moveY += oneStep;
		moveY = moveY <= listH ? moveY : 0;
		if (moveY == 0) {
			list[0].addEventListener("webkitTransitionEnd",listAnmBack,false);
			list[0].addEventListener("transitionEnd",listAnmBack,false);
		}
	}, onceTime)
	function listAnmBack (event) {
		var target = event.target;
		target.removeEventListener("webkitTransitionEnd",listAnmBack,false);
		target.removeEventListener("transitionEnd",listAnmBack,false);
		if (moveY == 0) {
			list.css({
				WebkitTransition:"all 0ms",
				transition:"all 0ms"
			})
			list.css({
				WebkitTransform:"translate3d(0,0,0)",
				transform:"translate3d(0,0,0)"
			});
			moveY += oneStep;
		}
	}
}

function initBanner(banner,itemSel,timeout) {
	var $banner = banner;
	var $item = $banner.children(itemSel);
	var bannerIndex = 0;
	var intervalId ;
	var localTime = timeout ? timeout : 2000;
	var context = this;
	var listeneerList = [];
	$item.eq(bannerIndex).css({
		WebkitTransform:"translate3d(-" + $item.width() + "px,0,0)",
		transform:"translate3d(-" + $item.width() + "px,0,0)"
	})
	$banner[0].addEventListener("touchstart",moveStartBack,false);
	$banner[0].addEventListener("touchmove",moveBack,false);
	$banner[0].addEventListener("touchend",moveEndBack,false);

	function nextIndex() {
		return bannerIndex < $item.length-1 ? bannerIndex+1 : 0;
	}
	function preIndex() {
		return bannerIndex >0 ? bannerIndex-1 :$item.length -1;
	}
	function stopInterval() {
		if (!intervalId) {
			return;
		}
		clearTimeout(intervalId);
		intervalId = null;
	}
	function initInterval() {
		if (intervalId) {
			clearTimeout(intervalId)
		}
		intervalId = setTimeout(function () {
			var currentItem = $item.eq(bannerIndex);
			var nextItem = $item.eq(nextIndex());
			currentItem.css({
				WebkitTransition:"all 300ms ease",
				transition:"all 300ms ease",
			})
			currentItem.css({
				WebkitTransform:"translate3d(-" + 2*$item.width() + "px,0,0)",
				transform:"translate3d(-" + 2*$item.width() + "px,0,0)"
			});
			currentItem.data("focus",false)
			currentItem[0].addEventListener("webkitTransitionEnd",animBack,false);
			currentItem[0].addEventListener("transitionEnd",animBack,false);
			nextItem.css({
				WebkitTransition:"all 300ms ease",
				transition:"all 300ms ease",
			})
			nextItem.css({
				WebkitTransform:"translate3d(-" + $item.width() + "px,0,0)",
				transform:"translate3d(-" + $item.width() + "px,0,0)"
			})
			nextItem.data("focus",true)
			nextItem[0].addEventListener("webkitTransitionEnd",animBack,false);
			nextItem[0].addEventListener("transitionEnd",animBack,false);
		}, localTime);
		return intervalId;
	}

	function timeTick () {
	}

	function animBack(event){
		var el = event.target;
		el.removeEventListener("webkitTransitionEnd",animBack,false);
		el.removeEventListener("transitionEnd",animBack,false);
		var index = $item.index(el);
		var isFocus = $item.eq(index).data("focus");

		if (!isFocus) {
			$item.eq(index).css({
				WebkitTransition:"all 0ms ease",
				transition:"all 0ms ease",
			})
			$item.eq(index).css({
				WebkitTransform:"translate3d(0,0,0)",
				transform:"translate3d(0,0,0)"
			});
			return;
		}else{
			initInterval();
		}

		bannerIndex = index;
		for(var j = 0, length2 = listeneerList.length; j < length2; j++){
			listeneerList[j](bannerIndex);
		}
	}

	var startX,moveX,currentItem,nextItem,preItem,maxScroll = Math.round($item.width()*1/3);
	function moveStartBack (event) {
		currentItem = $item.eq(bannerIndex);
		nextItem = $item.eq(nextIndex());
		preItem = $item.eq(preIndex());
		stopInterval();
		preItem.css({
			WebkitTransition:"all 0ms ease",
			transition:"all 0ms ease",
		})
		preItem.css({
			WebkitTransform:"translate3d(-" + 2*$item.width() + "px,0,0)",
			transform:"translate3d(-" + 2*$item.width() + "px,0,0)",
		});
		currentItem.css({
			WebkitTransition:"all 0ms ease",
			transition:"all 0ms ease",
		});
		currentItem.css({
			transform:"translate3d(-" + $item.width() + "px,0,0)",
			WebkitTransform:"translate3d(-" + $item.width() + "px,0,0)",
		});
		nextItem.css({
			WebkitTransition:"all 0ms ease",
			transition:"all 0ms ease",
		});
		nextItem.css({
			WebkitTransform:"translate3d(0,0,0)",
			transform:"translate3d(0,0,0)",
		});
		startX = event.changedTouches[0].pageX;
		event.preventDefault();
	}	

	function moveBack(event){
		moveX = event.changedTouches[0].pageX - startX;
		preItem.css({
			WebkitTransform:"translate3d(-" + (2*$item.width()-moveX) + "px,0,0)",
			transform:"translate3d(-" + (2*$item.width()-moveX) + "px,0,0)",
		});
		currentItem.css({
			WebkitTransform:"translate3d(-" + ($item.width()-moveX) + "px,0,0)",
			transform:"translate3d(-" + ($item.width()-moveX) + "px,0,0)",
		});
		nextItem.css({
			WebkitTransform:"translate3d("+(0+moveX)+"px,0,0)",
			transform:"translate3d("+(0+moveX)+"px,0,0)",
		});
		event.preventDefault();
	}

	function moveEndBack(event){
		if (moveX > maxScroll) {
			preItem.css({
				WebkitTransition:"all 300ms ease",
				transition:"all 300ms ease",
			});
			preItem.css({
				WebkitTransform:"translate3d(-" + $item.width() + "px,0,0)",
				transform:"translate3d(-" + $item.width() + "px,0,0)",
			});
			preItem.data("focus",true)
			preItem[0].addEventListener("transitionEnd",animBack);
			preItem[0].addEventListener("webkitTransitionEnd",animBack);
			currentItem.css({
				WebkitTransition:"all 300ms ease",
				transition:"all 300ms ease",
			});
			currentItem.css({
				WebkitTransform:"translate3d(0,0,0)",
				transform:"translate3d(0,0,0)",
			});
		}else if (moveX < -maxScroll) {
			preItem.css({
				WebkitTransition:"all 0ms ease",
				transition:"all 0ms ease",
			});
			preItem.css({
				WebkitTransform:"translate3d(0,0,0)",
				transform:"translate3d(0,0,0)",
			});
			currentItem.css({
				WebkitTransition:"all 300ms ease",
				transition:"all 300ms ease",
			});
			currentItem.css({
				WebkitTransform:"translate3d(-" + 2*$item.width() + "px,0,0)",
				transform:"translate3d(-" + 2*$item.width() + "px,0,0)",
			});
			currentItem.data("focus",false)
			currentItem[0].addEventListener("transitionEnd",animBack);
			currentItem[0].addEventListener("webkitTransitionEnd",animBack);
			nextItem.css({
				WebkitTransform:"all 300ms ease",
				transition:"all 300ms ease",
			});
			nextItem.css({
				WebkitTransform:"translate3d(-" + $item.width() + "px,0,0)",
				transform:"translate3d(-" + $item.width() + "px,0,0)",
			});
			nextItem.data("focus",true)
			nextItem[0].addEventListener("transitionEnd",animBack);
			nextItem[0].addEventListener("webkitTransitionEnd",animBack);
		}else{
			preItem.css({
				WebkitTransition:"all 300ms ease",
				transition:"all 300ms ease",
			});
			preItem.css({
				WebkitTransform:"translate3d(-" + 2*$item.width() + "px,0,0)",
				transform:"translate3d(-" + 2*$item.width() + "px,0,0)",
			});
			currentItem.css({
				WebkitTransition:"all 300ms ease",
				transition:"all 300ms ease",
			});
			currentItem.css({
				WebkitTransform:"translate3d(-" + $item.width() + "px,0,0)",
				transform:"translate3d(-" + $item.width() + "px,0,0)",
			});
			nextItem.css({
				WebkitTransition:"all 300ms ease",
				transition:"all 300ms ease",
			});
			nextItem.css({
				WebkitTransform:"translate3d(0,0,0)",
				transform:"translate3d(0,0,0)",
			});
		}
		intervalId = initInterval();
		event.preventDefault();
	}

	intervalId = initInterval();

	this.addEventListener = function (listener) {
		if (typeof listener == "function") {
			listeneerList.push(listener);
		}
	}

	return this;
}

function initMoveByTouch ($el) {
	var startX,transformX;
	var maxMove =$(".layout").width() - $el.width();
	$el[0].addEventListener("touchstart",function (event) {
		startX = event.changedTouches[0].pageX;
		transformX  = -getTransformX($el.css("transform")) - startX;
	},false)
	$el[0].addEventListener("touchmove",function (event) {
		var currentX = event.changedTouches[0].pageX
		var moveX = transformX + currentX
		if (moveX > 0) {
			return;
		}else if (maxMove > moveX) {
			return;
		}
		$el.css({
			transform:"translate3d("+Math.floor(moveX) + "px,0,0)"
		})
		event.preventDefault();
	},false)
}

function getTransformX(transformStr) {
	var numList = transformStr.match( /\d+/g );
	return  numList && numList.length == 6 ? parseInt(numList[4]) : 0;
}

function bannerListener ($focusList) {
	var focusList = $focusList;
	return function (num) {
		focusList.filter(".active").removeClass("active");
		focusList.eq(num).addClass("active");
	}
}

function initSize () {
	var $banner = $(".top-banner");
	$banner.each(function () {
		var $this = $(this);
		$this.height($this.children(".item").outerHeight());
	})

	var $seckillItemList = $('.seckill-item-list');
	var $seckillItem = $(".seckill-item-list .item");
	var itemW = $(".layout").width() * 0.3; 
	$seckillItem.width(itemW);
	$seckillItemList.width(itemW*$seckillItem.length);
}

function changeHeaderBg (event) {
	var scrollTop = $(this).scrollTop();
	var docW = $(document).width();
	var alphaL = scrollTop / docW;
	$(".header").css({
		"background-color":"rgba(201,21,35,"+(alphaL > 0.85? 0.85 :alphaL)+")"
	});

	if (scrollTop > 0.4 * $(window).height()) {
		$(".scroll2Top").show();
	}else{
		$(".scroll2Top").hide();
	}
}