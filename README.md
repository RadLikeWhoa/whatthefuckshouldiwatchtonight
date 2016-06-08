# What The Fuck Should I Watch Tonight?!

whatthefuckshouldiwatchtonight?! is an app that lets you quickly decide, based on your mood, exactly which movie is right for you just now. Simply pick an emotion and scroll through the list of matching movies. Seen a movie? Add your reaction to it and help others decide what they should watch.

## Developing

The app is built on React while the API is built on Slim.

You'll need:

* An Apache server with the document root pointing to `app/`
* A MySQL server

In order to set up the application for the first time you'll need to:

* Run `gulp` to build the files
* Run `composer install` to prepare the API code
* Enter your database information in `app/api/config.php`, based on the example in `config.sample.php`
* Insert the information from `db/insert.sql` into your MySQL database

The default `gulp` task builds the files and watches for changes.

## Deployment

* Run `gulp release` to build the files using the release configuration, i.e. with minification and production builds enabled
* Copy the `app/` folder to your server
* Replace the `dist/` folder on your server with the `release/` folder

## Information

This project was originally created for the Web Engineering module (webeC) at the University of Applied Sciences (UAS) in Switzerland.
