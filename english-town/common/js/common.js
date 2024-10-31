

/** 전역  */
var user_agent = navigator.userAgent.toLowerCase(),
	isMac = (user_agent.indexOf("mac") > -1),
	isIOS = ((user_agent.indexOf("applewebkit") > -1 ) && isMac) || user_agent.indexOf("ipad") > -1 || (user_agent.indexOf("iphone") > -1 || user_agent.indexOf("ipod") > -1),	
	isAndroid = (user_agent.indexOf("android") > -1),	
	isChrome = ( (user_agent.indexOf("applewebkit") > -1 ) && !isMac),
	isFireFox = user_agent.indexOf("firefox") >-1,
	isMobile = false;
	isIE = !isChrome && !isMac && !isFireFox;
	

if(isIOS || isAndroid) isMobile = true; 

var touchstart = "mousedown";
var touchmove = "mousemove";
var touchend = "mouseup";
var click = "click";

if( isMobile ) {
	touchstart = "touchstart";
	touchmove = "touchmove";
    touchend = "touchend";
}

var clickAudio;



/*
*	Class 구현
*/
(function () {
    var initializing = false, fnTest = /xyz/.test(function () {
        xyz;
    }) ? /\b_super\b/ : /.*/;
    this.Class = function () {
    };

    Class.extend = function (prop) {

        var _super = this.prototype;
        initializing = true;
        var prototype = new this();
        initializing = false;

        for (var name in prop) {
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function (name, fn) {
                return function () {
                    var tmp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;
                    return ret;
                };
            })(name, prop[name]) : prop[name];
        };

        function Class() {
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        };

        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.extend = arguments.callee;

        return Class;
	};

})();


/*
*	제이쿼리 확장
*/
(function ( $ ) {
    'use strict'

    $.extend({
        getUrlVars: function() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },

        getUrlVar: function(name) {
            return $.getUrlVars()[name];
        },

        makeRandom : function ( randomNum, arNum ) {
            var randomAr = new Array();
            var rand = new Array();
            var temp = new Array();
            var r,p,i;
            
            for(i = 0; i<randomNum; i++) {
                temp[i] = i;
            }
            
            for(i = 0; i<randomNum; i++) {
                r = Math.floor(Math.random() * (randomNum - i));
                p = temp[r];
                randomAr[i] = p;
                for(var j = r; j<randomNum - i- 1; j++) {
                    temp[j] = temp[j + 1];
                }
            }
            
            for (i = 0; i < arNum; i++ ) {
                rand[i] = randomAr[i];
            }
            
            return rand;
        },

        rangeRandom: function (low, high) {
            return Math.floor(low + Math.random() * (high-low+1));
        }
    });

})( jQuery );



/*
*	카운터
*/
(function () {
    "use strict";

	var CounterUtils  = CounterUtils  || ( function ()
    {

        /** @private 카운트 생성
         */
        function initCounter()
        {
            Date.prototype.YYYYMMDDHHMMSS = function()
            {
                var yyyy = this.getFullYear().toString();
                var mm = (this.getMonth() + 1).toString();
                var dd = this.getHours().toString();
                var hh = this.getDate().toString();
                var m = this.getMinutes().toString();
                var s = this.getSeconds().toString();

                return yyyy + (mm[1] ? mm : '0'+mm[0]) + (dd[1] ? dd : '0'+dd[0]) + (hh[1] ? hh : '0'+hh[0]) + (m[1] ? m : '0'+m[0]) + (s[1] ? s : '0'+s[0]);
            }
        }

        /** @private 현재시간 받기
         */
        function now() {
            return (new Date()).getTime();
        }

        /** @private 앞에 0
         */
        function pad(num, size) {
            var s = "0000" + num;
           return s.substr(s.length - size);
        }

        return Class.extend({

            /** @public init
             *  @param {audio} audio 엘리먼트
             *  @param {json} 옵션
             */
            init : function ()
            {
                this.startAt = 0;
                this.lapTime = 0;
                initCounter.call(this);
            },

            /** @public 시작
             */
            start : function () {
                this.startAt = this.startAt ? this.startAt : now();
            },

            /** @public 멈춤
             */
            stop : function () {
                this.lapTime = this.startAt ? this.lapTime + now() - this.startAt : this.lapTime;
				this.startAt	= 0;
            },


            /** @public 리셋
             */
            reset : function () {
                this.lapTime = this.startAt = 0;
            },


            /** @public 시간 받기
             */
            time : function () {
                return this.lapTime + (this.startAt ? now() - this.startAt : 0);
            },

            /** @public 시간 포맷 받기
             */
            getFormat : function () {
                var time = this.time();
                var h = 0; 
                var m = 0; 
                var s = 0;
                var ms = 0;

                h = Math.floor( time / (60 * 60 * 1000) );
                time = time % (60 * 60 * 1000);
                m = Math.floor( time / (60 * 1000) );
                time = time % (60 * 1000);
                s = Math.floor( time / 1000 );
				ms = time % 1000;
				
                return pad(h, 2)+" "+pad(m, 2)+" "+pad(s, 2)+" "+pad(ms, 2);  
            }

        });

    })();

    window.CounterUtils  = CounterUtils ;

})();




/*
*	오디오 컨트롤
*/
(function ( $ ) {
	'use strict';
	
	var AudioControl = AudioControl || (function () {

		function initAudio() {
            var owner = this;
			this.audio = $("<audio><source src='"+this.source+"' type='audio/mpeg' /></audio>")[0];
			$("body").append($(this.audio));
		}

		function onUpdate() {

			if(this.audio.currentTime >= this.audio.duration) {
				this.audio.pause();
				this.audio.currentTime = 0;
				if(this.options.onFinish) this.options.onFinish( this.audio );
				clearInterval(this.timer);
			} else {
				var percent = this.audio.currentTime/this.audio.duration;
				if(this.options.onUpdate) this.options.onUpdate( this.audio, percent);
			}
		}
		
		return Class.extend({

			init : function ( source, options ) {
				this.audio;
				this.source = source;
				this.timer;
				this.options = {onFinish:null, onUpdate:null}
				$.extend(this.options, options);
				initAudio.call(this);
			},

			play : function ( seek ) {
				if( this.audio.paused ) {
					if(seek) this.audio.currentTime = seek;
					this.audio.play();
					this.timer = setInterval($.proxy(onUpdate, this), 1000/30);
					onUpdate.call(this);
				}
			},

			pause : function () {
				if(!this.audio.paused) {
                    this.audio.pause();
                    clearInterval(this.timer);
                }
			},

			stop : function () {
                this.audio.currentTime = 0;
				if(!this.audio.paused) {
					this.audio.pause();
					clearInterval(this.timer);
				}
			},

			destroy : function () {
                if(!this.audio.paused) {
					this.audio.pause();
                }
				$(this.audio).remove();
				this.audio = null;
				clearInterval(this.timer);
			}
		});

	})();

	window.AudioControl = AudioControl;

})(jQuery);







