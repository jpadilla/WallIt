function DetailView() {
	var self = Ti.UI.createView();

	var lbl = Ti.UI.createLabel({
		text : '',
		height : 'auto',
		width : '90%',
		color : '#000'
	});
	self.add(lbl);

	self.addEventListener('itemSelected', function(e) {
		lbl.text = e.content + '\n\n By: ' + e.post.user.username;
	});

	return self;
};

module.exports = DetailView;
