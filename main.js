var resource = new Resource();
	resource.add(['sedan', 'van', 'truck']);
	resource.on('load', function() {
		console.log(resource.getPercentage());
		console.log('image loaded');
	});
	resource.load();

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