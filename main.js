var mainScreen = new MainScreen({
	element: document.getElementById('main-screen')
});

var playScreen = new PlayScreen({
	element: document.getElementById('play-screen')
});

var screenMgr = new ScreenManager();
screenMgr.addScreen(mainScreen, 'main');
screenMgr.addScreen(playScreen, 'play');

mainScreen.on('level-chosen', function(data) {
	screenMgr.goToScreen('play', data);
});
playScreen.on('close', function() {
	screenMgr.goToScreen('main');
});

screenMgr.goToScreen('main');