gsap.registerPlugin(CustomWiggle);
CustomWiggle.create("wiggle", {wiggles: 3, type:"linear"});

(function ( $ ) {
	'use strict';
	
	var Character = Character || (function () {

        function collision (rect1, rect2) {
            if (rect1.x < rect2.x + rect2.width && 
                rect1.x + rect1.width > rect2.x && 
                rect1.y < rect2.y + rect2.height && 
                rect1.y + rect1.height > rect2.y) {
              return true
            } else {
              return false
            }
        }

        function checkGround () {
            var rect1 = {
                x: this.tar.x + this.tar.bottom.x, 
                y: this.tar.y + this.tar.bottom.y + 756, 
                width: this.tar.bottom.nominalBounds.width * this.tar.bottom.scaleX,
                height: this.tar.bottom.nominalBounds.height * this.tar.bottom.scaleY,
            }
            for (var i= 0; i < this.map.numChildren; i++) {
                var m = this.map.getChildAt(i);
                if(String(m.name).includes("ground")) {
                    var rect2 = {
                        x: m.x, 
                        y: m.y,
                        width: m.nominalBounds.width * m.scaleX,
                        height: m.nominalBounds.height * m.scaleY,
                    }
                    
                    if(collision(rect1, rect2)) {
                        return m;
                    }
                }
            }
            return null;
        }

        function checkFront () {
            var arrow = this.tar.right;
            if(this.tar.tar.scaleX < 0) arrow = this.tar.left;
            var rect1 = {
                x: this.tar.x + arrow.x, 
                y: this.tar.y + arrow.y + 756, 
                width: arrow.nominalBounds.width * arrow.scaleX,
                height: arrow.nominalBounds.height * arrow.scaleY,
            }
            for (var i= 0; i < this.map.numChildren; i++) {
                var m = this.map.getChildAt(i);    
                if(String(m.name).includes("ground")) {
                    
                    var rect2 = {
                        x: m.x, 
                        y: m.y,
                        width: m.nominalBounds.width * m.scaleX,
                        height: m.nominalBounds.height * m.scaleY,
                    }
                    if(collision(rect1, rect2)) {
                        return m;
                    }
                }
            }
            return null;
        }

        function checkReposition() {
            var pos = null;
            for (var i= this.map.numChildren-1; i >= 0; i--) {
                var m = this.map.getChildAt(i);
                if(String(m.name).includes("ground")) {
                    if(this.tar.x > m.x) {
                        pos = {
                            x: m.x + (m.nominalBounds.width * m.scaleX) - 80,
                            y: m.y - 766
                        };
                        break;
                    }
                }
            }
            return pos;
        }

        function checkItem() {
            var rect1 = {
                x: this.tar.x - ((this.tar.nominalBounds.width * this.tar.scaleX)/2), 
                y: this.tar.y - ((this.tar.nominalBounds.height * this.tar.scaleY)/2), 
                width: this.tar.nominalBounds.width * this.tar.scaleX,
                height: this.tar.nominalBounds.height * this.tar.scaleY,
            }
            for (var i= this.tar.parent.numChildren-1; i >= 0; i--) {
                var m = this.tar.parent.getChildAt(i);
                if(String(m.name).includes("item")) {
                    var rect2 = {
                        x: m.x - 31, 
                        y: m.y - 35,
                        width: m.nominalBounds.width * m.scaleX,
                        height: m.nominalBounds.height * m.scaleY,
                    }
                    if(collision(rect1, rect2)) {
                        m.visible = false;
                    }
                }
            }
        }
		
		return Class.extend({
			init : function ( tar, map ) {
				this.tar = tar;
                this.map = map;
                this.moveDir = 0;
                this.gravity = 0.5;
                this.velocity = 0;
                this.jumpHeight = -13;
                this.jumFlag = false;
                this.finishTarget = null;
                this.isJump = false;
                this.isDie = false;
                this.isQuiz = false; 
			},

            move: function ( dir ) {
                if(this.isDie || this.isQuiz) return;
                this.moveDir = dir;
                if(dir < 0) {
                    this.tar.tar.scaleX = -1;
                    if(!this.isJump)
                        this.tar.tar.gotoAndStop(1);
                } else if(dir > 0) {
                    this.tar.tar.scaleX = 1;
                    if(!this.isJump)
                        this.tar.tar.gotoAndStop(1);
                } else {
                    if(!this.isJump)
                        this.tar.tar.gotoAndStop(0);
                }
            },

            jump: function () {
                if(this.isDie || this.isQuiz) return;
                var owner = this;
                if (checkGround.call(this)) {
                    this.velocity += this.jumpHeight;
                    owner.jumFlag = true;
                    this.isJump = true;
                    this.tar.tar.gotoAndStop(2);
                    setTimeout(function () { owner.jumFlag = false;}, 300);
                }
            },

            update: function () {
                if(this.isDie || this.isQuiz) return;
                var owner = this;
                var collTarget = checkGround.call(this);
                var targetX = parseInt(this.tar.x + this.moveDir);
                if(this.moveDir < 0 && targetX < 50) {
                    targetX = 50;
                } else if (this.moveDir > 0 && targetX > 15310) {
                    targetX = 15310;
                }
                
                if(!checkFront.call(this)) {
                    this.tar.x = targetX;   
                }

                this.velocity += this.gravity;
                this.tar.y += this.velocity;
                if (collTarget && !this.jumFlag) {
                    this.tar.y = collTarget.y - 766;
                    this.velocity = 0;
                    this.isJump = false;
                }

                checkItem.call(this);
                
                if(this.tar.y > 50) {
                    this.tar.alpha -= 0.1;
                }

                if(this.tar.y > 300) {
                    this.isDie = true;
                    var repos = checkReposition.call(this);
                    owner.tar.tar.gotoAndStop(0);
                    this.tar.tar.scaleX = 1;
                    gsap.set(owner.tar, {delay:1, x: repos.x, y: repos.y, alpha: 0.7});
                    gsap.to(owner.tar, 0.7, {delay:1, alpha: 1, ease: 'wiggle', onComplete: function () {
                        owner.isDie = false;
                        gsap.to(owner.tar, 0.2, {alpha: 1});
                    }});
                }

            }

		});

	})();

	window.Character = Character;

})(jQuery);


