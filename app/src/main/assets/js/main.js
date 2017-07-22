//标题的滚动 显示/隐藏
$(function () {
    var touchStatus = false;
    var touchDotX = 0;
    var touchDotY = 0;
    document.addEventListener('touchstart', function (e) {
        touchStatus = true;
        touchDotX = e.targetTouches[0].clientX;
        touchDotY = e.targetTouches[0].clientY;
    })
    document.addEventListener('touchend', function (e) {
        touchStatus = false;
        var x = e.changedTouches[0].clientX;
        var y = e.changedTouches[0].clientY;
    });
    document.addEventListener('touchmove', function (e) {
        var x = e.changedTouches[0].clientX;
        var y = e.changedTouches[0].clientY;

        var diff = y - touchDotY;
        if (touchStatus) {
            if (diff > 30) { $('.header').removeClass('header-hidden'); }
            if (diff < -30) { $('.header').addClass('header-hidden'); }
        }
        if ($(window).scrollTop() < 64) {
            $('.header').removeClass('header-hidden');
        }
    });
})
// $(document).scroll(event, function () {
//         //窗口高度
//         var winh = $(window).height();
//         //滚动条高度
//         var scrh = $(window).scrollTop();
//         if (scrh / winh > 0.1) {
//             $('.header').addClass('header-hidden');
//         } else {
//             $('.header').removeClass('header-hidden');
//         }
//     });

// 加载 显示/隐藏
function loading(){
    if($('.loading-container-hidden').length>0){
        $('.loading-container').removeClass('loading-container-hidden');
        return false;
    }else if($('.loading-container').length>0){
        $('.loading-container').addClass('loading-container-hidden');
        return false;
    }
    var html='<div class="loading-container"><img src="img/loading.svg" /></div>';
    $('body').append(html);

}

//取得链接参数,并转换成json对象
function QueryJson(){
    var json=window.location.search.substr(1);
    return decodeURIComponent(json);
}
function QueryJsonObj(){
    return $.parseJSON(QueryJson());
}


$(function () {
    $('.footer-background').click(function () {
        $('body').css('overflow', 'visible');
        $('body').css('heigth', 'auto');
        $('.footer-container').addClass('footer-container-hidden');
    })
    $('#menu').click(function () {
        $('body').css('overflow', 'hidden');
        $('body').css('heigth', '100%');
        $('.footer-container').removeClass('footer-container-hidden');
    });
});
