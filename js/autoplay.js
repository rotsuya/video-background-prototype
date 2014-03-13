(function($, window, document) {
    var $window = $(window);
    var $video = $('#video');
    var $html = $('html');
    var $body = $('body');
    var $htmlbody = $('html, body');
    var video = $video.get(0);
    var $sections = $('.container');
    var chapterTimes = $sections.map(function() {
        return $(this).attr('data-time') - 0;
    });
    var currentChapter = 0;
    var offsets = [];
    var currentTime = 0;
    var isScrolling = false;

    var resizeHandler = function() {
        $('.auto-height').height($window.height() + 'px');
        offsets = $sections.map(function() {
            return $(this).offset().top;
        });
        isScrolling = true;
        $htmlbody.animate({scrollTop: offsets[currentChapter]}, 200, 'swing', function() {
            setTimeout(function() {
                isScrolling = false;
                console.log('scrollHandler is unlocked.');
            }, 0);
        });
        console.log('scroll to section ' + currentChapter + ' due to resize. scrollHandler is locked.');
    };

    var scrollHandler = function() {
        var scroll = $body.scrollTop() || $html.scrollTop();
        var newChapter = 0;
        for (var i = 0; i < offsets.length - 1; i++) {
            if (scroll >= (offsets[i] + offsets[i + 1]) / 2) {
                newChapter = i + 1;
            } else {
                break;
            }
        }
        var offset = offsets[newChapter];
        isScrolling = true;
        $htmlbody.animate({scrollTop: offset}, 200, 'swing', function() {
            setTimeout(function() {
                isScrolling = false;
                console.log('scrollHandler is unlocked.');
            }, 0);
        });
        console.log('scroll to section ' + newChapter + ' due to scroll. scrollHandler is locked.');
        var newTime = chapterTimes[newChapter];
        if (currentChapter === newChapter) {
            return;
        }
        video.currentTime = newTime;
        currentChapter = newChapter;
        console.log('seek to ' + currentTime + ' seconds due to scroll.');
    };

    var timeupdateHandler = function() {
        if (isScrolling) {
            return;
        }
        var currentTime = video.currentTime;
        currentTime = (Math.floor(currentTime * 10) / 10).toFixed(1);
        $('.current-time').text(currentTime + 's');
        var newChapter = 0;
        for (var i = 0; i < chapterTimes.length; i++) {
            if (currentTime >= chapterTimes[i]) {
                newChapter = i;
            } else {
                break;
            }
        }
        if (newChapter === currentChapter) {
            return;
        }
        currentChapter = newChapter;
        isScrolling = true;
        $htmlbody.animate({scrollTop: offsets[currentChapter]}, 200, 'swing', function() {
            setTimeout(function() {
                isScrolling = false;
                console.log('scrollHandler is unlocked.');
            }, 0);
        });
        console.log('scroll to section ' + currentChapter + ' due to playing video. scrollHandler is locked.');
    };

    $(document).on('ready', resizeHandler);
    var resizeTimer = null;
    $window.on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeHandler, 100);
    });
    var scrollTimer = null;
    $window.on('scroll', function() {
        if (isScrolling) {
            return;
        }
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(scrollHandler, 300);
    });
    $video.on('timeupdate', timeupdateHandler);
})(jQuery, window, document);
