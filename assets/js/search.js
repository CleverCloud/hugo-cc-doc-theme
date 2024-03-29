import algoliasearch from "algoliasearch";
import autocomplete from "autocomplete.js";

var client = algoliasearch('{{ .Site.Params.algolia_appId }}', '{{ .Site.Params.algolia_apiKey }}');
var index = client.initIndex('{{ .Site.Params.algolia_indexName }}');
var siteBaseURL = '{{ .Site.BaseURL }}'.replace(/\/$/, '');

  function newHitsSource(index, params) {
    return function doSearch(query, cb) {
      index
        .search(query, params)
        .then(function(res) {
          cb(res.hits, res);
        })
        .catch(function(err) {
          console.error(err);
          cb([]);
        });
    };
  }

  var search = autocomplete('#search-by', { hint: true, autoselectOnBlur: true,}, [
    {
      source: newHitsSource(index, { hitsPerPage: 30 }),
      displayKey: 'title',
      templates: {
        suggestion: function(suggestion) {
          var val = suggestion._highlightResult.title.value;
          var output = '<div>' + autocomplete.escapeHighlightedString(val);
          if (suggestion._highlightResult.desc) output = output + '<div class="search-description">' + autocomplete.escapeHighlightedString(suggestion._highlightResult.desc.value) + '</div>';
          return output;
        },
        empty : function(ctx) {
          return '<p>No Results for ' + autocomplete.escapeHighlightedString(ctx.query) + '</div>';
        }
      }
    }
  ]).on('autocomplete:selected', function(event, suggestion, dataset, context) {
    window.location = siteBaseURL + suggestion.href;
  });

let params = (new URL(document.location)).searchParams;
let searchTerm = params.get("search");
if (searchTerm) {
  search.autocomplete.setVal(searchTerm);
  search.autocomplete.open();
  search[0].focus();
}