/**
 * 시퀀스
 */
(function ($){
    'use strict';

    var Sequence = Sequence || (function () {

        function initSequence() {      
            var owner = this;   
            this.image = $('<img src="' + this.options.source + '/'+this.options.name+pad(this.currentFrame+1, this.options.padNum)+'.'+this.options.fileName+'">');
            this.element.append(this.image);
            if(this.options.preload) preloadImages.call(this);
            owner.startTimer = setTimeout(function (){
                if(owner.options.autoPlay)owner.play();
            }, 500);
        }

        function pad(num, size) {
			 var s = "0000" + num;
			return s.substr(s.length - size);
        }

        function preloadImages() {
            var owner = this;
            var count = 0;
            for(var i=0; i<this.options.totalFrames-1; i++) {
                var image = new Image();
                image.src = this.options.source + '/'+this.options.name + pad(i+1, this.options.padNum)+'.'+this.options.fileName;
                this.images.push(image);
                $(image).one("load error", function ( e ) {
                    count++;
                    if(count == owner.options.totalFrames-1) {
                        owner.element.trigger("init");
                    }
                });
            }
        }

        function unloadImages() {
            for(var i=0; i<this.images.length; i++) {
                this.images[i].src = "";
                this.images[i] = null;
            }
            this.images = [];
        }
        
        function onUpdate() {
            this.currentFrame++;
            this.element.trigger("update", [this.currentFrame, this.options.totalFrames]);
			if(this.currentFrame >= this.options.totalFrames-1) {	
                this.element.trigger("finish", [this.currentFrame, this.options.totalFrames]);
				if(this.options.loop) {
                    this.currentFrame = 0;
				} else {
                    clearInterval(this.timer);
                }
            }
            setImageSrc.call(this);
        }
        
        function setImageSrc () {
            this.image.attr("src", this.options.source + '/'+this.options.name + pad(this.currentFrame+1, this.options.padNum) +'.'+ this.options.fileName);
        }


        return Class.extend({
            init : function (element, options) {
                this.element = element;
                this.options = options;
                this.timer;
                this.startTimer;
                this.currentFrame = 0;
                this.images = [];
                initSequence.call(this);
            },

            play: function () {
                if(this.currentFrame >= this.options.totalFrames) {
                    this.currentFrame = 0;
                }
                clearInterval(this.timer);
                this.timer = setInterval($.proxy(onUpdate, this), 1000/this.options.fps);
            },

            pause: function () {
                clearTimeout(this.startTimer);
                clearInterval(this.timer);
            },

            stop: function () {
                clearTimeout(this.startTimer);
                clearInterval(this.timer);
                this.currentFrame = 0;
                setImageSrc.call(this);
            },

            gotoAndPlay: function ( frame ) {
                clearInterval(this.timer);
                this.currentFrame = parseInt(frame);
                if(this.currentFrame < 0) this.currentFrame = 0;
                if(this.currentFrame > this.options.totalFrames-1) this.currentFrame = this.options.totalFrames-1;
                setImageSrc.call(this);
                this.timer = setInterval($.proxy(onUpdate, this), 1000/this.options.fps);
            },

            gotoAndStop: function ( frame ) {
                clearInterval(this.timer);
                this.currentFrame = parseInt(frame);
                if(this.currentFrame < 0) this.currentFrame = 0;
				if(this.currentFrame > this.options.totalFrames-1) this.currentFrame = this.options.totalFrames-1;
                setImageSrc.call(this);
            },

            destory: function () {
                clearTimeout(this.startTimer);
                unloadImages.call(this);
                clearInterval(this.timer);
            }
        });
    })();

	Sequence.DEFAULT = {
        source: "", 
        name: "",
        totalFrames: 0,
        fps: 30, 
        loop: false,
        autoPlay: false,
        fileName: "png",
        padNum: 4,
        preload: false
    };

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('sequence');
            var options =  $.extend({}, Sequence.DEFAULT, typeof option == "object" && option);
            if(!data || typeof data == 'string') $this.data('sequence', (data = new Sequence($this, options)));
            if(typeof option == 'string') data[option](params);
        });
    }

	window.Sequence = Sequence;
    $.fn.sequence = Plugin;
    $.fn.sequence.Constructor = Sequence;
    
})(jQuery);




/*
*	ChoiceQuiz
*/
(function ($){
    'use strict';

    var ChoiceQuiz = ChoiceQuiz || (function () {

        function initChoiceQuiz() {  
            var owner = this;    
            var correctNum = parseInt(this.element.data("correct"));
            this.element.find(".choice").each(function (i) {
                $(this).data('idx', i+1).on(click, function ( e ) {
                    owner.element.trigger("choice"); 
                    owner.element.find(".choice").removeClass('active');
                    $(this).addClass('active');
                });
            });
            this.element.find(".enter-btn").on(click, function () {
                owner.element.trigger("choice"); 
                if(owner.element.find(".choice.active").length > 0) {
                    if(parseInt(owner.element.find(".choice.active").data('idx')) === correctNum) {
                        owner.element.find(".choice.active").addClass('correct');
                        owner.element.trigger("correct"); 
                    } else {
                        owner.element.trigger("wrong");
                    }
                }
            });
            this.element.on("reset", function () {
                owner.element.find(".choice").removeClass('correct wrong active');
            });
        }

        return Class.extend({
            init : function (element, options) {
                this.element = element;
                this.options = options;
                initChoiceQuiz.call(this);
            }
        });
    })();

	ChoiceQuiz.DEFAULT = {};

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('choiceQuiz');
            var options =  $.extend({}, ChoiceQuiz.DEFAULT, typeof option == "object" && option);
            if(!data || typeof data == 'string') $this.data('choiceQuiz', (data = new ChoiceQuiz($this, options)));
            if(typeof option == 'string') data[option](params);
        });
    }

	window.ChoiceQuiz = ChoiceQuiz;
    $.fn.choiceQuiz = Plugin;
    $.fn.choiceQuiz.Constructor = ChoiceQuiz;
    
})(jQuery);

