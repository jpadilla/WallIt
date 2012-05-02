//Master View Component Constructor
function MasterView() {
	//create object instance, parasitic subclass of Observable
	var self = Ti.UI.createView({
		backgroundColor:'white'
	});
	
	Titanium.Geolocation.purpose = "Recieve User Location";
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	 
	// Set Distance filter. This dictates how often an event fires based on the distance the device moves. This value is in meters.
	Titanium.Geolocation.distanceFilter = 10;
	//set the mapview with the current location
	var mapView = Titanium.Map.createView({
	    mapType: Titanium.Map.STANDARD_TYPE,
	    region: {latitude:33.74511, longitude:-84.38993, 
	            latitudeDelta:0.01, longitudeDelta:0.01},
	    animate:true,
	    regionFit:true,
	    userLocation:true,
	    height: 193,
	    top: 0
	});
	
	self.add(mapView);
	 
	function getLocation() {
		//Get the current position and set it to the mapview
		Titanium.Geolocation.getCurrentPosition(function(e){
	        var region = {
	            latitude: e.coords.latitude,
	            longitude: e.coords.longitude,
	            animate:true,
	            latitudeDelta:0.003,
	            longitudeDelta:0.003
	        };
	        
	        mapView.setLocation(region);
		});
	}
	
	Titanium.Geolocation.addEventListener('location',function(){
	    getLocation();
	});
	
	getLocation();

	//some dummy data for our table view
	var tableData = [
		{title:'Apples', price:'1.25', hasChild:true, color: '#000'},
		{title:'Grapes', price:'1.50', hasChild:true, color: '#000'},
		{title:'Oranges', price:'2.50', hasChild:true, color: '#000'},
		{title:'Bananas', price:'1.50', hasChild:true, color: '#000'},
		{title:'Pears', price:'1.40', hasChild:true, color: '#000'},
		{title:'Kiwis', price:'1.00', hasChild:true, color: '#000'}
	];

	var table = Ti.UI.createTableView({
		data:tableData,
		height: 225,
		top: 193
	});
	self.add(table);
	
	//add behavior
	table.addEventListener('click', function(e) {
		self.fireEvent('itemSelected', {
			name:e.rowData.title,
			price:e.rowData.price
		});
	});
	
	return self;
};

module.exports = MasterView;