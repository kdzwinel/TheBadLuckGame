/*

 @codekit-prepend tools/tap.js
 @codekit-prepend tools/DOMHelpers.js
 @codekit-prepend classes/ResourceLoader.class.js
 @codekit-prepend classes/CollisionDetector.class.js
 @codekit-prepend tools/EventListenersManager.class.js

 @codekit-prepend classes/Car.class.js
 @codekit-prepend classes/CarAppearance.class.js
 @codekit-prepend classes/CarManager.class.js
 @codekit-prepend classes/CanvasManager.class.js

 @codekit-prepend classes/Tile.class.js
 @codekit-prepend classes/Board.class.js
 @codekit-prepend classes/Game.class.js
 @codekit-prepend classes/ScoreTracker.class.js
 @codekit-prepend classes/ProgressManager.class.js

 @codekit-prepend classes/MapLoader.class.js
 @codekit-prepend classes/HTMLTile.class.js
 @codekit-prepend classes/HTMLBoard.class.js
 @codekit-prepend classes/HTMLGameStatus.class.js
 @codekit-prepend classes/screens/ScreenManager.class.js
 @codekit-prepend classes/screens/IntroScreen.class.js
 @codekit-prepend classes/screens/LevelsScreen.class.js
 @codekit-prepend classes/screens/pauseScreen.class.js
 @codekit-prepend classes/screens/EndScreen.class.js
 @codekit-prepend classes/screens/PlayScreen.class.js

 */

document.addEventListener("DOMContentLoaded", function () {
	var progressManager = new ProgressManager();

	var introScreen = new IntroScreen({
		element: document.getElementById('intro-screen')
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