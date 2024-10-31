
(function () {
    var selectLevel = '';
    var timer = null;
    var introAudio = new AudioControl("../common/audio/intro.mp3", {});
    var transitionAudio = new AudioControl("../common/audio/transition.mp3");
    var transitionAudio2 = new AudioControl("../common/audio/transition2.mp3");
    var talkAudio = new AudioControl("../common/audio/talk.mp3");
    var introSkip = $.getUrlVar('skip');

    window.initGame = function () {
        $("#background").show();
        exportRoot.car.gotoAndStop(1);
        if(!introSkip) {
            exportRoot.intro.play();
            introAudio.play();
            if((window.chasi < 4 && window.path1 !== 'my') ||(window.chasi < 5 && window.path1 === 'my')) {
                gsap.from($("#intro .level-btn"), 0.4, {
                    delay: 1.9,
                    opacity: 0, 
                    y: "+=10", 
                    scaleX: 0.8, 
                    scaleY: 0.8, 
                    ease: Cubic.easeOut,
                    onStart: function () {
                        $("#intro .level-btn").show();
                    }
                });

                $("#intro .level-btn").on(click, function () {
                    $("#intro .level-btn").removeClass("active");
                    $(this).addClass("active");
                    if(!$("#intro .start-btn").is(":visible")) {
                        gsap.from($("#intro .start-btn"), 0.4, {
                            opacity: 0, 
                            onStart: function () {
                                $("#intro .start-btn").show();
                            }
                        });
                    }
                });
            } else {
                gsap.from($("#intro .start-btn"), 0.4, {
                    delay: 1.9,
                    opacity: 0, 
                    onStart: function () {
                        $("#intro .start-btn").show();
                    }
                });
            }


            $("#intro .start-btn").on(click, function () {
                if((window.chasi < 4 && window.path1 !== 'my') ||(window.chasi < 5 && window.path1 === 'my')) {
                    if($("#intro .level-btn.active").length > 0) {
                        switch($("#intro .level-btn.active").index()) {
                            case 0 : selectLevel = 'hard'; break;
                            case 1 : selectLevel = 'normal'; break;
                            case 2 : selectLevel = 'easy'; break;
                        }
                        window.parent.postMessage({
                            message: "SELF_STUDY_SELECT_LEVEL",
                            level: selectLevel,
                        }, "*");
                        showTalk();
                    }
                } else {
                    showTalk();
                }
            });
        } else {
            selectLevel = introSkip;
            showTalk();
        }
    }

    function showTalk () {
        var isTalk = true;
        introAudio.stop();
        transitionAudio.play();

        $("#intro .level-btn").addClass("disable");
        $("#intro .start-btn").addClass("disable");
        exportRoot.cloud.play();
        
        setTimeout(function () {
            $("#intro").css({"z-index": 1, "pointer-events": 'none'});
        }, 30);
        setTimeout(function () {
            exportRoot.intro.gotoAndStop(0);
            $("#intro .level-btns").hide();
            $("#intro .start-btn").hide();
        }, 500);
        setTimeout(function () {
            exportRoot.intro.gotoAndStop(0);
            $("#intro .marker").show();
            $("#intro").css({"z-index": ''});
        }, 1000);

        setTimeout(function () {
            $("#blind-bg").show();
            gsap.to($("#blind-bg"), 0.2, {opacity: 1, ease: Linear.easeIn, onComplete: function () {
                $("#map-btn").show();
                $("#talk-bg").show();
                exportRoot.talk.gotoAndStop(1);
            }});
            gsap.to($("#blind-bg"), 0.5, {delay: 0.2, opacity: 1, ease: Linear.easeOut, onComplete: function () {
                $("#blind-bg").hide();
                exportRoot.talk.play();
                talkAudio.play();
                $("#intro").css({"z-index": 1});
            }});
            exportRoot.car.gotoAndStop(0);
        }, 3500);
        setTimeout(function () {
            transitionAudio2.play();
        }, 2800);

        window.talkEnd = function () {
            isTalk = false;
            timer = setTimeout(startQuiz, 3000);
        }

        $("#map-btn").on(click, function () {
            exportRoot.talk.visible = false;
            exportRoot.talk.stop();
            exportRoot.car.gotoAndStop(1);
            clearTimeout(timer);
            $("#map-btn").hide();
            $("#map-close").show();
            $("#talk-bg").hide();
            $("#intro").css({"z-index": ''});
        });

        $("#map-close").on(click, function () {
            exportRoot.talk.visible = true;
            exportRoot.car.gotoAndStop(0);
            $("#intro").css({"z-index": 1});
            if(isTalk) {
                exportRoot.talk.play();
            } else {
                timer = setTimeout(startQuiz, 3000);
            }
            $("#map-btn").show();
            $("#map-close").hide();
            $("#talk-bg").show();
        });
    }

    function startQuiz () {
        if((window.chasi < 4 && window.path1 !== 'my') ||(window.chasi < 5 && window.path1 === 'my')) {
            location.href = `../${window.path1}_${window.path2}_quiz/quiz_${window.grade}_${window.lesson}_${window.chasi}_${selectLevel}.html`;
        } else {
            location.href = `../${window.path1}_${window.path2}_quiz_${window.chasi}/quiz_${window.grade}_${window.lesson}_${window.chasi}.html`;
        }
    }

    
})();

