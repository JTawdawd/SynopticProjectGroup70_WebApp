var applications;

var backButton = document.createElement("button");
backButton.innerHTML = "back";
backButton.addEventListener("click", Back);

const ip = "localhost:3000";

/* removes all applictions on moderator page */
function ClearApplications() {
	console.log("cleared!?")
	var div = document.getElementById("moderatorPage");
	var divChildren = div.childNodes;
	for (var i = 0; i<divChildren.length; i++) {
		console.log(divChildren[i].nodeName.toString())
		if (divChildren[i].nodeName.toString() === "DIV") {
			console.log("BOOM")
			div.removeChild(divChildren[i]);
		}
	}
	/*if (divChildren[divChildren.length-1].toString() === backButton.toString())
		div.removeChild(backButton);*/
}

/* create all applications on moderator page from appliction json (requested from server) */
function BuildApplications() {
	ClearApplications()	;
	xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			applications=JSON.parse(xmlhttp.response);
		}
	}
	xmlhttp.open("GET","http://" + ip + "/applications", true);
	xmlhttp.send();
	
	if (applications.length === 0) {
		var h5 = document.getElementById("replyModerationPage");
		h5.innerHTML = "No Applications!"
		h5.style.display = "block";
		h5.style.color = "red";
		return;
	}
	
	var moderatorPageDiv = document.getElementById("moderatorPage");
	for (var i = 0; i< applications.length; i++) {
		var div = document.createElement("div");
		div.classList.add("application");
		moderatorPage.appendChild(div);
			
		var approveButton = document.createElement("button");
		approveButton.innerHTML = "Approve";
		approveButton.addEventListener("click", ApproveApplication);
		div.appendChild(approveButton);
			
		var h3 = document.createElement("h3");
		h3.innerHTML = applications[i].name + ", " + applications[i].occupation;
		div.appendChild(h3);
			
		var declineButton = document.createElement("button");
		declineButton.innerHTML = "decline";
		declineButton.addEventListener("click", DeclineApplication);
		div.appendChild(declineButton);
	}
	//moderatorPageDiv.appendChild(backButton);
}

/* remove appliction from moderator page, remove application from application json, and add auth key to authorised status json */
function ApproveApplication() {
	for (var i = 0; i< applications.length; i++) {
		var nameOcc = applications[i].name + ", " + applications[i].occupation;
		if (nameOcc == this.parentElement.childNodes[1].innerHTML) {
			xmlhttp = new XMLHttpRequest();
			xmlhttp.open("POST","http://" + ip + "/updateAuthKeys", true);
			xmlhttp.setRequestHeader("Content-Type", "application/json");
			xmlhttp.send(JSON.stringify(applications[i]));
			
			RemoveApplication(applications[i]);
		}
	}
	
	
	this.parentElement.parentElement.removeChild(this.parentElement);
	//BuildApplications();
}

/* remove appliction from moderator page, remove application from application json */
function DeclineApplication() {
	for (var i = 0; i< applications.length; i++) {
		var nameOcc = applications[i].name + ", " + applications[i].occupation;
		if (nameOcc == this.parentElement.childNodes[1].innerHTML) {
			RemoveApplication(applications[i]);
		}
	}
	this.parentElement.parentElement.removeChild(this.parentElement);
	//BuildApplications();
}

/* removes application from applications json */
function RemoveApplication(application) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST","http://" + ip + "/updateApplications", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify(application));
}

/* Check if auth key is in authorised status json, if it is take them to content page, if it isnt reply to user */
function CheckAuthKey() {
	var authKey = document.getElementById("authKey").value;
	var authKeys = [];
	
	xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange=function(){
         if (xmlhttp.readyState==4 && xmlhttp.status==200){
           json=JSON.parse(xmlhttp.response);
		   authKeys = json.authKeys;
		   if (authKey == "admin") {
				ShowModeratorPage();
			}
			else if (authKeys.includes(authKey)) {
				ShowDataForm();
			}
			else {
				var h5 = document.getElementById("replyFormSelector");
				h5.innerHTML = "Auth Key not valid!";
				h5.style.display = "block";
			}
         }
	}
	xmlhttp.open("GET","http://" + ip + "/authKeys", true);
	xmlhttp.send();
}

