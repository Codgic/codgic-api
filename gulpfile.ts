
import {Gulpclass, MergedTask, SequenceTask, Task} from 'gulpclass';

import * as gulp from 'gulp';
import * as shell from 'gulp-shell';
import * as ts from 'gulp-typescript';

import * as del from 'del';
import * as fs from 'fs';
import * as path from 'path';

@Gulpclass()
export class Gulpfile {

  // Clean build folder.
  @Task()
  public clean() {
    return del('./dist/*');
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
    return gulp.src(['./config.yml'])
              .pipe(gulp.dest('./dist'));
  }

  @SequenceTask()
  public build() {
    return ['clean', 'compile', 'copyConfig'];
  }

}
