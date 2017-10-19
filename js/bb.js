
(function($, window, document, undefined) {
	// VoiceTip(0);
	//dices=[4,4,4,4,4,5];
    var SlideLock = (function() {
        function SlideLock(element, options) {
            this.$element = $(element);
            this.opts = $.extend({}, $.fn.slideLock.defaults, options);
            this._init()
        }
        SlideLock.prototype = {
            _init: function() {
                var _this = this;
                this.originLeft = this.$element.offset().left;
                this.btnW = this.$element.outerWidth();
                this.slideW = this.$element.parent().outerWidth() - this.btnW;
                this.isMousedown = false;
                this.hadSuccess = false;
                this.stepOpacity = 1 / this.slideW;

                this.$slideBg = $(this.opts.slideBgId);
                this.$slideTip = $(this.opts.slideTipId);
                this.$slideStatu = $(this.opts.slideStatuId);

                this.$element.on("mousedown", function(event) {
                    _this.isMousedown = true;
                    _this.dx = event.clientX - _this.originLeft;
                    !!_this.opts.mousedown && _this.opts.mousedown.call(_this);
                })
                this.$element.on("mousemove", function(event) {

                    if (!!_this.isMousedown && !_this.hadSuccess) {
                        _this.diffX = event.clientX - _this.originLeft - _this.dx;
                        if (_this.diffX >= _this.slideW) {
                            _this.diffX = _this.slideW;
                        } else if (_this.diffX <= 0) {
                            _this.diffX = 0;
                        }
                        _this._btnMove(_this.diffX);
                        _this._bgMove(_this.diffX + _this.btnW);
                        _this._tipMove(_this.diffX * _this.stepOpacity);
                        _this._statuMove(_this.diffX);
                        !!_this.opts.mousemove && _this.opts.mousemove.call(_this, _this.diffX);
                    }
                });
                this.$element.on("mouseup mouseout", function(event) {
                    event.stopPropagation();
                    _this.isMousedown = false;
                    if (!_this.hadSuccess) {
                        if (_this.diffX >= (_this.slideW / 2)) {
                            _this.diffX = _this.slideW;
                        } else {
                            _this.diffX = 0;
                        }


                        _this._btnMove(_this.diffX, true);
                        _this._bgMove(_this.diffX + _this.btnW, true);
                        _this._tipMove(_this.diffX * _this.stepOpacity);
                        !!_this.opts.mouseupout && _this.opts.mouseupout.call(_this, _this.diffX);
                    }

                });

            },
            _btnMove: function(diffX, isAnim) {
                _this = this;
                if (!!isAnim) {
                    if (diffX >= _this.slideW && !this.hadSuccess) {
                        this.hadSuccess = true;
                        this.$element.animate({ left: diffX }, 200, function() {
                            !!_this.opts.success && _this.opts.success();
                            _this.$slideStatu.html("祝您好运！")
                        });
                    } else {
                        this.$element.animate({ left: diffX }, 200);
                    }

                } else {
                    this.$element.css({ "left": diffX });
                }
            },
            _bgMove: function(diffX, isAnim) {
                if (!!isAnim) {
                    this.$slideBg.animate({ width: diffX }, 200);

                } else {
                    this.$slideBg.css({ "width": diffX });
                }
            },
            _tipMove: function(opacity) {
                this.$slideTip.css("opacity", 1 - opacity);
            },
            _statuMove: function(diffX) {
                if (diffX >= this.slideW / 2) {
                    this.$slideStatu.html("松开博起来").fadeIn();
                } else {
                    this.$slideStatu.html("").fadeOut();
                }

            },
            reset: function(callback) {
                this.diffX = 0;
                this.hadSuccess = false;
                this.$element.animate({ left: 0 })
                this.$slideStatu.html("").fadeOut();
                this.$slideBg.animate({ "width": 0 });
                this.$slideTip.animate({ "opacity": 1 });
                !!callback && callback.call(this);
            }
        }
        return SlideLock;
    })();
    $.fn.slideLock = function(options) {
        var self = this;
        return this.each(function() {
            var $this = $(this),
                instance = $this.data("slidelock");
            if (!instance) {
                var instance = new SlideLock(this, options);
                instance._init();
                $this.data('slidelock', instance);
            }
        })
    };
    $.fn.slideLock.defaults = {
        slideBgId: "#J_slideunlock-bg",
        slideTipId: "#J_slideunlock-lable-tip",
        slideStatuId: "#J_slideunlock-statu",
        success: function() {},
        mousedown: function() {},
        mousemove: function() {}


    }
})(window.jQuery, window, document);