/*
*	ChoiceMultiQuiz
*/
(function ($){
    'use strict';

    var ChoiceMultiQuiz = ChoiceMultiQuiz || (function () {

        function initChoiceQuiz() {  
            var owner = this;    
            var correctNum = this.element.data("correct");
            this.element.find(".choice-group").each(function (i) {
                var target = $(this);
                $(this).find(".choice").each(function (j) {
                    $(this).data('idx', j+1).on(click, function ( e ) {
                        owner.element.trigger("choice"); 
                        target.find(".choice").removeClass('active');
                        $(this).addClass('active');
                    });
                });
            });

            
            this.element.find(".enter-btn").on(click, function () {
                owner.element.trigger("choice"); 
                if(owner.element.find(".choice.active").length > 0) {
                    var correctCount = 0;
                    owner.element.find(".choice-group").each(function (i) {
                        console.log(parseInt($(this).find(".choice.active").data('idx')), correctNum[i])
                        if(parseInt($(this).find(".choice.active").data('idx')) === correctNum[i]) {
                            correctCount++;
                        }
                    });
                    if(correctCount === correctNum.length) {
                        owner.element.find(".choice.active").addClass('correct');
                        owner.element.trigger("correct"); 
                    } else {
                        owner.element.trigger("wrong");
                    }
                }
            });
            this.element.on("reset", function () {
                owner.element.find(".choice").removeClass('correct wrong active');
            });
        }

        return Class.extend({
            init : function (element, options) {
                this.element = element;
                this.options = options;
                initChoiceQuiz.call(this);
            }
        });
    })();

	ChoiceMultiQuiz.DEFAULT = {};

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('choiceMultiQuiz');
            var options =  $.extend({}, ChoiceMultiQuiz.DEFAULT, typeof option == "object" && option);
            if(!data || typeof data == 'string') $this.data('choiceMultiQuiz', (data = new ChoiceMultiQuiz($this, options)));
            if(typeof option == 'string') data[option](params);
        });
    }

	window.ChoiceMultiQuiz = ChoiceMultiQuiz;
    $.fn.choiceMultiQuiz = Plugin;
    $.fn.choiceMultiQuiz.Constructor = ChoiceMultiQuiz;
    
})(jQuery);


/*
*	ChoiceRepeatQuiz
*/
(function ($){
    'use strict';

    var ChoiceRepeatQuiz = ChoiceRepeatQuiz || (function () {

        function initChoiceRepeatQuiz() {  
            var owner = this;    
            var correctNum = parseInt(this.element.data("correct"));
            owner.repeats = this.element.data("repeat");
            owner.totalTimes = this.element.data("duration");
            owner.audios = [];

            for(let i=0; i<owner.repeats.length; i++) {
                var audioControl = new AudioControl(owner.repeats[i], { onFinish: function () {
                    setTimeout(function () {
                        owner.element.find(".repeat-audio").hide();
                        owner.element.find(".repeat-con").show();
                        var width = owner.element.find(".repeat-con .bar").width();
                        gsap.set(owner.element.find(".repeat-con .bar"), { width: 0 });
                        gsap.set(owner.element.find(".repeat-con .mic"), { x: 0 });
                        gsap.to(owner.element.find(".repeat-con .bar"), owner.totalTimes[owner.repeatCount], {width: width, ease: Linear.easeNone});
                        gsap.to(owner.element.find(".repeat-con .mic"), owner.totalTimes[owner.repeatCount], {x: width, ease: Linear.easeNone});

                        setTimeout(function () {
                            if(owner.repeatCount < owner.repeats.length-1) {
                                owner.element.find(".repeat-audio").show().removeClass("playing");
                                owner.element.find(".repeat-con").hide();
                                setTimeout(function () {
                                    owner.element.find(".repeat-audio").addClass("playing");
                                    owner.repeatCount++;
                                    owner.audios[owner.repeatCount].play();
                                }, 500);
                            } else {
                                owner.element.trigger("finish"); 
                            }
                        }, owner.totalTimes[owner.repeatCount] * 1000);
                    }, 500);
                }});
                owner.audios.push(audioControl);
            }

            this.element.find(".choice").each(function (i) {
                $(this).data('idx', i+1).on(click, function ( e ) {
                    owner.element.trigger("choice"); 
                    owner.element.find(".choice").removeClass('active');
                    $(this).addClass('active');
                });
            });
            this.element.find(".enter-btn").on(click, function () {
                owner.element.trigger("choice"); 
                if(owner.element.find(".choice.active").length > 0) {
                    if(parseInt(owner.element.find(".choice.active").data('idx')) === correctNum) {
                        owner.element.find(".choice.active").addClass('correct');
                        owner.element.trigger("before-correct"); 
                    } else {
                        owner.element.trigger("before-wrong");
                    }
                    owner.element.find(".enter-btn").hide();
                    owner.element.find(".repeat-btn").show();
                    owner.element.find(".repeat-audio").show();
                    owner.element.find(".choice-num").hide();
                    owner.element.find(".choice").css("pointer-events", 'none');
                }
            });
            this.element.find(".repeat-btn").on(click, function () {
                owner.element.find(".repeat-btn").css("pointer-events", 'none');
                owner.element.find(".repeat-audio").addClass("playing");
                owner.audios[0].play();
            });
            this.element.on("reset", function () {
                owner.element.find(".choice").removeClass('correct wrong active');
            });
        }

        return Class.extend({
            init : function (element, options) {
                this.element = element;
                this.options = options;
                this.repeats = [];
                this.audios= [];
                this.totalTimes = [];
                this.repeatCount = 0;
                initChoiceRepeatQuiz.call(this);
            }
        });
    })();

	ChoiceRepeatQuiz.DEFAULT = {};

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('choiceRepeatQuiz');
            var options =  $.extend({}, ChoiceRepeatQuiz.DEFAULT, typeof option == "object" && option);
            if(!data || typeof data == 'string') $this.data('choiceRepeatQuiz', (data = new ChoiceRepeatQuiz($this, options)));
            if(typeof option == 'string') data[option](params);
        });
    }

	window.ChoiceRepeatQuiz = ChoiceRepeatQuiz;
    $.fn.choiceRepeatQuiz = Plugin;
    $.fn.choiceRepeatQuiz.Constructor = ChoiceRepeatQuiz;
    
})(jQuery);