/* clear all input boxes */
function ClearInputs() {
	var inputs = document.getElementsByClassName("inputElement");
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].value = "";
	}
}

/* show application form and hide all others */
function ShowApplicationForm() {
	document.getElementById("formSelector").style.display = "none";
	document.getElementById("dataForm").style.display = "none";
	document.getElementById("applicationForm").style.display = "block";
	document.getElementById("moderatorPage").style.display = "none";
}

/* show data form and hide all others */
function ShowDataForm() {
	document.getElementById("formSelector").style.display = "none";
	document.getElementById("applicationForm").style.display = "none";
	document.getElementById("dataForm").style.display = "block";
	document.getElementById("moderatorPage").style.display = "none";
}

/* take values, make a json, and post it to the server (where it adds it to applications) & create a random auth key to include in the json*/
function SubmitApplication() {
	var inputs = document.getElementsByClassName("inputApplicationForm");
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].value === "") {
			var h5 = document.getElementById("replyApplicationForm");
			h5.innerHTML = "Application not submitted!";
			h5.style.color = "red";
			h5.style.display = "block";
			return;
		}
	}
	
	var authKey = Math.floor((Math.random() * 9999) + 1000);
	var data =
	'{' +
		'"name": "' + document.getElementById("applicationForm_firstName").value + ' ' + document.getElementById("applicationForm_secondName").value +'",' +
		'"occupation": "' + document.getElementById("applicationForm_occupation").value +'",' +
		'"authKey": "' + authKey.toString() + '"' +
	'}';

	var dataJSON = JSON.parse(data);
	
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST","http://" + ip + "/submitApplication", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify(dataJSON));
	
	var h5 = document.getElementById("replyApplicationForm");
	h5.innerHTML = "Application submitted! Your Auth Key is: <span style='font-size:17px;color:lightblue;'>"+ authKey.toString() +"</span><br><br>The key will have to be approved by a moderator before use!";
	h5.style.display = "block";
	h5.style.color = "lightgreen";
	ClearInputs();
}

/* take values, make a json, and post it to the server (where it adds it to the test content json) */
function SubmitData() {
	var inputs = document.getElementsByClassName("inputDataForm");
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].value === "") {
			var h5 = document.getElementById("replyDataForm");
			h5.innerHTML = "Data not submitted!";
			h5.style.color = "red";
			h5.style.display = "block";
			return;
		}
	}
	
	var data =
	'{' +
		'"name": "' + document.getElementById("dataForm_title").value +'",' +
		'"description": "' + document.getElementById("dataForm_description").value +'",' +
		'"author": "' + document.getElementById("dataForm_author").value +'"' +
	'}';

	var dataJSON = JSON.parse(data);
	
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST","http://" + ip + "/submitData", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify(dataJSON));
	
	var h5 = document.getElementById("replyDataForm");
	h5.innerHTML = "Data submitted!";
	h5.style.display = "block";
	h5.style.color = "green";
	ClearInputs();
}

/* show moderator page, and hide all forms */
function ShowModeratorPage() {
	BuildApplications();
	document.getElementById("formSelector").style.display = "none";
	document.getElementById("applicationForm").style.display = "none";
	document.getElementById("dataForm").style.display = "none";
	document.getElementById("moderatorPage").style.display = "block";
}

/* go back to auth key page */
function Back() {
	ClearInputs();
	document.getElementById("formSelector").style.display = "block";
	document.getElementById("applicationForm").style.display = "none";
	document.getElementById("dataForm").style.display = "none";
	document.getElementById("moderatorPage").style.display = "none";
}
