const darkModeSwitch = require('./dark-mode-switch');
const algoliaSearch = require('./algolia-search');
const tableOfContents = require('./table-of-contents');
const newsletter = require('./newsletter');
const sidebar = require('./sidebar');
const copyButton = require('./copy-button');

import 'bootstrap';

darkModeSwitch();
algoliaSearch('{{ .Site.Params.algolia_appId }}', '{{ .Site.Params.algolia_apiKey }}', '{{ .Site.Params.algolia_indexName }}');
tableOfContents();
newsletter();
sidebar();
copyButton();

$('[data-toggle="tooltip"]').tooltip();
