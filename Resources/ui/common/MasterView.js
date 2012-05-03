Ti.include("lib/date.js");
// Ti.include("lib/pulltorefresh.js");

//Master View Component Constructor
function MasterView() {

	var PullToRefresh = require('lib/pulltorefresh');
	var Cloud = require('ti.cloud');

	//create object instance, parasitic subclass of Observable
	var self = Ti.UI.createView({
		backgroundColor : 'white'
	});

	Titanium.Geolocation.purpose = "Recieve User Location";
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

	// Set Distance filter. This dictates how often an event fires based on the distance the device moves. This value is in meters.
	Titanium.Geolocation.distanceFilter = 10;

	//set the mapview with the current location
	var mapView = Titanium.Map.createView({
		mapType : Titanium.Map.STANDARD_TYPE,
		region : {
			latitude : 33.74511,
			longitude : -84.38993,
			latitudeDelta : 0.01,
			longitudeDelta : 0.01
		},
		animate : true,
		regionFit : true,
		userLocation : true,
		height : 193,
		top : 0
	});

	self.add(mapView);

	//some dummy data for our table view
	var tableData = [];

	var pullToRefresh = PullToRefresh.createPullToRefresh({
		backgroundColor : "#CCC",
		labelColor : "#000",
		action : function() {
			setTimeout(function() {
				refresh();
			}, 500)
		}
	});

	var tableView = Ti.UI.createTableView({
		data : tableData,
		height : 225,
		top : 193
	});
	self.add(tableView);

	tableView.headerPullView = pullToRefresh;

	tableView.addEventListener("scroll", function(e) {
		PullToRefresh._scroll(e);
	});

	tableView.addEventListener("scrollEnd", function(e) {
		PullToRefresh._begin(e, this);
	});

	var region = {};

	function getLocation() {
		//Get the current position and set it to the mapview
		Titanium.Geolocation.getCurrentPosition(function(e) {
			region = {
				latitude : e.coords.latitude,
				longitude : e.coords.longitude,
				animate : true,
				latitudeDelta : 0.003,
				longitudeDelta : 0.003
			};

			self.fireEvent('setLocation', {
				longitude : region.longitude,
				latitude : region.latitude
			});

			mapView.setLocation(region);

			refresh();

		});
	}


	Titanium.Geolocation.addEventListener('location', function() {
		getLocation();
	});

	getLocation();

	//add behavior
	tableView.addEventListener('click', function(e) {
		self.fireEvent('itemSelected', {
			content : e.rowData.title,
			post : e.rowData.post
		});
	});

	var refresh = function() {
		Cloud.Posts.query({
			page : 1,
			per_page : 20,
			where : {
				coordinates : {
					'$nearSphere' : [region.longitude, region.latitude]
				}
			}
		}, function(e) {
			if(e.success) {
				var data = [];
				var annotations = [];
				for(var i = 0; i < e.posts.length; i++) {
					var post = e.posts[i];
					Ti.API.log(post);
					data.push({
						title : post.content,
						post: post
					});
					var annotationView = Titanium.Map.createAnnotation({
						latitude : post.custom_fields.coordinates[0][1],
						longitude : post.custom_fields.coordinates[0][0],
						title : post.content,
						pincolor : Titanium.Map.ANNOTATION_RED,
						animate : true,
					});
					annotations.push(annotationView);
				}
				tableView.setData(data);
				mapView.setAnnotations(annotations);
			} else {
				alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
			}
		});

		PullToRefresh._end(function() {
			tableView.setContentInsets({
				top : 0
			}, {
				animated : true
			});
		});
	}

	self.addEventListener("showCreatedPost", function(e) {
		refresh();
	});

	return self;
};

module.exports = MasterView;
