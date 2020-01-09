'use strict'

import browserSync from 'browser-sync'
import gulp from 'gulp'
import htmlmin from 'gulp-htmlmin'
import inject from 'gulp-inject'
import fileInclude from 'gulp-include-inline'
import path from 'path'
import rename from 'gulp-rename'
import sassc from 'gulp-sass'
import svgmin from 'gulp-svgmin'
import svgstore from 'gulp-svgstore'
import terser from 'gulp-terser'
import template from 'gulp-md-template'

const INTERMEDIATE = '.inter'
const DESTINATION = '../'

const compile = (done) => {
    let svgs = gulp
        .src('svg/*.svg')
        .pipe(svgmin((file) => {
            let prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore({inlineSvg: true}))
        .pipe(rename('symbols.svg'))
        .pipe(gulp.dest(INTERMEDIATE))


    let js = gulp
        .src('./javascript/main.js')
        .pipe(terser())
        .pipe(gulp.dest(INTERMEDIATE))


    let sass = gulp
        .src('sass/main.scss')
        .pipe(sassc({outputStyle: 'compressed'}).on('error', sassc.logError))
        .pipe(gulp.dest(INTERMEDIATE))

    //let nzblnktpl = fs.readFileSync('./html/nzblnk.inc', 'utf8')

    gulp.src('./assets/*')
        .pipe(gulp.dest(DESTINATION));

    gulp.src('html/index.html')
        .pipe(template('./partials'))
        .pipe(fileInclude())
        .pipe(inject(svgs, {transform: (p, f) => f.contents.toString(), removeTags: true}))
        .pipe(inject(js, {transform: (p, f) => '<script>' + f.contents.toString() + '</script>', removeTags: true}))
        .pipe(inject(sass, {transform: (p, f) => '<style>' + f.contents.toString() + '</style>', removeTags: true}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(DESTINATION))

    done()
}

exports.default = compile

const runServer = (done) => {
    browserSync({
        single: true,
        server: '../'
    })
    done()
}

const watch = (done) => {
    gulp.watch('./sass/**/*.sass', compile)
    gulp.watch('./svg/*.svg', compile)
    gulp.watch(['./javascript/*.js', './html/*.html', './partials/*'], compile)
    gulp.watch(`./${DESTINATION}/*.html`).on('change', browserSync.reload)
    done()
}

exports.develop = gulp.parallel(runServer, watch)
