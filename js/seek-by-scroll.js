(function($, window, document) {
    var $window = $(window);
    var $html = $('html');
    var $body = $('body');
    var $htmlbody = $('html, body');
    var $video = $('#video');
    var video = $video.get(0);
    var duration = 0;
    var $document = $(document);
    var windowHeight = 0;
    var currentScroll = 0;
    var bodyHeight = 0;
    var isPlaying = false;

    var resizeHandler = function() {
        windowHeight = $window.height();
        $('.auto-height').height(windowHeight + 'px');
        currentScroll = $body.scrollTop() || $html.scrollTop();
        bodyHeight = $body.height();
    };

    var scrollHandler = function() {
        if (isPlaying) {
            return;
        }
        if (video.readyState !== video.HAVE_ENOUGH_DATA
            && video.readyState !== video.HAVE_FUTURE_DATA
            && video.readyState !== video.HAVE_CURRENT_DATA) {
            return;
        }
        console.log('scrollHandler');
        currentScroll = $body.scrollTop() || $html.scrollTop();
        var currentTime = Math.max(Math.min(duration * currentScroll / (bodyHeight - windowHeight), duration - 0.1), 0);
        video.currentTime = currentTime;
        var stringedTime = (Math.floor(currentTime * 10) / 10).toFixed(1);
        $('.current-time').text(stringedTime + ' / ' + duration + 's');
    };

    var timeupdateHandler = function() {
        if (!isPlaying) {
            return;
        }
        console.log('timeupdateHandler');
        var currentTime = video.currentTime;
        var newScroll = (bodyHeight - windowHeight) * currentTime / duration;

        var stringedTime = (Math.floor(currentTime * 10) / 10).toFixed(1);
        $('.current-time').text(stringedTime + ' / ' + duration + 's');

        $htmlbody.stop(true, false).animate({
            scrollTop: newScroll
        }, {
            duration: 500,
            easing: 'linear'
        });
    };

    var readyHandler = function() {
        console.log('readyHandler');
        video.play();
    };

    var loadeddataHandler = function() {
        console.log('loadeddataHandler');
        duration = video.duration;
        video.pause();
        scrollHandler();
        scrollDelayTimer = setTimeout(scrollDelayHandler, 5000);
    };

    var scrollDelayHandler = function() {
        console.log('scrollDelayHandler');
        isPlaying = true;
        video.play();
    };

    var wheelHandler = function() {
        console.log('wheelHandler');
        $htmlbody.stop(true, true);
        isPlaying = false;
        video.pause();
    };

    $window.on('scroll', function() {
        scrollHandler();
        clearTimeout(scrollDelayTimer);
        scrollDelayTimer = setTimeout(scrollDelayHandler, 5000);
    });

    $video.on('loadeddata', loadeddataHandler);
    $document.on('ready', resizeHandler);
    $document.on('ready', readyHandler);
    var resizeTimer = null;
    $window.on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeHandler, 100);
    });
    var scrollDelayTimer = null;
    $video.on('timeupdate', timeupdateHandler);
    $document.on('mousewheel', wheelHandler);
})(jQuery, window, document);
