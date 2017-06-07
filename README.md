# Angular 4 Node.js MEAN Social Website 

Social website created with Angular 4, Angular-cli, MongoDB, Node.js, Express.js, Bootstrap and soon Socket.io.

## Getting Started

email-verification system, backend server with node.js and front end with Angular 4 and Angular 4 Material, login access with JSON webToken, profile ... Development mode uses File system and production mode use Cloudinary. etc...

### Prerequisites

Install Node.js and MongoDb or use a Mongolab account.
Install Nodemon and Angular-cli with npm -g command.
Google Recaptcha and Email Verification is disabled to feel free testing the application. 
To make it working again : 
in signup.component.html, decomment the recaptcha element then, in the element button below change condition in the attribute [disabled] from !addUser.valid && eventCaptcha to !addUser.valid && !eventCaptcha.
For email verification in authentification-controller.js :
in the signup function, delete or comment confirmTempUserModel function. Then, decomment the nev.sendVerificationemail function.

Create Gmail account in order to use nodemailer email verification module. Then go to this page to use the GMAIL API:
 * [Configure your GMAIL API](https://medium.com/@pandeysoni/nodemailer-service-in-node-js-using-smtp-and-xoauth2-7c638a39a37e)
 * [NODEMAILER MAJ EPLANATION](https://nodemailer.com/smtp/oauth2/)
 If you don't want to use GMAIL api fulfill your email and password in your .env file
Then  install all node modules
```
npm install -g nodemon angular-cli
npm install
```

### Installing

## Development mode
```
* Please fulfill the information in the .env file. It contains all variables uses by node.js ( mongodb_uri, gmail, amazon etc...)


npm run dev
```
## Production mode


```
npm run prod
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Do more test

## Deployment

Add additional notes about how to deploy this on a live system

## Contributing

Anyone who wants to make some tests or adding more modules or fonctionality are welcome !

## Authors

* **Pierre-Philippe PREVOST** - *Initial work* - [Angular4 Social Project](http://angular2-web.herokuapp.com)

Don't hesitate to contribute and pull request !

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thanks to David Violante Github Page


