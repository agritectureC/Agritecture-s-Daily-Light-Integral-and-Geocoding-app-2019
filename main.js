var locationForm = document.getElementById('location-form');
var selectValue;
var transmit;
var day, inverseDist, solarDecl,latRad, sunAngle, dli, R_a,lat,lng;



//Constants
const k1 = (24 * 60)/Math.PI;
const solarConstant = 0.082;

//Step 1.Calculate and set day of the year (1-366)
//For example, if today is January 1st, day of the year is 1
function setDay(){
	var now = new Date();
	var start = new Date(now.getFullYear(), 0, 0);
	var difference = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
	day = Math.floor(difference / (1000 * 60 * 60 * 24));
}

// Step 2. Calculate and set the inverse distance

function setDistance(){
	//first need to set day of the year
	setDay();

	//set inverse distance
	inverseDist = 1 + 0.033 * Math.cos(((2 * Math.PI) / 365 )* day);

}

//Step 3. Calculate and set the solar declination

function setSolarDec(){

	//first need to set day of the year
	setDay();

	//set solar declination
	solarDecl = 0.409 * Math.sin((2 * Math.PI / 365) * day - 1.39);
}

//Step 4. Calculate the latitude in Radians

function setLatRad(){

	//set latitude in Radians
	latRad = (Math.PI/180) * lat;

}

//Step 5. Calculate the sunset hour angle

function setSunAngle(){

	//first need to set latitude in Radians and solar declination
	setLatRad();
	setSolarDec();

	//set the sunset hour angle
	sunAngle = Math.acos(-Math.tan(latRad) * Math.tan(solarDecl));
}

//Step 6. Calculate R_a, extraterrestrial irradiance

function setR_a(){

	//first need to compute all the variables used in calculation
	setDistance();
	setSunAngle();
	setLatRad();
	setSolarDec();

	//set R_a value
	R_a = ( (k1 * solarConstant) * inverseDist) * 
	(sunAngle * Math.sin(latRad) * Math.sin(solarDecl)
	+ Math.cos(latRad) * Math.cos(solarDecl) * Math.sin(sunAngle));
	}

//Final Step 7. Calculate the DLI, daily light integral
//the function accepts transmittance value as input

function findDli(t){

	//first set R_a value
	setR_a();

	//set dli value
	dli =  R_a * t * 2.04;

	return dli;
}


// Listen for submit button
locationForm.addEventListener('submit', geocode);

//function that extracts latitude and longitude values from Google geocoding API

function geocode(a){

a.preventDefault();

var location = document.getElementById('location-input').value;

axios.get('https://maps.googleapis.com/maps/api/geocode/json',{

params:{

address:location,

//SET THE API KEY

key:' '
        }
      })
      .then(function(response){
      
        // output the full geocoding output to the console
        console.log(response);

        // Geometry
        lat = response.data.results[0].geometry.location.lat;
        lng = response.data.results[0].geometry.location.lng;
        
    
        dli = findDli(transmit);
        result = "Daily light integral: " + dli;
        console.log("latitude is" + lat );
        console.log("day number is" + day );
        console.log("inverse distance number is" + inverseDist );
        console.log("solar declination is" + solarDecl );
        console.log("latitude in Radians is" + latRad );
        console.log("sun Angle is" + sunAngle );
        console.log("R_a is" + R_a );
        console.log("transmittance is" + transmit);
        console.log("dli is" + dli);
        
        
       
        
        
        // Output to app
        
        document.getElementById('dli').innerHTML = result;
        document.getElementById('latitude').innerHTML = "Your location latitude: " + lat;
        document.getElementById('longitude').innerHTML ="Your location longitude: " + lng;
      })
      .catch(function(error){
        console.log(error);
      });

    }
    
    function handleClick() {

var selectValue=document.getElementById("opList").value;

if (selectValue == "PPG1"){
transmit = 0.75;
} else if(selectValue == "PPG1") {
	transmit = 0.861;
} else if(selectValue == "PPG2") {
	transmit = 0.874
} else if(selectValue == "PGA1") {
	transmit = 0.737
} else if(selectValue == "PGA2") {
	transmit = 0.762
} else if(selectValue == "PGBA1") {
	transmit = 0.859
} else if(selectValue == "PGBA2") {
	transmit = 0.871
} else if(selectValue == "PGW1") {
	transmit = 0.395
} else if(selectValue == "PGW2") {
	transmit = 0.562
} else if(selectValue == "PPC") {
	transmit = 0.868
} else if(selectValue == "PCA") {
	transmit = 0.727
} else if(selectValue == "PCP") {
	transmit = 0.690
} else if(selectValue == "PY1") {
	transmit = 0.773
} else if(selectValue == "PY2") {
	transmit = 0.707
} else if(selectValue == "PYA") {
	transmit = 0.739
} else if(selectValue == "FG1") {
	transmit = 0.782
} else if(selectValue == "FG2A") {
	transmit = 0.437
} else if(selectValue == "FG1BA") {
	transmit = 0.342
} else if(selectValue == "FG2BA") {
	transmit = 0.330
} else if(selectValue == "IMA") {
	transmit = 0.850
} else if(selectValue == "TP") {
	transmit = 0.900
} else if(selectValue == "POL") {
	transmit = 0.800
} else if(selectValue == "GS") {
	transmit = 0.880
} else if(selectValue == "GD") {
	transmit = 0.770
}

return transmit;

}

function setValue() {
    selectValue=document.getElementById("opList").value;
}

function init() {
    var button=document.getElementById("button");
    button.onclick=handleClick();
}




    