const gulp   = require('gulp'),
      uglify = require('gulp-uglify'),
      jshint = require('gulp-jshint'),
      qunit  = require('gulp-qunit');


var jsSource = ['http/*.js', 'jwt/*.js', 'public/*.js', 'websocket/*.js', 'zeromq/*.js'];

gulp.task('default', ['jshint']);

// Minify JavaScript source coude
gulp.task('uglify', function() {
  gulp.src('*.js')
      .pipe(uglify())
      .pipe(gulp.dest('minjs'));
});

// JavaScirpt syntax check
gulp.task('jshint', function() {
  return gulp.src(jsSource)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function() {
   return gulp.src('./test/test-lock.html')
              .pipe(qunit());
});
