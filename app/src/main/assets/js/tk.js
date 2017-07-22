/*
 *      Tk-Projects Js
 *                   ver:0.0.9
 *
 * 2017/7/5     秒数转24小时模块秒位展示错误BUG修复                     --谭超鹏
 * 2017/6/15    滚动监听修改事件覆盖bug,加入顶部栏模块                  --谭超鹏
 * 2017/6/14    加入公告栏模块                                          --谭超鹏
 * 2017/6/13    加入滚动监听，滚动加载模块                              --谭超鹏
 * 2017/6/9     加入轮播图模块                                          --谭超鹏
 * 2017/5/27    加入拖动模块                                            --谭超鹏
 * 2017/5/23    加入自定义倒计时(可计算毫秒),计算小数位数               --谭超鹏
 * 2017/5/18    加入倒计时,input验证框架（QQ,手机号,邮箱,空验证）,
 *              数字选择器,分页,秒数格式化24小时制时间字符串,等模块     --谭超鹏
 * 2017/5/16    项目建立                                                --谭超鹏
 *
 *
*/

//  定义对象
var tk = tk || {};

/***************** input 校验模块 *****************/

//  input校验
//
//      参数:
//          reg     正则表达式
//          obj     input对象
//
//      返回:
//          bool  
//
//  示例代码:
//          if(tk.checkInput(/d{6}/,$('#password'))){
//              //通过校验逻辑代码
//          }else{
//              //未通过校验逻辑代码
//          }
tk.checkInput = function (reg, obj) {
    if (reg.test($(obj).val())) {
        return true;
    }
    return false;
}

//  input 校验 空值
//
//      参数:
//          reg     正则表达式
//          obj     input对象
//
//      返回:
//          bool  
//
//  示例代码:
//          if(tk.checkInput($('#password'))){
//              //通过校验逻辑代码
//          }else{
//              //未通过校验逻辑代码
//          }
//
tk.checkInputNull = function (obj) {
    if (obj != null && obj.val().trim().length > 0) {
        return false;
    }
    return true;
}

//  input 校验 QQ号
//
//      参数:
//          obj     input对象
//
//      返回:
//          bool  
//
//  示例代码:
//          if(tk.checkInputQQ($('#qq'))){
//              //通过校验逻辑代码
//          }else{
//              //未通过校验逻辑代码
//          }
//
tk.checkInputQQ = function (obj) {
    return tk.checkInput(/^[1-9][0-9]{4,}$/, obj);
}

//  input 校验 手机号
//
//      参数:
//          obj     input对象
//
//      返回:
//          bool  
//
//  示例代码:
//          if(tk.checkInputPhone($('#phone'))){
//              //通过校验逻辑代码
//          }else{
//              //未通过校验逻辑代码
//          }
//
tk.checkInputPhone = function (obj) {
    return tk.checkInput(/^[1][3578][0-9]{9}$/, obj);
}

//  input 校验 邮箱
//
//      参数:
//          obj     input对象
//
//      返回:
//          bool  
//
//  示例代码:
//          if(tk.checkInputEmail($('#email'))){
//              //通过校验逻辑代码
//          }else{
//              //未通过校验逻辑代码
//          }
//
tk.checkInputEmail = function (obj) {
    return tk.checkInput(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, obj);
}


/***************** 倒计时 模块 *****************/


//  设置24小时倒计时
//
//      参数:
//          obj     设置对象
//          sec     倒计秒数
//          fun     倒计时完成回调
//    targetSec     指定目标秒数
//    targetFun     指定目标秒数回调
//
//      返回:
//          void  
//
//  示例代码:
//          tk.initCountDown($('#count-down'), 5, function () {
//              location.reload();
//          }, 3, function (count) {
//              console.log("剩余" + count + "秒");
//          });
//
tk.initCountDown = function (obj, sec, fun, targetSec, targetFun) {
    tk.initBaseCountDown(sec, 1,function (sec) {
        var timeStr = tk.secondToTime(sec);
        obj.html(timeStr);
    }, fun, targetSec, targetFun);
}