/*
*	InputQuiz
*/
(function ($){
    'use strict';

    var InputQuiz = InputQuiz || (function () {

        function initInputQuiz() {  
            var owner = this;    
            var corrects = this.element.data("correct");
            if(owner.element.find(".guide").length > 0) {
                owner.element.find(".guide").each(function (i) {
                    var text = $(this).text();
                    var em = $('<em style="display: inline-block">'+text+'</em>');
                    $(this).html(em);
                });
                owner.element.find(".input input").each(function () {
                     $(this).on('focus', function () {
                        var left = $(this).parent().find(".guide em").position().left * window.scale;
                        var width = $(this).parent().width() - left;
                        $(this).css({width: width, "text-align": 'left', left: left});
                    });
                });
            }
            owner.element.find(".enter-btn").on(click, function () {
                owner.element.trigger("choice"); 
                var count = 0;
                owner.element.find(".input input").each(function ( i ) {
                    if(corrects[i] === 'o' || corrects[i] === 'x') {
                        if($(this).val().toLowerCase() === corrects[i]) count++;
                    } else {
                        if($(this).val() === corrects[i]) count++;
                    }
                    
                });
                if(count === corrects.length) {
                    owner.element.trigger("correct");
                } else {
                    owner.element.trigger("wrong");
                }
            });
            owner.element.find(".input input").each(function () {
                $(this).on(click, function () {
                    owner.element.trigger("choice"); 
                });
            });
            this.element.on("reset", function () {
                owner.element.find(".input input").val('').blur();
            });
        }

        return Class.extend({
            init : function (element, options) {
                this.element = element;
                this.options = options;
                initInputQuiz.call(this);
            }
        });
    })();

	InputQuiz.DEFAULT = {};

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('inputQuiz');
            var options =  $.extend({}, InputQuiz.DEFAULT, typeof option == "object" && option);
            if(!data || typeof data == 'string') $this.data('inputQuiz', (data = new InputQuiz($this, options)));
            if(typeof option == 'string') data[option](params);
        });
    }

	window.InputQuiz = InputQuiz;
    $.fn.inputQuiz = Plugin;
    $.fn.inputQuiz.Constructor = InputQuiz;
    
})(jQuery);


/*
*	ChoiceInputQuiz
*/
(function ($){
    'use strict';

    var ChoiceInputQuiz = ChoiceInputQuiz || (function () {

        function initChoiceInputQuiz() {  
            var owner = this;    
            var correctNum = parseInt(this.element.data("correct")[0]);
            var correctWord = this.element.data("correct")[1];
            this.element.find(".choice-input").hide();
            if(owner.element.find(".guide").length > 0) {
                owner.element.find(".guide").each(function (i) {
                    var text = $(this).text();
                    var em = $('<em style="display: inline-block">'+text+'</em>');
                    $(this).html(em);
                });
                owner.element.find(".input input").each(function () {
                     $(this).on('focus', function () {
                        var left = $(this).parent().find(".guide em").position().left * window.scale;
                        var width = $(this).parent().width() - left;
                        $(this).css({width: width, "text-align": 'left', left: left});
                    });
                });
            }
            this.element.find(".choice").each(function (i) {
                $(this).data('idx', i+1).on(click, function ( e ) {
                    owner.element.trigger("choice"); 
                    owner.element.find(".choice").removeClass('active');
                    $(this).addClass('active');
                    owner.element.find(".choice-input").show();
                });
            });
            this.element.find(".enter-btn").on(click, function () {
                owner.element.trigger("choice"); 
                if(owner.element.find(".choice.active").length > 0) {

                    if(parseInt(owner.element.find(".choice.active").data('idx')) === correctNum) {
                        var correctCount = 0;
                        owner.element.find(".input").each(function (i) {
                            if($(this).find("input").val() === correctWord[i]) {
                                correctCount++;
                            }
                        });

                        if(correctCount === correctWord.length) {
                            owner.element.find(".choice.active").addClass('correct');
                            owner.element.find(".input").addClass('correct');
                            owner.element.trigger("correct"); 
                        } else {
                            owner.element.trigger("wrong");
                        }
                        
                        
                    } else {
                        owner.element.trigger("wrong");
                    }
                }
            });
            
            this.element.on("reset", function () {
                owner.element.find(".choice").removeClass('correct wrong active');
                owner.element.find(".choice-input").hide();
                owner.element.find(".input").removeClass("correct").find("input").val('');
            });
        }

        return Class.extend({
            init : function (element, options) {
                this.element = element;
                this.options = options;
                initChoiceInputQuiz.call(this);
            }
        });
    })();

	ChoiceInputQuiz.DEFAULT = {};

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('choiceInputQuiz');
            var options =  $.extend({}, ChoiceInputQuiz.DEFAULT, typeof option == "object" && option);
            if(!data || typeof data == 'string') $this.data('choiceInputQuiz', (data = new ChoiceInputQuiz($this, options)));
            if(typeof option == 'string') data[option](params);
        });
    }

	window.ChoiceInputQuiz = ChoiceInputQuiz;
    $.fn.choiceInputQuiz = Plugin;
    $.fn.choiceInputQuiz.Constructor = ChoiceInputQuiz;
    
})(jQuery);


