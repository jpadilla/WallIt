function PostView() {

	var Cloud = require('ti.cloud');
	
	var self = Ti.UI.createView({
		backgroundColor : 'white'
	});

	var postTextArea = Titanium.UI.createTextArea({
		value : '',
		color : '#444',
		paddingLeft : 5,
		paddingRight : 5,
		top : 0,
		height : 180,
		width : 320,
		editable : true,
		suppressReturn : false,
		font : {
			fontSize : 14
		}
	});

	var counterLabel = Ti.UI.createLabel({
		text : '0/140',
		top : 180,
		left : 10,
		width : 100,
		height : 'auto',
		color : '#999',
		font : {
			fontSize : 12,
			fontWeight : 'bold'
		}
	});

	postTextArea.addEventListener('change', function(e) {

		// Set character limit
		counterLabel.text = e.value.length + '/140';

		if(e.value.length == 0 || e.value.length > 140) {
			self.fireEvent('postButton_enabled', {bool: false});
		} else {
			self.fireEvent('postButton_enabled', {bool: true});
		}
	});

	self.add(postTextArea);

	self.addEventListener("focus_textarea", function(e) {
		postTextArea.focus();
	});

	self.add(counterLabel);


	self.addEventListener('create_post', function(obj) {
		Cloud.Posts.create({
		    content: postTextArea.value,
		    custom_fields: {
		    	coordinates: [obj.longitude, obj.latitude]
		    }
		}, function (e) {
		    if (e.success) {
		        var post = e.posts[0];
		        postTextArea.value = '';
		        counterLabel.text = '0/140';
		        self.fireEvent('showCreatedPost', {post: post});
		    } else {
		        alert('Error:\\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
	});

	return self;
};

module.exports = PostView;
