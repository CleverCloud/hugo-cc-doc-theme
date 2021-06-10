DIST_FOLDER := dist

all: install build

install:
	npm install

build: sprite

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
	./node_modules/.bin/svg-sprite -s --symbol-dest static --symbol-sprite images/icons.svg dist/icons/*.svg