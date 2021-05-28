DIST_FOLDER := dist

install:
    npm install

build: vendor sprite

vendor:
    smkdir -p $(DIST_FOLDER)/vendor
	cp node_modules/jquery/dist/jquery.min.js $(DIST_FOLDER)/vendor/
	cp node_modules/popper.js/dist/umd/popper.min.js $(DIST_FOLDER)/vendor/
	cp node_modules/bootstrap/dist/js/bootstrap.min.js $(DIST_FOLDER)/vendor/
	cp node_modules/algoliasearch/dist/algoliasearch.umd.js $(DIST_FOLDER)/vendor/
	cp node_modules/autocomplete.js/dist/autocomplete.min.js $(DIST_FOLDER)/vendor/
	cp node_modules/clipboard/dist/clipboard.min.js $(DIST_FOLDER)/vendor

sprite:
    mkdir -p $(DIST_FOLDER)/icons
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/arrow-left.svg dist/icons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/heart.svg dist/icons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/chevron-left.svg dist/icons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/chevron-right.svg dist/icons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/brands/github.svg dist/icons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/arrow-right.svg dist/icons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/bars.svg dist/icons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/question-circle.svg dist/icons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/clone.svg dist/icons/
	cp node_modules/@fortawesome/fontawesome-free/svgs/solid/link.svg dist/icons/
	./node_modules/.bin/svg-sprite -s --symbol-dest static --symbol-sprite dist/icons.svg dist/icons/*.svg