var dicestitle='';
$(function() {
    var SlideLock1;
	
    //骰子对象
	
    var Dice = (function() {
        return {
            show: function(dices) {
                var str = this._render(dices);
                $("#J_bowl-box").html(str);
                $("#J_audiott").get(0).play();
                $(".bowl-box .loaded").hide();
				$("#J_bb-rock-result").hide(100);
				//ChkResult();
				
				
				rstr=ChkResult();
				if(rstr!='.') {
				$("#J_bb-rock-result").html(dicestitle);
				var speakstr = dices.toString().split("");
				var speak = ", 您的幸運博餅骰子是," + speakstr + ",,";
				//responsiveVoice.speak(speak.toString() + rstr, "Chinese Female");
				$("#J_bb-rock-result").show(1000);
				}
				else
				{var speakstr = dices.toString().split("");
				var speak = ", 您的幸運博餅骰子是," + speakstr + ",,";
				//responsiveVoice.speak(speak.toString() , "Chinese Female");
				}
            },
            _render: function(dices) {
                var strArr = [];
                for (var i = 0; i < dices.length; i++) {
                    var num = i + 1;
                    strArr.push('<span class="dice active dice' + num + '"><img src="images/dices' + dices[i] + '.svg" width="56px"/></span>');
					//strArr.push('<span class="dice active dice' + num + '"><img src="images/dices' + dices[i] + '.png"/></span>');
                }
                return strArr.join("");
            }
        }
    })();

    //声音
    var VoiceTip = function(rank) {
        switch (rank) {
			 case 7:
                $("#J_audiott").get(0).play();
                break;
            case 6:
                $("#J_audio6").get(0).play();
                break;
            case 5:
                $("#J_audio5").get(0).play();
                break;
            case 4:
                $("#J_audio4").get(0).play();
                break;
            case 3:
                $("#J_audio3").get(0).play();
                break;
            case 2:
                $("#J_audio2").get(0).play();
                break;
            case 1:
                $("#J_audio1").get(0).play();
                break;
            case 0:
                $("#J_audio0").get(0).play();
                break;
        }
    }

   
    //博饼动画
    var moonCake = (function() {
        return {
            //拖拽到最右边的时候
            dropEnd: function() {
                var _this = this;
				for (var c = 0; c <= Math.floor((Math.random() * 10) + 1); c++) {
			for (var j = 0; j < 7; j++) {
				setTimeout(function () {
					for (var i = 0; i < 6; i++) {
					dices[i] = String(Math.floor((Math.random() * 6) + 1));
				}
				}, Math.random() * 500);
			}
		}
				
		 		Dice.show(dices);
				
				
				$("#J_slideunlock-btn2").removeAttr("disabled");
				}
        		}
    	})();
    (function() {
        $(function() {
			$("#J_audiott").get(0).play();
			dices=[1,2,3,4,5,6];
			for (var i = 0; i < 6; i++) {
					dices[i] = String(Math.floor((Math.random() * 6) + 1));
				}
            SlideLock1 = $("#J_slideunlock-btn1").slideLock({
                success: function() {
                    moonCake.dropEnd();
                },
                mousedown: function() {
                    $("#J_bb-rock-result").fadeOut();
                    $("#J_bowl-box").html("");
                },
                mousemove: function(diffx) {
                    Plam.move(diffx);
                },
                mouseupout: function(diffx) {
                    Plam.move(diffx)
                }
            });


            $("#J_slideunlock-btn2").on("click", function() {
			//	  VoiceTip(7);
                $("#J_bowl-box").html("");
                $("#J_bb-rock-result").hide();
                $(".bowl-box .loaded").fadeIn();
                $(this).attr("disabled", "disabled");
                moonCake.dropEnd();
            })
        })
    })()
})
function ChkResult() {
		var Pos = Array('4', '4,4', '5,5,5,5', '4,4,4', '4,4,4,4', '3,3,3,3,3', '1,2,3,4,5,6', '1,1,4,4,4,4', '3,3,3,3,3,3', '4,4,4,4,4,4', '6,6,6,6,6,6');
		var Title = Array('一秀', '二举', '四进', '三红', '状元', '状元,五子登科', '对堂', '状元,插金花', '状元', '六红', '六黑');
		var mark = Array(10, 20, 30, 50, 150, 200, 80, 250, 300, 400, 500);
		var resultstr = dices.sort().toString();
		var congstr = "恭喜您, 您得了，";
		CurrentMark = 0;
		dicestitle='';
		for (i = 10; i >= 0; i--) {
			if (resultstr.includes(Pos[i])) {
				CurrentMark = mark[i];
				//AllMark = AllMark + mark[i];
				dicestitle=Title[i];
				return (congstr + Title[i] + ",");
			}
		}
		return (".");
	}
