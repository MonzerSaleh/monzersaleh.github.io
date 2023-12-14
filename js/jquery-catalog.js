/**
 *
 * Created by fengdi(fengdi@tuniu.com)
 * Time: 2016-07-01
 *
 * */

;(function (root,fn) {

    if (typeof define === "function" && define.cmd) {

        define(function (require) {
            fn(jQuery, window);
        });

    } else if (typeof define === "function" && define.amd) {

        define(['Catalog'],fn(jQuery,window));

    } else {

        window.Catalog = fn(jQuery, window);

    }

}(this, function ($, window) {
    var defaults = {
        container: 'body',
        active: 'active',
        listen: undefined,
        animation: true,
        data: [
            {
                item: "",
                title: ""
            }
        ],
        callBack: undefined
    };

    if (!$) {
        console.error("Catalog: jQuery should be included before jquery-catalog.js!");
    }

    //目录树导航构造函数
    function Catalog(element, options) {

        //将导航栏对象绑定在DOM上方便获取
        $(element).data('cat', this);

        //当前DOM对象
        this.$element = $(element);
        this.speed = '';

        //外部绑定事件列表
        this.event = {};

        //导航栏配置参数
        this.options = $.extend({}, defaults, options);

        //程序执行开始
        this.init();
    }

    Catalog.prototype = {

        init: function () {
            var self = this;

            //初始化变量
            self.index = 0;

            //每一个获取到的元素到顶端的距离
            self.top = [];

            //是否执行滚动事件，默认执行
            self.defend = true;

            //页面中滚动元素
            self.$scrollDom = self.options.listen ? $(self.options.listen) : $(window);

            //内容区到顶端的距离
            self.exOffsetTop = $(self.options.container).offset().top;
            self.curScroll = self.options.listen ? self.$scrollDom.scrollTop() : 0;

            self.containerInit();
            self.createElement();
            self.bindEvent();
            self.winScroll();

            //初始化完成，执行回调函数
            if (self.options.callBack && typeof self.options.callBack === 'function') {
                self.options.callBack();
            }
        },

        //导航栏初始化
        containerInit: function () {
            var self = this;

            //固定组件宽度，使其不受fixed的影响
            window.onload = function () {
                self.$element.css("width", self.$element.css("width"));
            };
            self.$element.html("");

            if (self.$element.prop("class").indexOf("tocify") === -1) {
                self.$element.addClass("tocify");
            }
        },

        //生成目录树
        createElement: function () {
            var self = this;

            self.dataParse(self.options.container, self.options.data, self.$element,
                function ($ele) {
                    var $dom = $("<ul class='tocify-header nav nav-list'></ul>");
                    $ele.append($dom);

                    return $dom;
                },
                function ($ul, index, $dom, cur) {
                    $ul.append("<li class='tocify-item' data-selector='" + cur.item + "' data-id='" + index + "'>" +
                        "<a>" + $dom.find(cur.title).text() + "</a></li>");
                    $dom.attr("data-hash", index);
                    self.top[index] = $dom.offset().top;
                    self.index++;
                }
            );
        },

        dataParse: function (container, array, $ele, fn1, fn2) {
            var self = this,
                localArray = JSON.parse(JSON.stringify(array)),
                cur = localArray.shift(),
                $ul;

            $ul = fn1.call(self, $ele) || $ele;
            $(container).find(cur.item).each(function (i, d) {
                var index = self.index;

                fn2.call(self, $ul, index, $(d), cur);

                if (localArray.length > 0) {
                    self.dataParse(d, localArray, $ul, fn1, fn2);
                }
            });
        },

        //目录树事件绑定
        bindEvent: function () {
            var self = this;

            self.scrollEvent(self.$element.parent().parent().offset().top);

            //点击跳到对应位置
            self.$element.off("click").on("click", 'li', function () {
                var dom = $(this),
                    selector = dom.data("selector") + "[data-hash='" + dom.data("id") + "']",
                    $bindDom = $(self.options.container).find(selector),
                    bindDomTop = $bindDom.offset().top,
                    target = self.options.listen ? self.$scrollDom.scrollTop() + bindDomTop - 15 : bindDomTop - 15;

                self.defend = false;
                self.changeActive(dom);
                self.scrollSmooth(target);
                self.trigger('click');
            });
        },

        //目录树游标移动
        changeActive: function (dom) {
            var self = this;

            self.$element.find("li").removeClass(self.options.active);
            dom.addClass(self.options.active);
            self.switchOpen(self);
            self.trigger('active');
        },

        //调整目录的展开折叠
        switchOpen: function (self) {
            $.each(self.$element.find("ul").splice(1, self.$element.find("ul").length -1), function(i, e) {
                if ($(e).find("." + self.options.active).length === 0 && $(e).prev("li").prop("class").indexOf(self.options.active) === -1){
                    self.options.animation ? $(e).slideUp("ease") : $(e).hide();
                } else {
                    self.options.animation ? $(e).slideDown("ease"): $(e).show();
                }
            });
        },

        scrollSmooth: function (target) {
            var self = this,
                interval,
                top = self.$element.parent().offset().top,
                flag = self.$scrollDom.scrollTop(),
                distance = target - flag,
                flagTop = self.options.listen ? self.$scrollDom.offset().top + 15 : top + 15,
                location = self.options.listen ? flagTop : 15;

            if (distance != 0 ) {
                self.defend = false;
                interval = setInterval(function () {
                    if ((distance > 0 && target - flag < distance/20) || (distance < 0 && target - flag > distance/20)) {
                        self.options.listen ? self.$scrollDom.scrollTop(target) : window.scroll(0, target);
                        clearInterval(interval);
                        self.defend = true;
                    } else {
                        top = self.options.listen ? self.$element.parent().offset().top : top;
                        flag += distance/20;
                        self.options.listen ? self.$scrollDom.scrollTop(flag) : window.scroll(0, flag);

                        //网页没有卷曲到指定高度,则停止执行
                        if (Math.abs(flag - self.$scrollDom.scrollTop()) > 2) {
                            clearInterval(interval);
                            self.defend = true;
                        } else if (top < flagTop) {
                            self.$element.css({
                                "position": "fixed",
                                "top": location + "px"
                            });
                        }
                    }
                },10);
            }
        },

        //滚动执行事件
        winScroll: function () {
            var self = this;

            self.$scrollDom.scroll(function () {
                self.defend ? self.scrollEvent() : false;
            });
        },

        //目录树固定
        scrollEvent: function () {
            var self = this,
                winTop = self.$scrollDom.scrollTop(),
                scrollTop = self.$element.parent().offset().top,
                flagTop = self.options.listen ? self.$scrollDom.offset().top + 15 : winTop + 15,
                location = self.options.listen ? flagTop : 15;

            if (scrollTop < flagTop) {
                self.$element.css({
                    "position": "fixed",
                    "top": location + "px"
                });
            } else if (scrollTop > flagTop) {
                self.$element.css({
                    "position": "relative",
                    "top": "0"
                });
            }

            //遍历查找对应的目录
            self.top.forEach(function (e, i) {
                if (i> 0 && winTop < self.top[i + 1] + self.curScroll - 15 && winTop >= e + self.curScroll - 15) {
                    self.changeActive($(self.$element).find("li[data-id='" + i + "']"));
                } else if (i === 0 && winTop <= self.top[0] + self.curScroll - 15) {
                    self.changeActive($(self.$element).find("li[data-id='0']"));
                }

                return false;
            });
        },

        on: function (name, fn) {
            this.event[name] = this.event[name] || [];
            this.event[name].push(fn);
        },

        trigger: function (name, obj) {
            var events = this.event[name] || [];

            Array.prototype.shift.call(arguments);
            for (var i = 0;i < events.length;i++) {
                events[i].call(this, arguments);
            }
        }
    };

    $.fn['Catalog'] = function (data) {
        var self;

        if (typeof data === "object") {

            return this.each(function () {
                new Catalog(this, data);
            });

        } else if (data === "refresh") {
            self = $(this).data("cat");

            if (self) {
                self.index = 0;
                self.top = [];
                self.defend = true;
                self.curScroll = self.options.listen ? self.$scrollDom.scrollTop() : 0;

                //重新生成节点
                self.containerInit();
                self.createElement();
                self.switchOpen(self);
                self.scrollEvent();
            }

        } else if (data === "destroy") {
            self = $(this).data("cat");

            self.$scrollDom.off("scroll");
            self.$element.html("").removeClass("tocify");
        } else {
            return $(this).data("cat");
        }
    };
}));
