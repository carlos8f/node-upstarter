upstarter
---------

Easily create upstart services for your node daemons

Made for Ubuntu. Sorry, everyone else.

Idea
====

So you made your cool Node.js HTTP server thing, but how do you run it as a proper
service when your system boots?

**upstarter** to the rescue!

Install
=======

```bash
$ npm install -g upstarter
```

Usage
=====

In the root of your project, run:

```bash
$ sudo upstarter
```

**upstarter** will ask you some stuff. When the survey is complete, you'll have
a service conf in `/etc/init`. Then you can:

```bash
$ sudo service my-service start
```

For more info, try the [Upstart cookbook](http://upstart.ubuntu.com/cookbook/).

Happy days!

License
=======

MIT