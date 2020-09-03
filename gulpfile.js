const gulp   = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');

gulp.task('build', function() {
    return gulp.src(
        [
            './src/Step.js',
            './src/Webpage.js',
            './src/Avenue.js',
            './src/index.js'
        ]
    )
        .pipe(concat('script.js'))
        .pipe(terser())
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('default', gulp.series('build'));

gulp.task('watch', function() {
    gulp.watch('./src/*.js', gulp.series('build'));
});
