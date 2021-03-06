phantom.outputEncoding = "GBK";
var casper = new require('casper').create({
	verbose: true,
//	logLevel: "debug",
	viewportSize: {
		width: 1920,
		height: 1200
	}
});
var utils = require('utils');
var fs = require('fs');
var resourceDirectory = "d:/capture/";

var result = 0;

var bHaveImage = true;

//fs.removeTree(resourceDirectory);

var user = casper.cli.get("user") || "admin";
var password = casper.cli.get("password") || "admin123";

function saveimage(filename) {
	if (bHaveImage) {
		casper.capture(resourceDirectory + filename + '.png');
	}
}

casper.on("http.status.200", function(resource) {
	this.log(resource.url + " is OK", "INFO");
});

casper.on("http.status.301", function(resource) {
	this.log(resource.url + " is permanently redirected", "PARAMETER");
});

casper.on("http.status.302", function(resource) {
	this.log(resource.url + " is temporarily redirected", "PARAMETER");
});

casper.on("http.status.404", function(resource) {
	this.log(resource.url + " is not found", "COMMENT");
});

casper.on("http.status.500", function(resource) {
	this.log(resource.url + " is in error", "ERROR");
});

casper.start('http://10.243.119.113/covidien', function() {
	if (this.exists('#edit-name')) {
		this.sendKeys('#edit-name', user);
	} else {
		saveimage("failed_enter_user");
	}
	if (this.exists('#edit-pass-clear')) {
		this.sendKeys('#edit-pass-clear', password);
	} else {
		saveimage("failed_enter_password");
	}
});

casper.then(function() {
	if (this.exists('#edit-submit')) {
		this.click('#edit-submit');
	} else {
		saveimage("failed_sumbit_login");
	}
});

casper.then(function() {
	if (this.getElementAttribute('.home_service', 'class') == "home_service") {
		result = 1;
	} else {
		saveimage("failed_in_home_page");
	}
});

casper.run(function() {
	this.echo(result);
	this.exit(result);
});