//  设置倒计时
//
//      参数:
//          sec     倒计数
//         step     步长
//        cdFun     步长回调
//          fun     倒计时完成回调
//    targetSec     指定目标
//    targetFun     指定目标回调
//
//      返回:
//          void  
//
//  示例代码:
//          tk.initBaseCountDown(5, 0.01, function (sec) {
//              console.log(sec);
//          }, function () {
//              console.log("到期");
//          }, 3, function () {
//              console.log("3s");
//          });
//
tk.initBaseCountDown = function (sec,step, cdFun, fun, targetSec, targetFun) {
    var iCount = sec;

    //先执行一次回调，保证显示不延迟
    if (cdFun != undefined) {
        cdFun(iCount)
    }
    var timer = setInterval(function () {
        iCount = iCount - step;
        var i = tk.digit(step);
        if (i>0) {
            iCount = iCount.toFixed(i);
        }
        
        //倒计时回调
        if (cdFun != undefined) {
            cdFun(iCount)
        }
        //指定目标逻辑
        if (targetSec != undefined && targetFun != undefined && iCount == targetSec) {
            targetFun(iCount);
        }
        //倒计时完成逻辑
        if (iCount <= 0) {
            window.clearInterval(timer);
            if (fun != undefined) {
                fun();
            }
        }
    }, step*1000);
}


//  返回小数点后位数
//
//      参数:
//          num     计算对象
//
//      返回:
//          int  
//
//  示例代码:
//          var i = tk.digit('0.888');
//
tk.digit = function (num) {
    var str = '' + num;
    var dotNo = str.indexOf('.');
    if (dotNo <= 0) {
        return 0;
    } else {
        var str = str.substring(dotNo);
        return str.length-1;
    }
};

//  秒数转24小时时间字符串
//
//      参数:
//          sec     秒数
//
//      返回:
//          string  
//
//  示例代码:
//          var timeStr = tk.secondToTime(60);
//
tk.secondToTime = function (sec) {
    var h = 0;
    var m = 0;
    var s = 0;

    //小时
    if (sec / 3600 > 0) {
        h = parseInt(sec / 3600);
    } else {
        h = 0;
    }

    //分秒
    if (h > 0) {
        m = parseInt((sec - h * 3600) / 60);
        s = parseInt(sec - h * 3600);
    } else {
        m = parseInt(sec / 60);
        s = sec;
    }
    
    if (m >= 1) {
        s = parseInt(s - m * 60);
    }

    var hstr = "00";
    var mstr = "00";
    var sstr = "00";
    if (h > 0) { if (h < 10) { hstr = "0" + h; } else { hstr = h; } }
    if (m > 0) { if (m < 10) { mstr = "0" + m; } else { mstr = m; } }
    if (s > 0) { if (s < 10) { sstr = "0" + s; } else { sstr = s; } }
    var timeStr = hstr + ":" + mstr + ":" + sstr;
    return timeStr;
}


/***************** 数字选择器 模块 *****************/

//  初始化 数字选择器
//
//      参数:
//          obj     
//       minNum     最小值
//       maxNum     最大值
//          fun     值改变 回调
//
//      返回:
//          void  
//
//  示例代码:
//        <div class="tk-numselector">
//            <div class="tk-numselector-reduce">-</div>
//            <input type="text" class="tk-numselector-input" value="1"/>
//            <div class="tk-numselector-add">+</div>
//        </div>
//        <label id="numselector-show"></label>
//        <script>
//            tk.initNumSelector($('.tk-numselector'), -1, 5, function (num) {
//                $('#numselector-show').html("当前:" + num);
//            });
//        </script>
tk.initNumSelector = function (obj,minNum,maxNum,fun) {
    var reduceObj = obj.find('.tk-numselector-reduce');    //减少
    var input = obj.find('.tk-numselector-input');         //input 对象
    var addObj = obj.find('.tk-numselector-add');          //增加

    //input 点击全选
    input.click(function () {
        input.select();
    });

    //减少事件
    reduceObj.click(function () {
        var v = input.val();    //当前值
        var reduceNum = v--;
        if (reduceNum <= minNum) {
            return false;
        }
        input.val(v);
        if (fun != undefined) {
            fun(v);
        }
    });
    //增加事件
    addObj.click(function () {
        var v = input.val();    //当前值
        var addNum = v++;
        if (addNum >= maxNum) {
            return false;
        }
        input.val(v);
        if (fun != undefined) {
            fun(v);
        }
    });
}


