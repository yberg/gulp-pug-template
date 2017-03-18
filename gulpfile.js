var gulp = require('gulp');
var pug = require('gulp-pug');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var gulpif = require('gulp-if');
var clean = require('gulp-clean');

var env = process.env.NODE_ENV || 'development';
var outputDir = 'builds/development';

function printError(error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('pug', () =>  {
  return gulp.src('src/views/**/[^_]*.pug')
    .pipe(pug())
    .on('error', printError)
    .pipe(gulp.dest(outputDir))
    .pipe(livereload());
});

gulp.task('js', () =>  {
  return gulp.src(['src/js/**/*.js', '!src/js/**/*.min.js'])
    .pipe(browserify({ debug: env === 'development' }))
    .on('error', printError)
    .pipe(gulpif(env === 'production', uglify()))
    .on('error', printError)
    .pipe(gulp.dest(outputDir + '/js'))
    .pipe(livereload());
});

gulp.task('js-min', () =>  {
  return gulp.src('src/js/**/*.min.js')
    .pipe(gulp.dest(outputDir + '/js'))
    .pipe(livereload());
});

gulp.task('sass', () =>  {
  var config = {};
  if (env === 'development') { config.sourceComments = 'map'; }
  if (env === 'production')  { config.outputStyle = 'compressed'; }
  return gulp.src(['src/sass/**/[^_]*.scss', 'src/sass/**/[^_]*.sass'])
    .pipe(sass(config))
    .on('error', printError)
    .pipe(gulp.dest(outputDir + '/css'))
    .pipe(livereload());
});

gulp.task('css', () =>  {
  return gulp.src('src/css/**/*')
    .pipe(gulp.dest(outputDir + '/css'))
    .pipe(livereload());
});

gulp.task('map', () =>  {
  return gulp.src('src/css/**/*.map')
    .pipe(gulp.dest(outputDir + '/css'))
    .pipe(livereload());
});

gulp.task('favicon', () =>  {
  return gulp.src('src/favicon.ico')
    .pipe(gulp.dest(outputDir))
    .pipe(livereload());
});

gulp.task('images', () =>  {
  return gulp.src('src/images/**/*')
    .pipe(gulp.dest(outputDir + '/images'))
    .pipe(livereload());
});

gulp.task('clean', () => {
  return gulp.src('builds/development/*')
    .pipe(clean());
});

gulp.task('watch', () =>  {
  gulp.watch('src/**/*.pug', ['pug']);
  gulp.watch(['src/js/**/*.js', '!src/js/**/*.min.js'], ['js']);
  gulp.watch('src/js/**/*.min.js', ['js-min']);
  gulp.watch(['src/sass/**/*.scss', 'src/sass/**/*.sass'], ['sass']);
  gulp.watch('src/css/**/*', ['css']);
  gulp.watch('src/css/**/*.map', ['map']);
  gulp.watch('src/favicon.ico', ['favicon']);
  gulp.watch('src/images/**/*', ['images']);
});

gulp.task('default', ['pug', 'js', 'js-min', 'sass', 'css', 'map',
    'favicon', 'images', 'watch'], () =>  {
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
  });
});
