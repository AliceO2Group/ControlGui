const gulp = require('gulp'),
    uglify = require('gulp-uglify'),
     qunit = require('gulp-qunit'),
     mocha = require('gulp-mocha'),
    eslint = require('gulp-eslint');


var jsSource = ['*.js', 'http/*.js', 'jwt/*.js', 'public/*.js', 'websocket/*.js', 'zeromq/*.js'];

gulp.task('default', ['test-backend', 'test-frontend']);

// Minify JavaScript source coude
gulp.task('uglify', function() {
  gulp.src('*.js')
      .pipe(uglify())
      .pipe(gulp.dest('minjs'));
});

// JavaScirpt syntax check and coding guidline enforced
gulp.task('eslint', function() {
  gulp.src(jsSource)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('test', ['test-frontend', 'test-backend']);

// Test frontend with QUnit
gulp.task('test-frontend', function() {
  gulp.src('./test/qunit-*.html')
      .pipe(qunit());
});

// Test backend with Mocha
gulp.task('test-backend', function() {
  gulp.src('./test/mocha-*.js')
      .pipe(mocha());
});
