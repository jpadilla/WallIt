function SignupView() {
	var Cloud = require('ti.cloud');
	
	var self = Ti.UI.createView();
	
	var usernameTextField = Ti.UI.createTextField({
		hintText: 'Username',
		width: 150,
		top: 50,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	self.add(usernameTextField);
	
	var passwordTextField = Ti.UI.createTextField({
		hintText: 'Password',
		width: 150,
		top: 100,
		passwordMask: true,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	self.add(passwordTextField);
	
	var confirmationTextField = Ti.UI.createTextField({
		hintText: 'Password Confirmation',
		width: 150,
		top: 150,
		passwordMask: true,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	self.add(confirmationTextField);
	
	self.addEventListener('signup', function(e) {
		Cloud.Users.create({
		    username: usernameTextField.value,
		    password: passwordTextField.value,
		    password_confirmation: confirmationTextField.value
		}, function (e) {
		    if (e.success) {
		    	self.fireEvent('success', e);
		    } else {
		        alert('Error:\\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
	});
	
	return self;
};

module.exports = SignupView;
