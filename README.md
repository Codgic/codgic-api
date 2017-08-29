# codgic-api

[![Build Status](https://travis-ci.org/codgician/codgic-api.svg?branch=master)](https://travis-ci.org/codgician/codgic-api)

API handler of Codgic Online Judge.

**EARLY DEVELOPMENT STAGE.**  
**Literally speaking nothing has been implemented.**

If you have any ideas or suggestions, feel free to create issues at https://github.com/Codgic/codgic-api/issues.

Recent changes will be pushed to [Codgic/codgic-api](https://github.com/codgic/codgic-api) soon after unit tests cover all existing functions. Pull requests will be highly appreciated by then.

# To-do list
- [x] Hello Koa.
- [x] Hello Typescript.
- [x] Hello TypeORM.
- [x] Hello JWT.
- [x] Hello Gulp.
- [ ] **Hello Mocha && write tests.**
- [x] Hello Travis CI.
- [ ] Hello Socket.io?
- [ ] Probably more...

# Known problems (Reminder)
- Password and salt are revealed when retrieving user info.
- PostUser() in users controller won't check whether user has the privilege to change his privilege.
- postProblem() and postUser() in models won't work when it comes to updating existing info.

# Piorities
- Find a way to unit test controllers.
- Find a way to change config when testing.
- Find a better way to refresh jwt.
- Fix known problems.

# ETA?
tan90°.