//  初始化 分页模块
//
//      参数:
//          obj     放置元素
//        index     当前页码
//     numCount     显示页码数,偶数会显示多一个
//     pageSize     每页数据量
//    dataCount     总数据量
//          fun     点击 回调
//
//      返回:
//          void  
//
//  示例代码:
//        tk.initPaging($('#page'), 6, 5, 2, 22, function (num) {
//            console.log("第" + num + "页");
//        });
tk.initPaging = function (obj, index, numCount, pageSize, dataCount,fun) {

    var pageCount = Math.ceil(dataCount / pageSize);                //页数
    var upNum = index - 1 >= 1 ? index - 1 : index;                 //上一页
    var backNum = index + 1 <= pageCount ? index + 1 : index;       //上一页
    var sPageNo = 1;                                                //开始页码
    var ePageNo = pageCount;                                        //结束页码
    var shared = parseInt(numCount / 2);                            //当前页码侧边显示页码数

    //无分页数据时，不显示
    if (pageCount <= 0) {
        obj.html('');
        return false;
    }
    var html = '<ul class="tk-paging">';
    html += '<li  data-num="' + upNum + '">上一页</li>';
    if (pageCount >= (shared * 2 + 2)) {
        if (index - shared <= 0) {                          //左侧页码少于2
            sPageNo = 1;
            ePageNo = index + shared + (shared - index) + 1;
        }
        else if ((index + shared) > pageCount) {            //右侧页码少于2
            sPageNo = index - shared - (shared - (pageCount - index));
            ePageNo = pageCount;
        }
        else {
            sPageNo = index - shared;
            ePageNo = index + shared;
        }
    } 

    for (var i = sPageNo; i <= ePageNo; i++) {
        if (index == i) {
            html += '<li class="active">' + i + '</li>';
        } else {
            html += '<li data-num="'+i+'">' + i + '</li>';
        }
    }
    html += '<li data-num="' + backNum + '">下一页</li>';
    html += '<li data-num="' + pageCount + '">共' + pageCount + '页</li>';
    html += '</ul>';

    obj.html(html);

    //点击事件
    $('.tk-paging li').click(function () {
        if ($(this).hasClass('active')) {
            return false;
        }
        var num = parseInt($(this).attr('data-num'));
        if (fun != undefined) {
            fun(num);
        }
        tk.initPaging(obj, num, numCount, pageSize, dataCount, fun);
    });
}

//  初始化 拖动模块
//
//      参数:
//          obj     拖动元素
//       region     拖动父元素（边界）
//       header     触发元素
//
//      返回:
//          void  
//
//  示例代码:
//        tk.initDraggable($('#ac-win-container'), $('body'), $('.ac-win-header'));
tk.initDraggable = function (obj, region, header) {
    var startX = 0;
    var startY = 0;

    var cx = 0;
    var cy = 0;
    var isDrag = false;
    header.mousedown(function (e) {
        startX = e.pageX;
        startY = e.pageY;

        cx = startX - obj.offset().left;
        cy = startY - obj.offset().top;
        isDrag = true;
    });
    region.mouseup(function (e) {
        isDrag = false;
    });
    region.mousemove(function (e) {
        if (isDrag) {
            var x = e.pageX - cx;
            var y = e.pageY - cy;
            //左右边界
            if (x < region.offset().left) {
                x = region.offset().left;
            } else if (x + obj.width() > (region.offset().left + region.width())) {
                x = (region.offset().left + region.width()) - obj.width();
            }
            //上下边界
            if (y < region.offset().top) {
                y = region.offset().top;
            } else if (y + obj.height() > (region.offset().top + region.height())) {
                y = (region.offset().top + region.height()) - obj.height();
            }


            obj.css({ top: y, left: x });
        }

    });

}


//  初始化 轮播图模块
//
//      参数:
//          obj     目标元素
//      leftBtn     左键元素
//     rightBtn     右键元素
//     autoTime     自动播放时间,单位 秒,默认 不自动播放
//
//      返回:
//          void  
//
//  示例代码:
//        tk.initSlider($('.tk-slider-list'), $('#tk-slider-left'), $('#tk-slider-right'),3);
tk.initSlider = function (obj,leftBtn,rightBtn,autoTime) {

    var imgCount = obj.find('img').length;
    var index = 0;
    obj.css('width', imgCount * 100 + '%').css('position', 'relative').css('transition', '1s').css('right', '0');
    var itemWidth = 100 / imgCount;
    obj.find('img').css('width', itemWidth + '%').css('float','left');

    //自动播放逻辑
    if (autoTime != undefined && autoTime > 0) {
        setInterval(function () {
            index++;
            if (index >= imgCount) {
                index = 0;
            }
            obj.css('right', index * 100 + '%');
        },autoTime*1000);
    }
    //左键逻辑
    if (leftBtn != undefined) {
        leftBtn.click(function () {
            index--;
            if (index < 0) {
                index = imgCount-1;
            }
            obj.css('right', index * 100 + '%');

        });
    }
    //右键逻辑
    if (rightBtn != undefined) {
        rightBtn.click(function () {
            index++;
            if (index >= imgCount) {
                index = 0;
            }
            obj.css('right', index * 100 + '%');

        });
    }
}


