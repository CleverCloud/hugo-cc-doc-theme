# Clever Cloud Documentation Hugo Theme

## Installation

Run `make` to make sure that every vendor dependencies and are installed, and that all SVG icons are bundles into a single sprite.

## How to add an Icon to the theme

This theme uses SVGs for icons instead of Fonts. Take a look at `Makefile` which copy necessary svgs from the fontawesome dependency. It will generate an SVG sprite under `static/images/icons.svg`.

## How to add a Vendor JS or CSS dependency

In order to manage vendors dependencies, we use a package.json file to track dependency version. Than the Makefile copy them at the right place.

## How to rebrand the theme

You can change all colors in the theme by choosing custom scss variable under `/assets/clever/custom.scss`. You can also replace Logos and sign up links in Hugo parameters:

```toml
[params]
	footerLogo = "images/footer-logo.svg"
	headerLogo = "images/header-logo.svg"
	menuLogo = "images/menu-logo.svg"
	signUpURL = "https://api.clever-cloud.com/v2/sessions/signup" # Configure SignUp link
	editURL = "https://gitlab.corp.clever-cloud.com/clever-cloud/wip-new-doc/edit/master/" # Configure content edition link
```

## Troubleshoot

### My CSS is not bundled

This theme uses PostCSS with configuration located in `assets/css/postcss.config.js`. The PurgeCSS plugin is used to remove unused CSS. You may want to add it to the whitelist, especially if it's dynamically added through JavaScript.

## Licensing

- Licensed under MIT (https://github.com/vantagedesign/ace-documentation/blob/master/LICENSE.md)


