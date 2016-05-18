var gulp = require('gulp')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var concat = require('gulp-concat')

gulp.task('build', function () {
    return browserify({ entries: 'app/main.js', extensions: ['.js'], debug: true })
        .transform('babelify', { presets: [ 'es2015', 'react', 'stage-0' ] })
        .bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist/'))
})

gulp.task('sql', function () {
    return gulp.src([ 'db/schema.sql', 'db/data.sql' ])
        .pipe(concat('insert.sql'))
        .pipe(gulp.dest('db/'))
})

gulp.task('watch', [ 'build', 'sql' ], function () {
    gulp.watch('app/**/*.js', [ 'build' ])
    gulp.watch('db/**/*.sql', [ 'sql' ])
})

gulp.task('default', [ 'watch' ])
