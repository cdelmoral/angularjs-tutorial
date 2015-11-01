# AngularJS Tutorial: sample application (server)

This is the sample application (server side) for the
[*Ruby on Rails Tutorial:
Learn Web Development with Rails*](http://www.railstutorial.org/)
by [Michael Hartl](http://www.michaelhartl.com/) done with [AngularJS](https://angularjs.org).

## Instructions

Clone repository and run `npm install`. Make sure to have [mongoDB](https://www.mongodb.org) installed in your computer.

### Development

Note that in development you will also need to clone the [angularjs-tutorial-ui](https://github.com/cdelmoral/angularjs-tutorial-ui) project. Then you need to create an `.env.json` file with the following structure:
```
{
	"DB_URL": "mongodb://path/to/database",
	"UI_PROJECT_PATH": "/path/to/angularjs-tutorial-ui/project",
	"SECRET": "notasecuresecret"
}
```

### Production

In production you will only need to set up as environment variables `DB_URL` and `SECRET`.
