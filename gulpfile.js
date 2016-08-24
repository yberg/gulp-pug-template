var gulp = require('gulp'),
  jade = require('gulp-jade'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  livereload = require('gulp-livereload'),
  nodemon = require('gulp-nodemon'),
  gulpif = require('gulp-if');

var env = process.env.NODE_ENV || 'development';
var outputDir = 'builds/development';

function printError(error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('jade', () =>  {
  return gulp.src('src/views/*.jade')
    .pipe(jade())
    .on('error', printError)
    .pipe(gulp.dest(outputDir))
    .pipe(livereload())
});

gulp.task('js', () =>  {
  return gulp.src(['src/js/**/*.js', '!src/js/**/*.min.js'])
    .pipe(browserify({ debug: env === 'development' }))
    .on('error', printError)
    .pipe(gulpif(env === 'production', uglify()))
    .on('error', printError)
    .pipe(gulp.dest(outputDir + '/js'))
    .pipe(livereload())
});

gulp.task('js-min', () =>  {
  return gulp.src('src/js/**/*.min.js')
    .pipe(gulp.dest(outputDir + '/js'))
    .pipe(livereload())
});

gulp.task('sass', () =>  {
  var config = {};
  if (env === 'development') {
    config.sourceComments = 'map';
  }
  if (env === 'production') {
    config.outputStyle = 'compressed';
  }
  return gulp.src(['src/sass/main.scss', 'src/sass/main.sass'])
    .pipe(sass(config))
    .on('error', printError)
    .pipe(gulp.dest(outputDir + '/css'))
    .pipe(livereload())
});

gulp.task('css-min', () =>  {
  return gulp.src('src/css/**/*.min.css')
    .pipe(gulp.dest(outputDir + '/css'))
    .pipe(livereload())
});

gulp.task('map', () =>  {
  return gulp.src('src/css/**/*.map')
    .pipe(gulp.dest(outputDir + '/css'))
    .pipe(livereload())
});

gulp.task('favicon', () =>  {
  return gulp.src('src/favicon.ico')
    .pipe(gulp.dest(outputDir))
    .pipe(livereload())
});

gulp.task('images', () =>  {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest(outputDir + '/images'))
    .pipe(livereload())
});

gulp.task('watch', () =>  {
  gulp.watch('src/**/*.jade', ['jade']);
  gulp.watch('src/js/**/*.js', ['js', 'js-min']);
  gulp.watch(['src/sass/**/*.scss', 'src/sass/**/*.sass'], ['sass']);
  gulp.watch('src/css/**/*.min.css', ['css-min']);
  gulp.watch('src/css/**/*.map', ['map']);
  gulp.watch('src/favicon.ico' ['favicon']);
  gulp.watch('src/images/**/*', ['images']);
});

gulp.task('default', ['js', 'js-min', 'jade', 'sass', 'css-min', 'map', 'favicon', 'images', 'watch'], () =>  {
  // listen for changes
  livereload.listen();
  // configure nodemon
  nodemon({
    // the script to run the app
    script: 'app.js',
    ext: 'js'
  }).on('restart', () => {
    // when the app has restarted, run livereload.
    gulp.src('app.js')
      .pipe(livereload());
  })
});