/*
*	DrawLineQuiz
*/
(function ($){
    'use strict';

    var DrawLineQuiz = DrawLineQuiz || (function () {

        function initDrawLineQuiz() {  
            var owner = this;    
            this.correct = this.element.data("correct");

            this.paper = $('<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;width:100%;height:100%"></svg>');
            this.element.prepend(this.paper);
            this.element.find(".line-item").on(touchstart, $.proxy(onTouchStart, owner));
            $(window).on(touchmove, $.proxy(onTouchMove, owner));
            $(window).on(touchend, $.proxy(onTouchEnd, owner));
            this.element.find(".enter-btn").on(click, function () {
                owner.element.trigger("choice"); 
                if(owner.element.find(".line-item.active").length > 0) {
                    var correctCount = 0;
                    owner.element.find(".line-start .line-item").each(function (i) {
                        if(typeof $(this).data("idx2") === 'number') {
                            if($(this).data("idx2")+1 === owner.correct[i]){
                                correctCount++;
                                console.log(i, correctCount);
                            }
                        }
                    });

                    if(correctCount === owner.correct.length) {
                        owner.element.trigger("correct"); 
                        console.log('correct')
                        // owner.element.find(".result").addClass("o");
                    } else {
                        owner.element.trigger("wrong");
                        // owner.element.find(".result").addClass("x");
                    }
                }
            });
            this.element.on("reset", function () {
                // owner.element.find(".result").removeClass("o x");
                owner.element.find(".line-item").removeClass("active");
                for(var i=0; i<owner.paths.length; i++) {
                    owner.paths[i].remove();
                }
                owner.paths = [];
            });
        }

        function onTouchStart ( e ) {
            var target = $(e.currentTarget);
            if(this.touchTarget) {
                removePath.call(this, this.pathTarget);
                return;
            }
            if(!target.is(".active")) {
                this.element.trigger("choice");
                this.startX = ((target.offset().left - this.element.offset().left) * window.scale) + (target.width()/2);
                this.startY = ((target.offset().top - this.element.offset().top) * window.scale) + (target.height()/2);
                this.touchTarget = target;
                this.pathTarget = createPath.call(this);
                e.preventDefault();
				e.stopPropagation();
            } else {
                var selector = ".line-end .line-item";
                var idx = target.data("idx2");
                if(target.parent().is(".line-end")) {
                    selector = ".line-start .line-item";
                }
                removePath.call(this, target.data("save"));
                target.removeClass("active");
                this.element.find(selector).eq(idx).removeClass("active");
                target.data("save", null).data("idx2", null).data("idx2", null);
                this.startX = ((target.offset().left - this.element.offset().left) * window.scale) + (target.width()/2);
                this.startY = ((target.offset().top - this.element.offset().top) * window.scale) + (target.height()/2);
                this.touchTarget = target;
                this.pathTarget = createPath.call(this);
                e.preventDefault();
				e.stopPropagation();
            }
        }

        function onTouchMove ( e ) {
            if(this.touchTarget) {
                this.pageX = e.pageX;
                this.pageY = e.pageY;

                if(e.originalEvent.changedTouches) {
                    this.pageX = e.originalEvent.changedTouches[0].clientX;
                    this.pageY = e.originalEvent.changedTouches[0].clientY;
                }

                var moveX = (this.pageX - this.element.offset().left) * window.scale;
                var moveY = (this.pageY - this.element.offset().top) * window.scale;
                this.pathTarget.attr("d", "M "+this.startX+" "+this.startY+" L "+moveX+" "+moveY);
            }
        }

        function onTouchEnd ( e ) {
            var owner = this;
            if(this.touchTarget) {
                var selector = ".line-end .line-item";
                if(this.touchTarget.parent().is(".line-end")) {
                    selector = ".line-start .line-item";
                }
                var drawTarget = null;
                this.element.find(selector).each(function ( i ) {
                    if(!$(this).is(".active")) {
                        if($(this).hitTestPoint( {"x": owner.pageX, "y": owner.pageY} )) {                                
                            drawTarget = $(this);
                        }                        
                    }
                });

                if(drawTarget) {
                    var moveX = ((drawTarget.offset().left - this.element.offset().left) * window.scale) + (drawTarget.width()/2);
                    var moveY = ((drawTarget.offset().top - this.element.offset().top) * window.scale) + (drawTarget.height()/2);
                    this.pathTarget.attr("d", "M "+this.startX+" "+this.startY+" L "+moveX+" "+moveY);
                    this.touchTarget.addClass("active");
                    drawTarget.addClass("active"); 
                    this.touchTarget.data("save",this.pathTarget).data("idx1", this.touchTarget.index()).data("idx2", drawTarget.index());
                    drawTarget.data("save", this.pathTarget).data("idx2", this.touchTarget.index()).data("idx1", drawTarget.index());
                } else {
                    removePath.call(this, this.pathTarget);
                }

                this.pathTarget = null;
                this.touchTarget = null;
            }
        }

        function createPath () {
            var path = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
			path.attr("stroke", "#f00").attr("stroke-width", 5);
			this.paper.append(path);
			this.paths.push(path);
			return path;
        }

        function removePath ( path ) {
            var ar = new Array();
			for(var i=0; i<this.paths.length;i++) {
				if(path == this.paths[i])   path.remove();
				else                        ar.push(this.paths[i]);
			}
			this.paths = ar;
        }

        return Class.extend({
            init : function (element, options) {
                this.element = element;
                this.options = options;
                this.correct = [];
                this.paper;
                this.paths = [];
                this.touchTarget = null;
                this.pathTarget = null;
                this.startX = 0;
                this.startY = 0;
                this.pageX = 0;
                this.pageY = 0;
                initDrawLineQuiz.call(this);
            }
        });
    })();

	DrawLineQuiz.DEFAULT = {};

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('drawLineQuiz');
            var options =  $.extend({}, DrawLineQuiz.DEFAULT, typeof option == "object" && option);
            if(!data || typeof data == 'string') $this.data('drawLineQuiz', (data = new DrawLineQuiz($this, options)));
            if(typeof option == 'string') data[option](params);
        });
    }

	window.DrawLineQuiz = DrawLineQuiz;
    $.fn.drawLineQuiz = Plugin;
    $.fn.drawLineQuiz.Constructor = DrawLineQuiz;
    
})(jQuery);



