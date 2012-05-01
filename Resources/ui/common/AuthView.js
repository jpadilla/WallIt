function AuthView() {
	var self = Ti.UI.createView();
	
	var loginButton = Ti.UI.createButton({
		title: 'Log In',
		width: 75,
		height: 40,
		top: 100
	});
	self.add(loginButton);
	
	loginButton.addEventListener('click', function(e) {
		self.fireEvent('login');
	});
	
	var signupButton = Ti.UI.createButton({
		title: 'Sign Up',
		width: 75,
		height: 40,
		top: 150
	});
	self.add(signupButton);

	return self;
};

module.exports = AuthView;
