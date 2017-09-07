/* /gulpfile.ts */

import {Gulpclass, SequenceTask, Task} from 'gulpclass';

import * as gulp from 'gulp';
import * as mocha from 'gulp-mocha';
import * as rename from 'gulp-rename';
import * as shell from 'gulp-shell';
import tslint from 'gulp-tslint';

import * as del from 'del';

@Gulpclass()
export class Gulpfile {

  // -------------------------
  //  General tasks
  // -------------------------

  // Clean build folder.
  @Task()
  public clean() {
    return del('./build/**') && del('./dist/**');
  }

  // Compile files.
  @Task()
  public compile() {
    return gulp.src('package.json', { read: false })
              .pipe(shell(['npm run compile']));
  }

  // Copy config.yml.
  @Task()
  public copyConfig() {
    return gulp.src('./config.yml')
              .pipe(gulp.dest('./build'));
  }

  // Rename config.template.yml to config.yml.
  @Task()
  public renameConfig() {
    return gulp.src('./config.template.yml')
              .pipe(rename('./config.yml'))
              .pipe(gulp.dest('./'));
  }

  // -------------------------
  //  Run test tasks
  // -------------------------

  // Run tslint.
  @Task()
  public tslint() {
    return gulp.src(['./src/**/*.ts', './test/**/*.ts'])
        .pipe(tslint({
          formatter: 'stylish',
        }))
        .pipe(tslint.report());
  }

  // Do tests.
  @Task()
  public runTests() {
    return gulp.src([
      './build/test/functional/**/*.js',
    ], {read: false})
        .pipe(mocha({
          bail: true,
          timeout: 20000,
        }));
  }

  // -------------------------
  //  Sequence tasks
  // -------------------------

  @SequenceTask()
  public build() {
    return ['clean', 'compile', 'copyConfig'];
  }

  @SequenceTask()
  public test() {
    return ['tslint', 'runTests'];
  }

}
