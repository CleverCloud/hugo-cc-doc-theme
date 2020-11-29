
module.exports = {    
    plugins: [
      require('postcss-purgecss')({
        variables: true,
        rejected: true,
        content: [
            './**/*.html', 
            './**/*.js',
            './content/**/*.md'
          ],
        css : ["/**/*.css"],
        whitelist: ["TableOfContents", 'arrow', 'tooltip-inner',  'tooltip', 'bs-tooltip-top'],
        whitelistPatternsChildren : [ /^pre/, /algolia-autocomplete/,/anchor/,/alert/,/sidebarCollapse/,],
      })
    ]
  }
