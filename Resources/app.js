/*
* A master detail view, utilizing a native table view component and platform-specific UI and navigation. 
* A starting point for a navigation-based application with hierarchical data, or a stack of windows. 
* Requires Titanium Mobile SDK 1.8.0+.
* 
* In app.js, we generally take care of a few things:
* - Bootstrap the application with any data we need
* - Check for dependencies like device type, platform version or network connection
* - Require and open our top-level UI component
*  
*/

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');	  	
}

// This is a single context application with mutliple windows in a stack
(function() {
	var Cloud = require('ti.cloud');
	
	Cloud.Users.showMe(function (e) {
	    if (e.success) {
			startApplicationWindow();
	    } else {
			var AuthWindow = Ti.UI.createWindow({
				backgroundColor:'#ffffff'
			});
			
			var AuthView = require('ui/common/AuthView');
			var authView = new AuthView();
			
			authView.addEventListener('login', function(e) {
				var LoginWindow = Ti.UI.createWindow({
					backgroundColor: '#FFFFFF'
				});
				
				var closeButton = Ti.UI.createButton({
					title: 'Close'
				});
				
				closeButton.addEventListener('click', function(e) {
					LoginWindow.close();
				});
				LoginWindow.leftNavButton = closeButton;
				
				var doneButton = Ti.UI.createButton({
					title: 'Done'
				});
				LoginWindow.rightNavButton = doneButton;
				
				var LoginView = require('ui/common/LoginView');
				var loginView = new LoginView();
				LoginWindow.add(loginView);
				
				
				doneButton.addEventListener('click', function(e) {
					loginView.fireEvent('login');
				});
				
				loginView.addEventListener('success', function(e) {
		    		LoginWindow.close();
		    		startApplicationWindow();
				});
				
				LoginWindow.open({
					modal: true
				});
			});
			
			authView.addEventListener('signup', function(e) {
				var SignupWindow = Ti.UI.createWindow({
					backgroundColor: '#FFFFFF'
				});
				
				var closeButton = Ti.UI.createButton({
					title: 'Close'
				});
				
				closeButton.addEventListener('click', function(e) {
					SignupWindow.close();
				});
				SignupWindow.leftNavButton = closeButton;
				
				var doneButton = Ti.UI.createButton({
					title: 'Done'
				});
				SignupWindow.rightNavButton = doneButton;
				
				var SignupView = require('ui/common/SignupView');
				var signupView = new SignupView();
				SignupWindow.add(signupView);

				doneButton.addEventListener('click', function(e) {
					signupView.fireEvent('signup');
				});
				
				signupView.addEventListener('success', function(e) {
		    		SignupWindow.close();
		    		startApplicationWindow();
				});
				
				SignupWindow.open({
					modal: true
				});
			});
			
			AuthWindow.add(authView);
			
			AuthWindow.open();
		
	    }
	});
})();

function startApplicationWindow() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	
	var Window;
	if (isTablet) {
		Window = require('ui/tablet/ApplicationWindow');
	}
	else {
		// iPhone and Mobile Web make use of the platform-specific navigation controller,
		// all other platforms follow a similar UI pattern
		if (osname === 'iphone') {
			Window = require('ui/handheld/ios/ApplicationWindow');
		}
		else if (osname == 'mobileweb') {
			Window = require('ui/handheld/mobileweb/ApplicationWindow');
		}
		else {
			Window = require('ui/handheld/android/ApplicationWindow');
		}
	}
	new Window().open();
}
