function ApplicationWindow() {
	//declare module dependencies
	var MasterView = require('ui/common/MasterView'),
		DetailView = require('ui/common/DetailView'),
		PostView = require('ui/common/PostView');
		
	//create object instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#ffffff'
	});
		
	//construct UI
	var masterView = new MasterView(),
		detailView = new DetailView();
		
	var latitude, longitude;
		
	//create master view container
	var masterContainerWindow = Ti.UI.createWindow({
		title:'WallIt'
	});
	masterContainerWindow.add(masterView);
	
	var postButton = Ti.UI.createButton({
		title: 'Post'
	});
	
	postButton.addEventListener('click', function(e) {
		
		var postView = new PostView();

		var PostWindow = Ti.UI.createWindow({
			title: 'Create a Post'
		});
		
		var closeButton = Ti.UI.createButton({
			title: 'Close'
		});
		
		var createButton = Ti.UI.createButton({
			title: 'Post',
			enabled: false
		});
		
		PostWindow.add(postView);
		
		closeButton.addEventListener('click', function(e) {
			PostWindow.close();
		});
		PostWindow.leftNavButton = closeButton;

		createButton.addEventListener('click', function(e) {
			postView.fireEvent('create_post', {longitude: longitude, latitude: latitude});
		});
		
		PostWindow.rightNavButton = createButton;
		
		PostWindow.addEventListener('open', function(e) {
			postView.fireEvent('focus_textarea');
		});
		
		postView.addEventListener('postButton_enabled', function(e) {
			createButton.enabled = e.bool;
		});
		
		postView.addEventListener('showCreatedPost', function(e) {
			PostWindow.close();
			masterView.fireEvent('showCreatedPost', e);
		});
		
		PostWindow.addEventListener('close', function(e) {
			PostWindow.remove(postView);
			postView = null;
		});
		
		PostWindow.open({modal: true});
	});
	
	masterContainerWindow.rightNavButton = postButton;
	
	//create detail view container
	var detailContainerWindow = Ti.UI.createWindow({
		title:'Product Details'
	});
	detailContainerWindow.add(detailView);
	
	//create iOS specific NavGroup UI
	var navGroup = Ti.UI.iPhone.createNavigationGroup({
		window:masterContainerWindow
	});
	self.add(navGroup);
	
	//add behavior for master view
	masterView.addEventListener('itemSelected', function(e) {
		detailView.fireEvent('itemSelected',e);
		navGroup.open(detailContainerWindow);
	});
	
	masterView.addEventListener('setLocation', function(e) {
		longitude = e.longitude;
		latitude = e.latitude;
	});
	
	return self;
};

module.exports = ApplicationWindow;