/*
*	DrawLineInputQuiz
*/
(function ($){
    'use strict';

    var DrawLineInputQuiz = DrawLineInputQuiz || (function () {

        function initDrawLineInputQuiz() {  
            var owner = this;    
            this.correct1 = this.element.data("correct")[0];
            this.correct2 = this.element.data("correct")[1];

            this.paper = $('<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;width:100%;height:100%"></svg>');
            this.element.prepend(this.paper);
            this.element.find(".line-item").on(touchstart, $.proxy(onTouchStart, owner));
            $(window).on(touchmove, $.proxy(onTouchMove, owner));
            $(window).on(touchend, $.proxy(onTouchEnd, owner));

            if(owner.element.find(".guide").length > 0) {
                owner.element.find(".guide").each(function (i) {
                    var text = $(this).text();
                    var em = $('<em style="display: inline-block">'+text+'</em>');
                    $(this).html(em);
                });
                owner.element.find(".input input").each(function () {
                     $(this).on('focus', function () {
                        var left = $(this).parent().find(".guide em").position().left * window.scale;
                        var width = $(this).parent().width() - left;
                        $(this).css({width: width, "text-align": 'left', left: left});
                    });
                });
            }
            
            this.element.find(".enter-btn").on(click, function () {
                owner.element.trigger("choice"); 
                var correctCount = 0;
                owner.element.find(".line-start .line-item").each(function (i) {
                    if(typeof $(this).data("idx2") === 'number') {
                        if($(this).data("idx2")+1 === owner.correct1[i]){
                            correctCount++;
                        }
                    }
                });

                if(correctCount === owner.correct1.length) {
                    correctCount = 0;
                    owner.element.find(".input").each(function (i) {
                        if($(this).find("input").val() === owner.correct2[i]) {
                            correctCount++;
                        }
                    })
                    if(correctCount === owner.correct2.length) {
                        owner.element.find(".input").addClass("correct");
                        owner.element.trigger("correct"); 
                    } else {
                        owner.element.trigger("wrong");
                    }
                    
                    // owner.element.find(".result").addClass("o");
                } else {
                    owner.element.trigger("wrong");
                    // owner.element.find(".result").addClass("x");
                }
            });
            this.element.on("reset", function () {
                // owner.element.find(".result").removeClass("o x");
                owner.element.find(".input").removeClass("correct").find("input").val('');
                owner.element.find(".line-item").removeClass("active");
                for(var i=0; i<owner.paths.length; i++) {
                    owner.paths[i].remove();
                }
                owner.paths = [];
            });
        }

        function onTouchStart ( e ) {
            var target = $(e.currentTarget);
            if(this.touchTarget) {
                removePath.call(this, this.pathTarget);
                return;
            }
            if(!target.is(".active")) {
                this.element.trigger("choice");
                this.startX = ((target.offset().left - this.element.offset().left) * window.scale) + (target.width()/2);
                this.startY = ((target.offset().top - this.element.offset().top) * window.scale) + (target.height()/2);
                this.touchTarget = target;
                this.pathTarget = createPath.call(this);
                e.preventDefault();
				e.stopPropagation();
            } else {
                var selector = ".line-end .line-item";
                var idx = target.data("idx2");
                if(target.parent().is(".line-end")) {
                    selector = ".line-start .line-item";
                }
                removePath.call(this, target.data("save"));
                target.removeClass("active");
                this.element.find(selector).eq(idx).removeClass("active");
                target.data("save", null).data("idx2", null).data("idx2", null);
                this.startX = ((target.offset().left - this.element.offset().left) * window.scale) + (target.width()/2);
                this.startY = ((target.offset().top - this.element.offset().top) * window.scale) + (target.height()/2);
                this.touchTarget = target;
                this.pathTarget = createPath.call(this);
                e.preventDefault();
				e.stopPropagation();
            }
        }

        function onTouchMove ( e ) {
            if(this.touchTarget) {
                this.pageX = e.pageX;
                this.pageY = e.pageY;

                if(e.originalEvent.changedTouches) {
                    this.pageX = e.originalEvent.changedTouches[0].clientX;
                    this.pageY = e.originalEvent.changedTouches[0].clientY;
                }

                var moveX = (this.pageX - this.element.offset().left) * window.scale;
                var moveY = (this.pageY - this.element.offset().top) * window.scale;
                this.pathTarget.attr("d", "M "+this.startX+" "+this.startY+" L "+moveX+" "+moveY);
            }
        }

        function onTouchEnd ( e ) {
            var owner = this;
            if(this.touchTarget) {
                var selector = ".line-end .line-item";
                if(this.touchTarget.parent().is(".line-end")) {
                    selector = ".line-start .line-item";
                }
                var drawTarget = null;
                this.element.find(selector).each(function ( i ) {
                    if(!$(this).is(".active")) {
                        if($(this).hitTestPoint( {"x": owner.pageX, "y": owner.pageY} )) {                                
                            drawTarget = $(this);
                        }                        
                    }
                });

                if(drawTarget) {
                    var moveX = ((drawTarget.offset().left - this.element.offset().left) * window.scale) + (drawTarget.width()/2);
                    var moveY = ((drawTarget.offset().top - this.element.offset().top) * window.scale) + (drawTarget.height()/2);
                    this.pathTarget.attr("d", "M "+this.startX+" "+this.startY+" L "+moveX+" "+moveY);
                    this.touchTarget.addClass("active");
                    drawTarget.addClass("active"); 
                    this.touchTarget.data("save",this.pathTarget).data("idx1", this.touchTarget.index()).data("idx2", drawTarget.index());
                    drawTarget.data("save", this.pathTarget).data("idx2", this.touchTarget.index()).data("idx1", drawTarget.index());
                } else {
                    removePath.call(this, this.pathTarget);
                }

                this.pathTarget = null;
                this.touchTarget = null;
            }
        }

        function createPath () {
            var path = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
			path.attr("stroke", "#f00").attr("stroke-width", 5);
			this.paper.append(path);
			this.paths.push(path);
			return path;
        }

        function removePath ( path ) {
            var ar = new Array();
			for(var i=0; i<this.paths.length;i++) {
				if(path == this.paths[i])   path.remove();
				else                        ar.push(this.paths[i]);
			}
			this.paths = ar;
        }

        return Class.extend({
            init : function (element, options) {
                this.element = element;
                this.options = options;
                this.correct = [];
                this.paper;
                this.paths = [];
                this.touchTarget = null;
                this.pathTarget = null;
                this.startX = 0;
                this.startY = 0;
                this.pageX = 0;
                this.pageY = 0;
                initDrawLineInputQuiz.call(this);
            }
        });
    })();

	DrawLineInputQuiz.DEFAULT = {};

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('drawLineInputQuiz');
            var options =  $.extend({}, DrawLineInputQuiz.DEFAULT, typeof option == "object" && option);
            if(!data || typeof data == 'string') $this.data('drawLineInputQuiz', (data = new DrawLineInputQuiz($this, options)));
            if(typeof option == 'string') data[option](params);
        });
    }

	window.DrawLineInputQuiz = DrawLineInputQuiz;
    $.fn.drawLineInputQuiz = Plugin;
    $.fn.drawLineInputQuiz.Constructor = DrawLineInputQuiz;
    
})(jQuery);


