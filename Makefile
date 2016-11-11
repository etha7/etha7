all:
	browserify public/js/mainGame.js -o public/js/bundle.js -d
	node app.js
