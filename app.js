var express   = require('express')
  , routes    = require('./routes/index')
  , docs      = require('./routes/docs')
  , articles  = require('./routes/articles')
  , changelog = require('./routes/changelog')
  , blog      = require('./routes/blog')
  , github    = require('./routes/github')
  , http      = require('http')
  , path      = require('path')
  , app       = express()

// helpers
app.locals({
  fromGithub: function (owner, repo, file) {
    var id  = "partial" + ~~(Math.random() * 1000000);
    var url = "/github?owner="+owner+"&repo="+repo+"&file="+file;

    return [
      "<pre class='dark-blue'><code class='javascript' id='" + id + "'></code></pre>",
      "<script>$(function () { fromGithub('" + id + "', '" + url + "') })</script>"
    ].join("\n")
  }
});

// all environments
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.logger('dev'))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.methodOverride())
app.use(app.router)
app.use(require('stylus').middleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler())
}

app.get('/', routes.index)
app.get('/search', routes.search)
app.get('/imprint', routes.imprint)
app.get('/docs', docs.index)
app.get('/docs/:version', docs.index)
app.get('/docs/:version/:section', docs.index)
app.get('/docs/:version/:section/:subsection', docs.index)
app.get('/heroku', function(req, res) { res.redirect('/articles/heroku', 301) })
app.get('/articles', articles.index)
app.get('/articles/:title', articles.show)
app.get('/changelog', changelog.index)
app.get('/changelog/:version', changelog.show)
app.get('/blog', blog.index)
app.get('/blog/:permalink', blog.show)
app.get('/github', github.show)

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'))
});
