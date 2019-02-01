const gulp         = require('gulp'),
      browserSync  = require('browser-sync').create(),
      sass         = require('gulp-sass'),
      ignore       = require('gulp-ignore'),
      spritesmith  = require('gulp.spritesmith'),
      rename       = require('gulp-rename'),
      babel        = require('gulp-babel'),
      uglify       = require('gulp-uglify'),
      concat       = require('gulp-concat'),
      autoprefixer = require('gulp-autoprefixer'),
      sourcemaps   = require('gulp-sourcemaps');


/* -------- Server ---------*/
gulp.task('server', function(){
  browserSync.init({
    server : {
      port : 9000,
      baseDir : 'public',
    },
  });
  gulp.watch('public').on('change', browserSync.reload);
});

/* -------- Styles Compile ---------*/
gulp.task('styles:compile', function(){
  return gulp.src('source/styles/main.scss')
  .pipe(sass({outputStyle : 'compressed'}).on('error', sass.logError))
  .pipe(autoprefixer({
    browsers : ['last 15 versions'],
    cascade : false,
  }))
  .pipe(rename('main.min.css'))
  .pipe(gulp.dest('public/css'));
});

/* -------- JS ---------*/
gulp.task('js', function(){
  return gulp.src([
    './source/js/main.js',
  ])
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets:['@babel/env']
  }))
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('public/js'));
});

/* -------- Sprite ---------*/
gulp.task('sprite', function(cb){
  const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName : 'sprite.png',
    imgPath : '../images/sprite.png',
    cssName : 'sprite.sass',
  }));
  spriteData.img.pipe(gulp.dest('pablic/images/'));
  spriteData.css.pipe(gulp.dest('source/styles/global/'));
  cb();
});

// /* -------- Delete ---------*/
// gulp.task('clean', function (){
//   return gulp.src('public')
//     .pipe(ignore('**/*.html'))
//     .pipe(rimraf('public'));
//   // return rimraf('public', cb);
// });

/* -------- Copy fonts ---------*/
gulp.task('copy:fonts', function(){
  return gulp.src('./source/fonts/**/*.*')
  .pipe(gulp.dest('public/fonts'));
});

/* -------- Copy images ---------*/
gulp.task('copy:images', function(){
  return gulp.src('./source/images/**/*.*')
  .pipe(gulp.dest('public/images'));
});

/* -------- Copy  ---------*/
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/* -------- Watchers  ---------*/
gulp.task('watch', function(){
  gulp.watch('./source/styles/**/*.scss', gulp.series('styles:compile'));
  gulp.watch('./source/js/**/*.js', gulp.series('js'));
});

/* -------- Watchers  ---------*/
gulp.task('default', gulp.series(
  // 'clean',
  gulp.parallel('styles:compile', 'js', 'sprite', 'copy'),
  gulp.parallel('watch', 'server'),
));


