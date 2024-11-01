gsap.registerPlugin(CustomWiggle);
CustomWiggle.create("wiggle", {wiggles: 3, type:"linear"});


(function ( $ ) {
	'use strict';
	
	var Character = Character || (function () {

        function initCharacter() {
            gsap.set(this.tar, {x: 380, y: 396, force3D: true});
            gsap.set(this.tar.find(".char"), {scaleX: 1});
            this.idleAni = new Sequence(this.tar.find(".idle"), {
                source: "./images/character/idle",
                name: "idle_",
                loop: true,
                autoPlay: true,
                totalFrames: 28,
                padNum: 4,
                fps: 30,
                fileName: 'png'
            });

            this.walkAni = new Sequence(this.tar.find(".walk"), {
                source: "./images/character/walk",
                name: "walk_",
                loop: true,
                autoPlay: false,
                totalFrames: 16,
                padNum: 4,
                fps: 30,
                fileName: 'png'
            });

            this.jumpAni = new Sequence(this.tar.find(".jump"), {
                source: "./images/character/jump",
                name: "jump_",
                loop: false,
                autoPlay: false,
                totalFrames: 21,
                padNum: 4,
                fps: 30,
                fileName: 'png'
            });
        }

        function playAni ( name ) {
            if(name === 'idle') {
                this.tar.find(".idle").show();
                this.tar.find(".walk").hide();
                this.tar.find(".jump").hide();
                this.idleAni.gotoAndPlay(0);
                this.walkAni.pause();
                this.jumpAni.pause();
            } else if(name === 'walk') {
                this.tar.find(".idle").hide();
                this.tar.find(".walk").show();
                this.tar.find(".jump").hide();
                this.idleAni.pause();
                this.walkAni.gotoAndPlay(0);
                this.jumpAni.pause();
            } else if(name === 'jump') {
                this.tar.find(".idle").hide();
                this.tar.find(".walk").hide();
                this.tar.find(".jump").show();
                this.idleAni.pause();
                this.walkAni.pause();
                this.jumpAni.gotoAndPlay(0);
            }
        }

        function checkGround () {
            for(var i = 0; i<this.map.find(".ground").length; i++) {
                var ground = this.map.find(".ground").eq(i);
                if(ground.objectHitTest({"object": this.tar.find(".bottom")})) {
                    return ground;
                }
            }
            return null;
        }

        function checkFront () {
            var arrowTar = this.tar.find(".char")[0]._gsap.scaleX === 1 ? this.tar.find(".right") : this.tar.find(".left");
            for(var i = 0; i<this.map.find(".ground").length; i++) {
                var ground = this.map.find(".ground").eq(i);
                if(ground.objectHitTest({"object": arrowTar})) {
                    return ground;
                }
            }
            return null;
        }

        function checkReposition() {
            var pos = null;
            for(var i = this.map.find(".ground").length-1; i>=0; i--) {
                var ground = this.map.find(".ground").eq(i);
                if(parseInt(this.tar[0]._gsap.x) > parseInt(ground.css("left"))) {
                    pos = {
                        x: parseInt(ground.css("left")) + parseInt(ground.css("width")) - 80,
                        y: parseInt(ground.css("top"))-48,
                    }
                    break;
                }
            }
            return pos;
        }

        function checkItem() {
            for(var i = 0; i<this.items.find(".item").length; i++) {
                var item = this.items.find(".item").eq(i);
                if(item.objectHitTest({"object": this.tar.find(".area")})) {
                    item.hide();
                }
            }
        }

        
		return Class.extend({
			init : function ( tar, map, items ) {
				this.tar = tar;
                this.map = map;
                this.items = items;

                this.idleAni = null;
                this.walkAni = null;
                this.jumpAni = null;

                this.moveDir = 0;
                this.gravity = 0.5;
                this.velocity = 0;
                this.jumpHeight = -13;
                this.jumFlag = false;
                this.finishTarget = null;
                this.isJump = false;
                this.isDie = false;
                this.isQuiz = false; 
                
                initCharacter.call(this);
			},

            move: function ( dir ) {
                if(this.isDie || this.isQuiz) return;
                this.moveDir = dir;
                if(dir < 0) {
                    gsap.set(this.tar.find(".char"), {scaleX: -1});
                    if(!this.isJump && !this.tar.find(".walk").is(":visible")) 
                        playAni.call(this, 'walk');
                } else if(dir > 0) {
                    gsap.set(this.tar.find(".char"), {scaleX: 1});
                    if(!this.isJump && !this.tar.find(".walk").is(":visible"))
                        playAni.call(this, 'walk');
                } else {
                    if(!this.isJump && !this.tar.find(".idle").is(":visible"))
                        playAni.call(this, 'idle');
                }
            },

            jump: function () {
                if(this.isDie || this.isQuiz) return;
                var owner = this;
                
                if (checkGround.call(this)) {
                    this.velocity += this.jumpHeight;
                    owner.jumFlag = true;
                    this.isJump = true;
                    playAni.call(this, 'jump');
                    setTimeout(function () { owner.jumFlag = false;}, 300);
                }
            },

            update: function () {
                if(this.isDie || this.isQuiz) return;
                var owner = this;
                var collTarget = checkGround.call(this);
                var targetX = parseInt(this.tar[0]._gsap.x) + this.moveDir;
                if(this.moveDir < 0 && targetX < 50) {
                    targetX = 50;
                } else if (this.moveDir > 0 && targetX > 15290) {
                    targetX = 15290;
                }
                if(!checkFront.call(this)) {
                    gsap.set(this.tar, {x: targetX});
                }

                this.velocity += this.gravity;
                this.tar.y += this.velocity;
                gsap.set(this.tar, {y: parseInt(this.tar[0]._gsap.y) + this.velocity})
                if (collTarget && !this.jumFlag) {
                // if(parseInt(this.tar[0]._gsap.y) > 396 && !this.jumFlag) {
                    gsap.set(this.tar, {y: parseInt(collTarget.css("top"))-48});
                    // gsap.set(this.tar, {y: 396});
                    this.velocity = 0;
                    this.isJump = false;
                }

                checkItem.call(this);
                
                if(parseInt(this.tar[0]._gsap.y) > 560) {
                    gsap.set(this.tar, {opacity: this.tar.css("opacity") - 0.1});
                }

                if(parseInt(this.tar[0]._gsap.y) > 800) {
                    this.isDie = true;
                    var repos = checkReposition.call(this);
                    playAni.call(this, "idle");
                    gsap.set(this.tar.find(".char"), {scaleX: 1});
                    gsap.set(owner.tar, {delay:1, x: repos.x, y: repos.y, alpha: 0.7});
                    gsap.to(owner.tar, 0.7, {delay:1, opacity: 1, ease: 'wiggle', onComplete: function () {
                        owner.isDie = false;
                        gsap.to(owner.tar, 0.2, {opacity: 1});
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
            gsap.set(owner.tar, {x: 0, force3D: true});
            
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
            function onUpdate( delta ) {
                owner.character.move(owner.moveDirection);
                owner.character.update();
                gsap.set(owner.tar, {x: 380-parseInt(owner.character.tar[0]._gsap.x)});
                if(parseInt(owner.tar[0]._gsap.x) > 0) {
                    gsap.set(owner.tar, {x: 0});
                } else if(parseInt(owner.tar[0]._gsap.x) < -14060) {
                    gsap.set(owner.tar, {x: -14060});
                }
                owner.timer = window.requestAnimationFrame(onUpdate);
            }

            owner.timer = window.requestAnimationFrame(onUpdate);

		}
		
		return Class.extend({

			init : function ( tar ) {
				this.tar = tar;
                this.character = new Character($("#game .character"), $("#game .map"), $("#game .items"));
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

        var gameManager = new GameManager($("#game .game-con"));
        
    }
    setTimeout(() => window.initGame(), 500);

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

