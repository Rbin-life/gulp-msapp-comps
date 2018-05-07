var path = require("path")
var through = require("through2")
var PluginError = require('plugin-error')
var _ = require("lodash")
var vinylFile = require('vinyl-file')
var Vinyl = require('vinyl')
var parseComps = require("./comps")

var defaultConfig = {
    src: path.resolve(process.cwd(), "./components"),
    dist: path.resolve(process.cwd(), "./dist/components"),
    output: "/",
    resolve: {}
}

module.exports = function(options) {
    if( !options ) {
        options = {}
    }

    return through.obj(function(file, enc, cb) {
        if( file.isNull() ) {
            cb(null, file)
            return
        }
        if( file.isStream() ) {
            cb(new PluginError('gulp-msapp-comps', 'Streaming not supported'))
            return
        }
        if( path.extname(file.path) !== '.json' ) {
            cb(null, file)
            return
        }
        var config = _.extend({}, defaultConfig, options)
        var pth = file.path
        var json = {}
        try {
            json = JSON.parse(file.contents)
            json = parseComps(pth, json, config)
            json = JSON.stringify(json, null, 4)
        }catch(e) {
            cb(e, file)
            return 
        }
        file.contents = new Buffer(json)
        cb(null, file)
    })
}