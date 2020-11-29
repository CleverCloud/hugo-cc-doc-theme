ASSETS_DIR := assets/js/vendor/
build:
	npm install
	mkdir -p $(ASSETS_DIR)
	# copy all javascript third party dependencies
	cp node_modules/jquery/dist/jquery.min.js $(ASSETS_DIR)
	cp node_modules/popper.js/dist/umd/popper.min.js $(ASSETS_DIR)
	cp node_modules/bootstrap/dist/js/bootstrap.min.js $(ASSETS_DIR)
	cp node_modules/algoliasearch/dist/algoliasearch.umd.js $(ASSETS_DIR)
	cp node_modules/autocomplete.js/dist/autocomplete.min.js $(ASSETS_DIR)
	cp node_modules/clipboard/dist/clipboard.min.js $(ASSETS_DIR)
	# must contains all the icons used in SVG format
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/arrow-left.svg fonticons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/heart.svg fonticons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/chevron-left.svg fonticons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/chevron-right.svg fonticons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/brands/github.svg fonticons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/arrow-right.svg fonticons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/bars.svg fonticons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/question-circle.svg fonticons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/clone.svg fonticons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/link.svg fonticons/
	# Bundle the icons in one sprite
	./node_modules/.bin/svg-sprite -s --symbol-dest static --symbol-sprite icons.svg fonticons/*.svg