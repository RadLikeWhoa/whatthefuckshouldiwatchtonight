var gulp = require('gulp')

var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var merge = require('merge-stream')

var browserify = require('browserify')
var babelify = require('babelify')
var uglify = require('gulp-uglify')

var concat = require('gulp-concat')
var sass = require('gulp-sass')
var csso = require('gulp-csso')
var svgo = require('gulp-svgo')

gulp.task('build', function () {
    return browserify({ entries: 'app/main.js', extensions: ['.js'], debug: true })
        .transform('babelify', { presets: [ 'es2015', 'react', 'stage-0' ] })
        .bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('app/dist/js/'))
})

gulp.task('styles', function () {
    return gulp.src('app/assets/styles/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/dist/css/'))
})

gulp.task('svg', function () {
    return gulp.src('app/assets/svg/*.svg')
        .pipe(svgo())
        .pipe(gulp.dest('app/dist/svg/'))
})

gulp.task('sql', function () {
    return gulp.src([ 'db/schema.sql', 'db/data.sql' ])
        .pipe(concat('insert.sql'))
        .pipe(gulp.dest('db/'))
})

gulp.task('release', function () {
    process.env.NODE_ENV = 'production'

    var styles = gulp.src('app/assets/styles/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(csso())
        .pipe(gulp.dest('app/release/css/'))

    var scripts = browserify({ entries: 'app/main.js', extensions: ['.js'], debug: true })
        .transform('babelify', { presets: [ 'es2015', 'react', 'stage-0' ] })
        .bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('app/release/js/'))

    var fonts = gulp.src('app/assets/fonts/*.{svg, ttf, woff}')
        .pipe(gulp.dest('app/release/fonts/'))

    var svg = gulp.src('app/assets/svg/*.svg')
        .pipe(svgo())
        .pipe(gulp.dest('app/release/svg/'))

    return merge(styles, scripts, fonts, svg)
})

gulp.task('watch', [ 'build', 'styles', 'svg', 'sql' ], function () {
    gulp.watch([ 'app/main.js', 'app/components/**/*.js' ], [ 'build' ])
    gulp.watch('app/assets/styles/**/*.scss', [ 'styles' ])
    gulp.watch('db/**/*.sql', [ 'sql' ])
    gulp.watch('app/assets/svg/*.svg', [ 'svg' ])

    require('opn')('http://localhost:8888')
})

gulp.task('default', [ 'watch' ])
