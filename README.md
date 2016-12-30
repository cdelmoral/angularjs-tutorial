[ ![Codeship Status for cdelmoral/angularjs-tutorial](https://codeship.com/projects/b34583b0-84ca-0133-c39f-260819c0cb46/status?branch=master)](https://codeship.com/projects/122078)

# Microposts: sample application (server)

This is the sample application (server side) for the
[*Ruby on Rails Tutorial:
Learn Web Development with Rails*](http://www.railstutorial.org/)
by [Michael Hartl](http://www.michaelhartl.com/) done with [AngularJS](https://angularjs.org).

## Instructions

Clone repository and run `npm install`. Make sure to have [mongoDB](https://www.mongodb.org) installed in your computer.

### Development

Create an `.env.json` file with the following structure:

```
{
	"DB_URL": "mongodb://localhost/microposts",
	"SECRET": "notasecuresecret",
    "MAILGUN_DOMAIN": "localhost",
    "MAILGUN_PORT": 1025,
    "HOST": "http://localhost:8000",
    "CLIENT_HOST": "http://localhost:4200"
}
```

### Production

In production you will only need to set up as environment variables `DB_URL` and `SECRET`.
