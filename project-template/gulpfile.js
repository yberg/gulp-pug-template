var gulp = require('gulp'),
  jade = require('gulp-jade'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),

  browserSync = require('browser-sync'),
  gulpif = require('gulp-if');

var env = process.env.NODE_ENV || 'development';
var outputDir = 'builds/development';

function printError(error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('jade', function() {
  return gulp.src('src/templates/index.jade') // edit if multiple pages
    .pipe(jade())
    .on('error', printError)
    .pipe(gulp.dest(outputDir))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
  return gulp.src(['src/js/**/*.js', '!src/js/**/*.min.js'])
    .pipe(browserify({ debug: env === 'development' }))
    .on('error', printError)
    .pipe(gulpif(env === 'production', uglify()))
    .on('error', printError)
    .pipe(gulp.dest(outputDir + '/js'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js-min', function() {
  return gulp.src('src/js/**/*.min.js')
    .pipe(gulp.dest(outputDir + '/js'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('sass', function() {
  var config = {};
  if (env === 'development') {
    config.sourceComments = 'map';
  }
  if (env === 'production') {
    config.outputStyle = 'compressed';
  }
  return gulp.src('src/sass/main.scss')
    .pipe(sass(config))
    .on('error', printError)
    .pipe(gulp.dest(outputDir + '/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest(outputDir + '/images'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', function() {
  gulp.watch('src/templates/**/*.jade', ['jade']);
  gulp.watch('src/js/**/*.js', ['js', 'js-min']);
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/images/**/*', ['images']);
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
        baseDir: outputDir
    },
    port: 3000
  });
});

gulp.task('default', ['js', 'js-min', 'jade', 'sass', 'images', 'watch', 'browser-sync']);