/*
*	DraggableQuiz
*/
(function ($){
    'use strict';

    var DraggableQuiz = DraggableQuiz || (function () {

        function initDraggableQuiz() {  
            var owner = this;    
            this.correct = this.element.data("correct");
            this.areaPath = this.element.data("area-image");

            this.element.find(".drag-item").each(function (i) {                
                $(this).data("idx", i+1).on(touchstart, $.proxy(onTouchStart, owner));             
                var styles = getComputedStyle($(this)[0]);
                var x = parseInt(styles['left']);
                var y = parseInt(styles['top']);
                $(this).data("x", x).data("y", y).css({left:0, top:0});
                gsap.set($(this), { x:x, y:y });
            });

            this.element.find(".drag-area").each(function (i) {
                $(this).data("idx", i+1);
                var styles = getComputedStyle($(this)[0]);
                var x = parseInt(styles['left']);
                var y = parseInt(styles['top']);
                $(this).data("x", x).data("y", y);                
                $(this).on(touchstart, function () {
                    if($(this).is(".active")) {
                        var drag = $(this).data("drag");
                        drag.removeClass("active").data("area", null);
                        $(this).removeClass("active").data("drag", null).css({"background": "transparent"});
                    }
                })
            });

            $(window).on(touchmove, $.proxy(onTouchMove, owner));
            $(window).on(touchend, $.proxy(onTouchEnd, owner));

            this.element.find(".enter-btn").on(click, function () {
                owner.element.trigger("choice"); 
                if(owner.element.find(".drag-item.active").length > 0) {
                    var correctCount = 0;
                    owner.element.find(".drag-item").each(function (i) {
                        if($(this).data("area")) {
                            if($(this).data("area").data("idx") === owner.correct[i]){
                                correctCount++;
                            }
                        }
                    });

                    if(correctCount === owner.correct.length) {
                        owner.element.trigger("correct"); 
                        // owner.element.find(".result").addClass("o");
                    } else {
                        owner.element.trigger("wrong");
                        // owner.element.find(".result").addClass("x");
                    }
                }
            });
            this.element.on("reset", function () {
                owner.element.find(".drag-item").removeClass("active").data("area", null);
                owner.element.find(".drag-area").removeClass("active").css({"background": "transparent"}).data("drag", null);
                // owner.element.find(".result").removeClass("o x");
            });
        }

        function onTouchStart ( e ) {
            
            var pageX = e.pageX;
			var pageY = e.pageY;

			if(e.originalEvent.changedTouches) {
				pageX = e.originalEvent.changedTouches[0].clientX;
				pageY = e.originalEvent.changedTouches[0].clientY;
            }
            var target = $(e.currentTarget);

            if(!target.is(".active")) {
                this.touchTarget = target;
                this.startX = (target.offset().left - this.element.offset().left - pageX) * window.scale;
                this.startY = (target.offset().top - this.element.offset().top - pageY) * window.scale;
                this.touchTarget.css({"z-index": 999});                
            }

            e.preventDefault();
			e.stopPropagation();
        }

        function onTouchMove ( e ) {
            if(this.touchTarget) {
				var pageX = e.pageX;
				var pageY = e.pageY;
				if(e.originalEvent.changedTouches) {
					pageX = e.originalEvent.changedTouches[0].clientX;
					pageY = e.originalEvent.changedTouches[0].clientY;
                }
                var tartetX = pageX * window.scale;
                var targetY = pageY * window.scale;
                
                gsap.set(this.touchTarget, {x: tartetX + this.startX , y: targetY + this.startY});

				e.preventDefault();
				e.stopPropagation();
			}
        }

        function onTouchEnd ( e ) {
            var owner = this;
            if(this.touchTarget) {
                owner.element.trigger("choice"); 
                var hitTarget = null;
                for(var i=0; i<this.element.find(".drag-area").length; i++) {
                    var dragArea = this.element.find(".drag-area").eq(i);
                    if( this.touchTarget.find(".area").objectHitTest({"object": dragArea.find(".area")}) ) {
                        if(!dragArea.is(".active")) hitTarget = dragArea; 
                        break;
                    }
                }
                if( hitTarget ) {
                    this.touchTarget.addClass("active");
                    this.touchTarget.data("area", hitTarget).addClass("active").css({"z-index":""});
                    hitTarget.data("drag", this.touchTarget).addClass("active").css({"background":`url(${this.areaPath}0${this.touchTarget.data("idx")}.png) no-repeat`});
                    gsap.set(this.touchTarget, {x:this.touchTarget.data("x"), y:this.touchTarget.data("y")});
                } else {
                    this.touchTarget.removeClass("active");
                    gsap.to(this.touchTarget, 0.6, {x:this.touchTarget.data("x"), y:this.touchTarget.data("y"), ease:Cubic.easeOut, onCompleteParams:[this.touchTarget], onComplete:function ( target ) {
                        target.css({"z-index":""});
                    }});
                }
                this.touchTarget = null;
            }
        }

        

        return Class.extend({
            init : function (element, options) {
                this.element = element;
                this.options = options;
                this.correct = [];
                this.areaPath = "";
                this.touchTarget = null;
                this.startX = 0;
                this.startY = 0;
                initDraggableQuiz.call(this);
            }
        });
    })();

	DraggableQuiz.DEFAULT = {};

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('draggableQuiz');
            var options =  $.extend({}, DraggableQuiz.DEFAULT, typeof option == "object" && option);
            if(!data || typeof data == 'string') $this.data('draggableQuiz', (data = new DraggableQuiz($this, options)));
            if(typeof option == 'string') data[option](params);
        });
    }

	window.DraggableQuiz = DraggableQuiz;
    $.fn.draggableQuiz = Plugin;
    $.fn.draggableQuiz.Constructor = DraggableQuiz;
    
})(jQuery);


