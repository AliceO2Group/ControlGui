const gulp = require('gulp');
const uglify = require('gulp-uglify');
const qunit = require('gulp-qunit');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
const fs = require('fs');
const jsdoc2md = require('jsdoc-to-markdown');

const jsSource = [
  './*.js', 'http/*.js', 'jwt/*.js', 'public/*.js', 'websocket/*.js', 'zeromq/*.js', 'test/*.js'
];

// Default task
gulp.task('default', ['test', 'eslint']);

// Default task for Travis CI
gulp.task('travis', ['test', 'eslintfail']);

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

gulp.task('eslintfail', function() {
  gulp.src(jsSource)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

// Run front-end and back-end tests
gulp.task('test', ['qunit', 'mocha']);

// Test frontend with QUnit
gulp.task('qunit', function() {
  gulp.src('./test/qunit-*.html')
    .pipe(qunit());
});

// Test backend with Mocha
gulp.task('mocha', function() {
  gulp.src('./test/mocha-*.js')
    .pipe(mocha());
});

// Generate JSDoc in Markdown format
gulp.task('doc', function() {
  const output = jsdoc2md.renderSync({files: jsSource});
  fs.writeFileSync('docs/API.md', output);
});
