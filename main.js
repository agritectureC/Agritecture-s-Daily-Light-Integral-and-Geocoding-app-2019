var locationForm = document.getElementById('location-form');
var selectValue, transmit, month, userDay;
var day, inverseDist, solarDecl,latRad, sunAngle, dli, R_a,lat,lng;



//Constants
const k1 = (24 * 60)/Math.PI;
const solarConstant = 0.082;

//Step 1.Calculate and set day of the year (1-366)
//For example, if today is January 1st, day of the year is 1
function setDay(){
    
	var userDate = new Date (2020,month,userDay);
	var start = new Date(2020, 0, 0);
	var difference = userDate - start;
	day = (Math.round(difference / (1000 * 60 * 60 * 24) ));
	
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

//Change the API key

key:'YOUR KEY'
        }
      })
      .then(function(response){
      
        // output the full geocoding output to the console
        console.log(response);

        // Geometry
        lat = response.data.results[0].geometry.location.lat;
        lng = response.data.results[0].geometry.location.lng;
        
    
        dli = findDli(transmit);
        console.log ("Daily light integral: " + dli);
        console.log("latitude is" + lat );
        console.log("day number is" + day );
        console.log("inverse distance number is" + inverseDist );
        console.log("solar declination is" + solarDecl );
        console.log("latitude in Radians is" + latRad );
        console.log("sun Angle is" + sunAngle );
        console.log("R_a is" + R_a );
        console.log("transmittance is" + transmit);
        console.log("dli is" + dli);
        
        
       
        
        
        // Round the values to 2 decimal places
		var result = dli.toFixed(2);
		var latFin = parseFloat(lat).toFixed(2);
		var lngFin = parseFloat(lng).toFixed(2);

		//Output values
        document.getElementById('dli').innerHTML = "Daily Light Integral: " + result;
        document.getElementById('latitude').innerHTML = "Location latitude: " + latFin;
        document.getElementById('longitude').innerHTML ="Location longitude: " + lngFin;
      })
      .catch(function(error){
        console.log(error);
      });

    }
    function setDate(){
    
    
    }
    function handleClick() {

var selectValue=document.getElementById("opList").value;

if(selectValue == "GS") {
	transmit = 1.0
}else if(selectValue == "PPG1") {
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
} else if(selectValue == "FG2B") {
	transmit = 0.446
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
} else if(selectValue == "GD") {
	transmit = 0.88
}
//get month and day as integers

month = parseInt(document.getElementById("month").value)-1;

userDay = parseInt(document.getElementById("day").value);


return transmit;

}

function setValue() {
    selectValue=document.getElementById("opList").value;
}

function init() {
    var button=document.getElementById("button");
    button.onclick=handleClick();
}


	