/*
*	DraggableInputQuiz
*/
(function ($){
    'use strict';

    var DraggableInputQuiz = DraggableInputQuiz || (function () {

        function initDraggableInputQuiz() {  
            var owner = this;    
            this.correct1 = this.element.data("correct")[0];
            this.correct2 = this.element.data("correct")[1];
            this.areaPath = this.element.data("area-image");

            if(owner.element.find(".guide").length > 0) {
                owner.element.find(".guide").each(function (i) {
                    var text = $(this).text();
                    var em = $('<em style="display: inline-block">'+text+'</em>');
                    $(this).html(em);
                });
                owner.element.find(".input input").each(function () {
                     $(this).on('focus', function () {
                        var left = $(this).parent().find(".guide em").position().left * window.scale;
                        var width = $(this).parent().width() - left;
                        $(this).css({width: width, "text-align": 'left', left: left});
                    });
                });
            }
            
            this.element.find(".drag-item").each(function (i) {                
                $(this).data("idx", i+1).on(touchstart, $.proxy(onTouchStart, owner));             
                var styles = getComputedStyle($(this)[0]);
                var x = parseInt(styles['left']);
                var y = parseInt(styles['top']);
                $(this).data("x", x).data("y", y).css({left:0, top:0});
                gsap.set($(this), { x:x, y:y });
            });

            this.element.find(".drag-area").each(function (i) {
                $(this).data("idx", i+1);
                var styles = getComputedStyle($(this)[0]);
                var x = parseInt(styles['left']);
                var y = parseInt(styles['top']);
                $(this).data("x", x).data("y", y);                
                $(this).on(touchstart, function () {
                    if($(this).is(".active")) {
                        var drag = $(this).data("drag");
                        drag.removeClass("active").data("area", null);
                        $(this).removeClass("active").data("drag", null).css({"background": "transparent"});
                    }
                })
            });

            $(window).on(touchmove, $.proxy(onTouchMove, owner));
            $(window).on(touchend, $.proxy(onTouchEnd, owner));

            this.element.find(".enter-btn").on(click, function () {
                owner.element.trigger("choice"); 
                if(owner.element.find(".drag-item.active").length > 0) {
                    var correctCount = 0;
                    owner.element.find(".drag-item").each(function (i) {
                        if($(this).data("area")) {
                            if($(this).data("area").data("idx") === owner.correct1[i]){
                                correctCount++;
                            }
                        }
                    });

                    if(correctCount === owner.correct1.length) {
                        correctCount = 0;
                        owner.element.find(".input").each(function (i) {
                            if($(this).find("input").val() === owner.correct2[i]) {
                                correctCount++;
                            }
                        })
                        if(correctCount === owner.correct2.length) {
                            owner.element.find(".input").addClass("correct");
                            owner.element.trigger("correct"); 
                        } else {
                            owner.element.trigger("wrong");
                        }
                    } else {
                        owner.element.trigger("wrong");
                        // owner.element.find(".result").addClass("x");
                    }
                }
            });
            this.element.on("reset", function () {
                owner.element.find(".input").removeClass("correct").find("input").val('');
                owner.element.find(".drag-item").removeClass("active").data("area", null);
                owner.element.find(".drag-area").removeClass("active").css({"background": "transparent"}).data("drag", null);
                // owner.element.find(".result").removeClass("o x");
            });
        }

        function onTouchStart ( e ) {
            var pageX = e.pageX;
			var pageY = e.pageY;

			if(e.originalEvent.changedTouches) {
				pageX = e.originalEvent.changedTouches[0].clientX;
				pageY = e.originalEvent.changedTouches[0].clientY;
            }
            var target = $(e.currentTarget);

            if(!target.is(".active")) {
                this.touchTarget = target;
                this.startX = (target.offset().left - this.element.offset().left - pageX) * window.scale;
                this.startY = (target.offset().top - this.element.offset().top - pageY) * window.scale;
                this.touchTarget.css({"z-index": 999});                
            }

            e.preventDefault();
			e.stopPropagation();
        }

        function onTouchMove ( e ) {
            if(this.touchTarget) {
				var pageX = e.pageX;
				var pageY = e.pageY;
				if(e.originalEvent.changedTouches) {
					pageX = e.originalEvent.changedTouches[0].clientX;
					pageY = e.originalEvent.changedTouches[0].clientY;
                }
                var tartetX = pageX * window.scale;
                var targetY = pageY * window.scale;
                
                gsap.set(this.touchTarget, {x: tartetX + this.startX , y: targetY + this.startY});

				e.preventDefault();
				e.stopPropagation();
			}
        }

        function onTouchEnd ( e ) {
            var owner = this;
            if(this.touchTarget) {
                owner.element.trigger("choice"); 
                var hitTarget = null;
                for(var i=0; i<this.element.find(".drag-area").length; i++) {
                    var dragArea = this.element.find(".drag-area").eq(i);
                    if( this.touchTarget.find(".area").objectHitTest({"object": dragArea.find(".area")}) ) {
                        if(!dragArea.is(".active")) hitTarget = dragArea; 
                        break;
                    }
                }
                if( hitTarget ) {
                    this.touchTarget.addClass("active");
                    this.touchTarget.data("area", hitTarget).addClass("active").css({"z-index":""});
                    hitTarget.data("drag", this.touchTarget).addClass("active").css({"background":`url(${this.areaPath}0${this.touchTarget.data("idx")}.png) no-repeat`});
                    gsap.set(this.touchTarget, {x:this.touchTarget.data("x"), y:this.touchTarget.data("y")});
                } else {
                    this.touchTarget.removeClass("active");
                    gsap.to(this.touchTarget, 0.6, {x:this.touchTarget.data("x"), y:this.touchTarget.data("y"), ease:Cubic.easeOut, onCompleteParams:[this.touchTarget], onComplete:function ( target ) {
                        target.css({"z-index":""});
                    }});
                }
                this.touchTarget = null;
            }
        }

        

        return Class.extend({
            init : function (element, options) {
                this.element = element;
                this.options = options;
                this.correct = [];
                this.areaPath = "";
                this.touchTarget = null;
                this.startX = 0;
                this.startY = 0;
                initDraggableInputQuiz.call(this);
            }
        });
    })();

	DraggableInputQuiz.DEFAULT = {};

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('draggableInputQuiz');
            var options =  $.extend({}, DraggableInputQuiz.DEFAULT, typeof option == "object" && option);
            if(!data || typeof data == 'string') $this.data('draggableInputQuiz', (data = new DraggableInputQuiz($this, options)));
            if(typeof option == 'string') data[option](params);
        });
    }

	window.DraggableInputQuiz = DraggableInputQuiz;
    $.fn.draggableInputQuiz = Plugin;
    $.fn.draggableInputQuiz.Constructor = DraggableInputQuiz;
    
})(jQuery);



//documentReady
$(function () {

	//리사이징 처리
	var contentWidth = 1280;
	var contentHeight = 635;
    var scale;


    gsap.set($("#game-content"), {transformOrigin:"top left"});
	$(window).on("resize", function ( e ) {
		var winWidth = $(window).width();
		var winHeight = $(window).height(); 
		var scaleX = winWidth/contentWidth;
		var scaleY = winHeight/contentHeight;
		scale = Math.min(scaleX, scaleY);
		var left = (winWidth-(contentWidth*scale))/2;
		var top = (winHeight-(contentHeight*scale))/2;
		gsap.set($("#game-content"), {scaleX:scale, scaleY:scale, left:left, top:top});
		gsap.set($("#container"), {height:(contentHeight*scale)+top});
		window.scale = 1/scale;
	});

	$(window).trigger("resize");

	setTimeout(function () {
		$(window).trigger("resize");
    }, 100);


    // var clickAudio = new AudioControl("./audio/click.mp3");
    var touchTarget = null;
    $(".button").on(touchstart, function ( e ) {
        if(!touchTarget) {
            // clickAudio.stop();
            // clickAudio.play();
            $(this).addClass("down");
            touchTarget = this;
        }
    });

    $(".button").on("mouseleave", function ( e ) {
        if(touchTarget) {
            $(touchTarget).removeClass("down");
        }
    });
    
    $(window).on(touchend + " " + click, function ( e ) {
        $(touchTarget).removeClass("down");
        touchTarget = null;
    });

    $("#game .quiz-choice").each(function () {
        $(this).choiceQuiz();
    });

    $("#game .quiz-choice-multi").each(function () {
        $(this).choiceMultiQuiz();
    });

    $("#game .peat").each(function () {
        $(this).choiceRepeatQuiz();
    });

    $("#game .quiz-choice-input").each(function () {
        $(this).choiceInputQuiz();
    });

    $("#game .quiz-input").each(function () {
        $(this).inputQuiz();
    });

    $("#game .quiz-drawline").each(function () {
        $(this).drawLineQuiz();
    });
    $("#game .quiz-drawline-input").each(function () {
        $(this).drawLineInputQuiz();
    });

    $("#game .quiz-draggable").each(function () {
        $(this).draggableQuiz();
    });

    $("#game .quiz-draggable-input").each(function () {
        $(this).draggableInputQuiz();
    });
    
    createAudioButton();

});

function createAudioButton () {
    $(".audio-btn").each(function (i) {
        if($(this).data('audioControl')) return;
        var owner = $(this);
        var src = $(this).data('audio');
        var audio = new AudioControl(src, { onFinish: function () {
            owner.removeClass("playing");
        }});
        $(this).data('audioControl', audio);
        $(this).on(click, function () {
            if(!$(this).is(".playing")) {
                $(".audio-btn").each(function () {
                    $(this).data('audioControl').stop();
                    $(this).removeClass("playing");
                });
                audio.play();
                $(this).addClass("playing");
            } else {
                audio.stop();
                $(this).removeClass("playing");
            }
        });
        $(this).on("stop", function () {
            audio.stop();
            $(this).removeClass("playing");
        });
    });
}