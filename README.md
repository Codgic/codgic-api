# codgic-api

[![Build status][travis-image]][travis-url]
[![David][david-image]][david-url]
[![GitHub license][license-image]][license-url]
[![Gitter][gitter-image]][gitter-url]

[david-image]: https://img.shields.io/david/Codgic/codgic-api.svg?style=flat-square
[david-url]: https://david-dm.org/Codgic/codgic-api
[gitter-image]: https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square
[gitter-url]: https://gitter.im/Codgic/codgic-api
[license-image]: https://img.shields.io/badge/license-LGPL-blue.svg?style=flat-square
[license-url]: https://raw.githubusercontent.com/Codgic/codgic-api/master/LICENSE
[travis-image]: https://img.shields.io/travis/Codgic/codgic-api/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/Codgic/codgic-api

API handler of Codgic Online Judge.

**EARLY DEVELOPMENT STAGE.**  
**Literally speaking nothing has been implemented.**

If you have any ideas or suggestions, feel free to create issues at https://github.com/Codgic/codgic-api/issues.

Recent changes will be pushed to [Codgic/codgic-api](https://github.com/Codgic/codgic-api) soon after unit tests cover all existing functions. Pull requests will be highly appreciated by then.

# To-do list
- [x] Hello Koa.
- [x] Hello Typescript.
- [x] Hello TypeORM.
- [x] Hello JWT.
- [x] Hello Gulp.
- [x] Hello Mocha, Chai.
- [x] Hello Travis CI.
- [ ] Hello Socket.io?
- [ ] Probably more...

# Known problems (Reminder)
- Countless bugs in problem controller and model.
- Post user with taken username / email will trigger auto increment with InnoDB (not my fault, but what if some clown keeps sending faulty requests to overflow the primary key?).
- Serval possible Database Injection vulnerabilities.

# Priorities
- Finish writing tests.
- Find a better way to refresh jwt.
- Fix known problems.

# ETA?
tan90°.
