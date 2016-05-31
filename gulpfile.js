var gulp = require('gulp')

var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')

var concat = require('gulp-concat')
var sass = require('gulp-sass')

gulp.task('build', function () {
    return browserify({ entries: 'app/main.js', extensions: ['.js'], debug: true })
        .transform('babelify', { presets: [ 'es2015', 'react', 'stage-0' ] })
        .bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('app/dist/'))
})

gulp.task('styles', function () {
    return gulp.src('app/assets/styles/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/dist/css/'))
})

gulp.task('sql', function () {
    return gulp.src([ 'db/schema.sql', 'db/data.sql' ])
        .pipe(concat('insert.sql'))
        .pipe(gulp.dest('db/'))
})

gulp.task('watch', [ 'build', 'styles', 'sql' ], function () {
    gulp.watch([ 'app/main.js', 'app/components/**/*.js' ], [ 'build' ])
    gulp.watch('app/assets/styles/**/*.scss', [ 'styles' ])
    gulp.watch('db/**/*.sql', [ 'sql' ])

    require('opn')('http://localhost:8888')
})

gulp.task('default', [ 'watch' ])
