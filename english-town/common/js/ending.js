
(function () {
    var grade = $.getUrlVar('grade');
    var level = $.getUrlVar('level');
    var lesson = $.getUrlVar('lesson');
    var chasi = $.getUrlVar('chasi');
    var endingAudio = new AudioControl("../common/audio/ending.mp3");

    window.initGame = function () {
        exportRoot.ending.play();
        endingAudio.play();
        // setTimeout(function () {
        //     $("#ending .restart-btn").show();
        // }, 4500);
				setTimeout(function () {
					$("#ending .restart-btn").show();
			}, 5500);
        $("#ending .restart-btn").on(click, function () {
            location.href = `../${window.path1}_${window.path2}_quiz/quiz_${grade}_${lesson}_${chasi}_${level}.html`;
        });
    }
    
})();