(function ( $ ) {
	'use strict';
	
	var GameManager = GameManager || (function () {

		function initGameManager() {
            var owner = this;
            $(window).on('keydown', function (e) {
                if(e.which === 65 || e.which === 37) {
                    owner.moveDirection = -owner.runSpeed;
                } else if(e.which === 68 || e.which === 39) {
                    owner.moveDirection = owner.runSpeed;
                } else if(e.which === 87 || e.which === 38 || e.which === 32) {
                    if(!this.clickJump) {
                        owner.character.jump();
                        this.clickJump = true;
                    }
                }
            });

            $(window).on('keyup', function (e) {
                if(owner.moveDirection < 0 && (e.which === 65 || e.which === 37)) {
                    owner.moveDirection = 0;
                } else if(owner.moveDirection > 0 && (e.which === 68 || e.which === 39)) {
                    owner.moveDirection = 0;
                } else if(e.which === 87 || e.which === 38 || e.which === 32) {
                    this.clickJump = false;
                }
            });
            function step( delta ) {
                owner.character.move(owner.moveDirection);
                owner.character.update();
                owner.tar.x = parseInt(7683 + (380 - owner.character.tar.x));
                if(owner.tar.x > 7683) {
                    owner.tar.x = 7683;
                } else if(owner.tar.x < -6380) {
                    owner.tar.x = -6380;
                }
                owner.timer = window.requestAnimationFrame(step);
            }

            owner.timer = window.requestAnimationFrame(step);

		}
		
		return Class.extend({

			init : function ( tar ) {
				this.tar = tar;
                this.character = new Character(tar.character, tar.map);
                this.timer = null;
                this.moveDirection = 0;
                this.runSpeed = 7;
                this.clickJump = false;
				initGameManager.call(this);
			}
		});

	})();

	window.GameManager = GameManager;

})(jQuery);




