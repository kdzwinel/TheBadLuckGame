document.addEventListener("DOMContentLoaded", function () {
	window.resource = new ResourceLoader();
	resource.add(['sedan',
				  'van',
				  'particle_smoke',
				  'particle_flare',
				  'particle_flare_1',
				  'level-label',
				  'level-label-inactive',
				  'star-active',
				  'star-inactive',
				  'tiles/junction',
				  'tiles/straight',
				  'tiles/t-road',
				  'tiles/tile',
				  'tiles/turn',
				  'tiles/two-turns']);
	resource.load();

	var progressManager = new ProgressManager();

	var introScreen = new IntroScreen({
		element: document.getElementById('intro-screen'),
		loader: resource
	});

	var levelsScreen = new LevelsScreen({
		element: document.getElementById('levels-screen'),
		progressManager: progressManager
	});

	var playScreen = new PlayScreen({
		element: document.getElementById('play-screen')
	});

	var screenMgr = new ScreenManager();
	screenMgr.addScreen(introScreen, 'intro');
	screenMgr.addScreen(levelsScreen, 'levels');
	screenMgr.addScreen(playScreen, 'play');

	introScreen.on('start', function () {
		screenMgr.goToScreen('levels');
	});
	levelsScreen.on('level-chosen', function (data) {
		screenMgr.goToScreen('play', data);
	});
	playScreen.on('close', function () {
		screenMgr.goToScreen('levels');
	});
	playScreen.on('won', function(data) {
		progressManager.update(data);
	});

	screenMgr.goToScreen('intro');

}, false);