//滚动监听事件
var tkScrollEvent = new Array();
$(function () {
    window.onscroll = function () {
        for (var i = 0; i < tkScrollEvent.length; i++) {
            tkScrollEvent[i]();
        }
    }
})
//  初始化 滚动监听模块
//
//      参数:
//          obj     目标元素
//       excFun     滚动到指定元素时回调
//      backFun     未滚动到指定元素时回调
//
//      返回:
//          void  
//
//  示例代码:
//        tk.initScrollEvent($('#nav'), function () {
//            $('#nav').css({ 'position': 'fixed', 'top': '0' });
//        },
//            function () {
//                $('#nav').css('position', 'static');
//            });
tk.initScrollEvent = function (obj, excFun, backFun) {
    var y = obj.offset().top;
    tkScrollEvent.push(function () {
        var t = document.documentElement.scrollTop || document.body.scrollTop;  //获取距离页面顶部的距离
        if (t >= y ) {
            excFun();
        } else {
            backFun();
        }
    })
}


//  初始化 顶部栏模块
//
//      参数:
//          obj     目标元素
//          fun     滚动到指定元素回掉
//
//      返回:
//          void  
//
//  示例代码:
//        tk.TopScrollBar($('#nav'), function (obj) {
//            $('.nav-active').removeClass('nav-active');
//            $('[tk-scroll-target=' + obj[0].id + ']').addClass('nav-active');
//        });
tk.TopScrollBar = function (obj,fun) {
    var list = new Array();

    for (var i = 0; i < obj.find('[tk-scroll-target]').length; i++) {
        var ele = $(obj.find('[tk-scroll-target]')[i]).attr("tk-scroll-target");
        if ($('#'+ele).length > 0) {
            list.push($('#' + ele));
        }
    }

    list = list.sort(function (a, b) {
        return b.offset().top - a.offset().top;
    });
    obj.find('[tk-scroll-target]').click(function () {
        var id = $(this).attr("tk-scroll-target");
        $("html,body").animate({ scrollTop: $('#' + id).offset().top+5 }, 500);
    });
   
    tkScrollEvent.push(function () {
        var t = document.documentElement.scrollTop || document.body.scrollTop;  //获取距离页面顶部的距离
        for (var i = 0; i < list.length; i++) {
            if (t > list[i].offset().top) {
                console.log($(list[i])[0].id + '  ' + $(list[i]).offset().top);
                fun(list[i]);
                break;
            }
        }
    });
}

//  初始化 滚动加载模块
//  
//      参数:
//        scale     滚动条占比，范围：0 - 1
//          fun     回调
//          obj     滚动元素，空则默认window
//
//      返回:
//          void  
//
//  示例代码:
//        var isLoad = false;
//        tk.initScrollLoad(0.8, function () {
//            if (!isLoad) {
//                isLoad = true;
//                $.get("/Default/Index1", function () {
//                    $('#scroll-div').append('<p>屯余车其千乘兮，齐玉轪而并驰。驾八龙之婉婉兮，载云旗之委蛇。</p>');
//                    isLoad = false;
//                });
//            }
//        }, $('#scroll-div'));
tk.initScrollLoad = function (scale, fun, obj) {
    var ele = !obj ? window : obj;
    $(ele).bind("scroll", function () {
        //取得文档实际高度
        var heigth = $(this)[0].scrollHeight;
        //滚动条高度
        var scrollTop = $(ele).scrollTop();

        //window 滚动条处理
        if (ele == window) {
            heigth = $('body')[0].scrollHeight;
            scrollTop=scrollTop+document.body.clientHeight;
        }
        var t = parseFloat(scrollTop / heigth);
        if (t > scale) {
            fun();
        } else {
            //console.log(t);
        }
    });

}


//  初始化 公告栏模块
//  
//      参数:
//          obj     公告栏内容元素
//         time     默认3000毫秒
//
//      返回:
//          void  
//
//  示例代码:
//        tk.initNotice($('#tk-notice-content'), 1500);
tk.initNotice = function (obj, time) {

    obj.css({ 'transition': '.6s'});

    var h = obj.find('a').height();    //a高度
    var count = obj.find('a').length;  //a数量
    var ph = obj.parent().height();    //父元素高度
    var showCount = parseInt(ph / h);  //可显示数
    var i = 1;

    if (time == undefined) {
        time = 3000;
    }

    //超出显示范围,进行滚动展示
    if (count > showCount) {
        setInterval(function () {
            var top = obj.css('margin-top');
            top = top.replace('px', '');

            if (count - i >= showCount) {
                obj.css('margin-top', i * -h);
                i++;
            } else {
                obj.css('margin-top', 0);
                i = 1;
            }
        }, time);
    }
}