(function () {
    
    // var quizCount = 0;
    // var isListen = false;
    // var targetQuiz = null;
    // var targetAudio = null;


    // var correctAudio = new AudioControl("../common/audio/correct.mp3");
    // var wrongAudio = new AudioControl("../common/audio/wrong.mp3");
    // var bgmAudio = new AudioControl(`../common/audio/bgm_${window.path2}.mp3`, {onFinish: function () {
    //     bgmAudio.play();
    // }});
    // var decorateAudio = new AudioControl("../common/audio/decorate.mp3");
    // var decorateClearAudio = new AudioControl("../common/audio/decorate_clear.mp3");








    window.initGame = function () {
        $("#game").show();
        $("#background").show();
        // showQuiz();

        var gameManager = new GameManager(exportRoot.gameCon);
        
    }
    

    // function showQuiz() {
    //     $("#game .blind-con").hide();
    //     $("#game .quiz").hide().off("correct wrong");

    //     $("#game .pagination .page").removeClass("active");
    //     $("#game .pagination .page").eq(quizCount).addClass("active");

    //     targetQuiz = $("#game .quiz").eq(quizCount);
    //     targetQuiz.show();

    //     if(targetQuiz.data('title-audio')) {
    //         isListen = false;
    //         targetAudio = new AudioControl(targetQuiz.data('title-audio'), {
    //             onFinish: function () {
    //                 targetQuiz.find(".title .audio-play").removeClass("playing");
    //             }
    //         });
    //     } else {
    //         isListen = true;
    //     }

    //     targetQuiz.find(".title .audio-play").off("click").on(click, function () {
    //         isListen = true;
    //         if(!targetQuiz.find(".title .audio-play").is(".playing")) {
    //             targetAudio.play();
    //             targetQuiz.find(".title .audio-play").addClass("playing");
    //         } else {
    //             targetAudio.pause();
    //             targetQuiz.find(".title .audio-play").removeClass("playing");
    //         }
    //     });

    //     targetQuiz.find(".title .audio-stop").off("click").on(click, function () {
    //         targetAudio.stop();
    //         targetQuiz.find(".title .audio-play").removeClass("playing");
    //     });

    //     targetQuiz.off("choice").on("choice", function () {
    //         $("#game .blind-con").show();
    //         if(checkTitleAudio()){
    //             $("#game .blind-con").hide();
    //         }
    //     });

    //     targetQuiz.off("correct").on("correct", function () {
    //         $("#game .blind-con").show();
    //         if(!checkTitleAudio()) return;
    //         correctQuiz();
    //     });

    //     targetQuiz.off("wrong").on("wrong", function () {
    //         $("#game .blind-con").show();
    //         if(!checkTitleAudio()) return;
    //         wrongQuiz();
    //     });
        
    // }

    // function checkTitleAudio() {
    //     if(!isListen) {
    //         setTimeout(function () {targetQuiz.trigger("reset");}, 100)
    //         $("#game .audio-warnning").show();
    //         gsap.set($("#game .audio-warnning"), {scaleX: 0.5, scaleY: 0.5, opacity: 0});
    //         gsap.to($("#game .audio-warnning"), 0.5, {scaleX: 1, scaleY: 1, opacity: 1, ease: Back.easeOut});
    //         setTimeout(function () {
    //             $("#game .audio-warnning").hide();
    //             $("#game .blind-con").hide();
    //         }, 1000);
    //     }
    //     return isListen;
    // }

    // function correctQuiz () {
    //     $(".audio-btn").each(function () {
    //         $(this).data('audioControl').stop();
    //         $(this).removeClass("playing");
    //     });
    //     correctAudio.play();
    //     if(targetAudio) {
    //         targetAudio.destroy();
    //         targetAudio = null;
    //     }
    //     targetQuiz.find(".title .audio-play").removeClass("playing");
    //     if(exportRoot.character) exportRoot.character.gotoAndStop(1);
    //     exportRoot.clearEffect.play();
    //     nextQuiz();
    // }

    // function wrongQuiz () {
    //     $(".audio-btn").each(function () {
    //         $(this).data('audioControl').stop();
    //         $(this).removeClass("playing");
    //     });
    //     wrongAudio.play();
    //     if(targetAudio) {
    //         targetAudio.destroy();
    //         targetAudio = null;
    //     }
    //     targetQuiz.find(".title .audio-play").removeClass("playing");
        
    //     if(exportRoot.character) exportRoot.character.gotoAndStop(2);
        
    //     setTimeout(function () {
    //         $("#game .blind-con").hide();
    //         targetQuiz.trigger("reset");
    //         showQuiz();
    //     }, 2000);
    // }

    // function nextQuiz () {
    //     quizCount++;
    //     if(quizCount < 3) {
    //         setTimeout(showQuiz, 2000);
    //     } else {
    //         setTimeout(startDecorateLoading, 2000);
    //     }
    // }

    // function startDecorateLoading () {
    //     $("#game").hide();
    //     $("#decorate-loading").show();
    //     var width = $("#decorate-loading .progress .bar").width();
    //     // var count = 0;
    //     // var count2 = 0;
    //     gsap.set($("#decorate-loading .progress .bar"), {width :0});
    //     gsap.from($("#decorate-loading"), 0.6, {y: -635, onComplete: function () {
    //         gsap.to($("#decorate-loading .progress .bar"), 3, { 
    //             width :width, 
    //             ease: Linear.easeNone, 
    //             // onUpdate: function () {
    //             //     if(count === 10) {
    //             //         if(count2 === 0) {
    //             //             $("#decorate-loading .text > span").eq(0).css({opacity: 0});
    //             //             $("#decorate-loading .text > span").eq(1).css({opacity: 0});
    //             //             count2 = 1;
    //             //         } else if(count2 === 1) {
    //             //             $("#decorate-loading .text > span").eq(0).css({opacity: 1});
    //             //             count2 = 2;
    //             //         } else {
    //             //             $("#decorate-loading .text > span").eq(1).css({opacity: 1});
    //             //             count2 = 0
    //             //         }
    //             //         count = 0;
    //             //     }
    //             //     count++;
    //             // }
    //         });
    //         setTimeout(function () {
    //             startDecorate();
    //         }, 3500);
    //     }});
    // }

    // function startDecorate () {
    //     $("#game").hide();
    //     $("#decorate").show();
    //     gsap.to($("#decorate-loading"), 0.6, {y: 635, onComplete: function (){
    //         $("#decorate-loading").hide();
    //     }});
    //     bgmAudio.play();
    //     $("#decorate .item").on(click, function () {
    //         var idx = $(this).index();
    //         if(!$(this).is(".active")) {
    //             decorateAudio.stop();
    //             decorateAudio.play();
    //             $(this).addClass("active");
    //             if(exportRoot.character) exportRoot.character.gotoAndStop(1);
    //             exportRoot.items["item"+idx].play();
    //             exportRoot.items["light"+idx].play();
    //             $("#decorate .blind-con").show();
    //             setTimeout(function () {
    //                 $("#decorate .blind-con").hide();
    //             }, 1000);
    //         } else {
    //             $(this).removeClass("active");
    //             exportRoot.items["item"+idx].gotoAndStop(0);
    //         }
    //     });
    //     $("#decorate .enter-btn").on(click, function () {
    //         $("#decorate .blind-con").show();
    //         bgmAudio.stop();
    //         decorateClearAudio.play();
    //         exportRoot.ending.play();
    //         if(exportRoot.character) exportRoot.character.gotoAndStop(1);
    //         setTimeout(function () {
    //             location.href = `../${window.path1}_${window.path2}_ending/ending.html?grade=${window.grade}&lesson=${window.lesson}&chasi=${window.chasi}&level=${window.level}`;
    //         }, 6000)
    //     });
    // }

    
    
})();

