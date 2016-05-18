var gulp = require('gulp')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')

gulp.task('build', function () {
    return browserify({ entries: 'app/main.js', extensions: ['.js'], debug: true })
        .transform('babelify', { presets: [ 'es2015', 'react', 'stage-0' ] })
        .bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist/'))
});

gulp.task('watch', [ 'build' ], function () {
    gulp.watch('app/**/*.js', [ 'build' ])
})

gulp.task('default', [ 'watch' ])
