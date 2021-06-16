var applications;

var backButton = document.createElement("button");
backButton.innerHTML = "back";
backButton.addEventListener("click", Back);


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

function BuildApplications() {
	ClearApplications()	;
	xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			applications=JSON.parse(xmlhttp.response);
		}
	}
	xmlhttp.open("GET","http://86.184.101.251:7777/applications", false);
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

function ApproveApplication() {
	for (var i = 0; i< applications.length; i++) {
		var nameOcc = applications[i].name + ", " + applications[i].occupation;
		if (nameOcc == this.parentElement.childNodes[1].innerHTML) {
			xmlhttp = new XMLHttpRequest();
			xmlhttp.open("POST","http://86.184.101.251:7777/updateAuthKeys", true);
			xmlhttp.setRequestHeader("Content-Type", "application/json");
			xmlhttp.send(JSON.stringify(applications[i]));
			
			RemoveApplication(applications[i]);
		}
	}
	
	
	this.parentElement.parentElement.removeChild(this.parentElement);
	//BuildApplications();
}

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

function RemoveApplication(application) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST","http://86.184.101.251:7777/updateApplications", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify(application));
}

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
	xmlhttp.open("GET","http://86.184.101.251:7777/authKeys", true);
	xmlhttp.send();
}

function ClearInputs() {
	var inputs = document.getElementsByClassName("inputElement");
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].value = "";
	}
}

function ShowApplicationForm() {
	document.getElementById("formSelector").style.display = "none";
	document.getElementById("dataForm").style.display = "none";
	document.getElementById("applicationForm").style.display = "block";
	document.getElementById("moderatorPage").style.display = "none";
}

function ShowDataForm() {
	document.getElementById("formSelector").style.display = "none";
	document.getElementById("applicationForm").style.display = "none";
	document.getElementById("dataForm").style.display = "block";
	document.getElementById("moderatorPage").style.display = "none";
}

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
	xmlhttp.open("POST","http://86.184.101.251:7777/submitApplication", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify(dataJSON));
	
	var h5 = document.getElementById("replyApplicationForm");
	h5.innerHTML = "Application submitted! Your Auth Key is: <span style='font-size:17px;color:lightblue;'>"+ authKey.toString() +"</span><br><br>The key will have to be approved by a moderator before use!";
	h5.style.display = "block";
	h5.style.color = "lightgreen";
	ClearInputs();
}

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
	xmlhttp.open("POST","http://86.184.101.251:7777/submitData", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify(dataJSON));
	
	var h5 = document.getElementById("replyDataForm");
	h5.innerHTML = "Data submitted!";
	h5.style.display = "block";
	h5.style.color = "green";
	ClearInputs();
}

function ShowModeratorPage() {
	BuildApplications();
	document.getElementById("formSelector").style.display = "none";
	document.getElementById("applicationForm").style.display = "none";
	document.getElementById("dataForm").style.display = "none";
	document.getElementById("moderatorPage").style.display = "block";
}

function Back() {
	ClearInputs();
	document.getElementById("formSelector").style.display = "block";
	document.getElementById("applicationForm").style.display = "none";
	document.getElementById("dataForm").style.display = "none";
	document.getElementById("moderatorPage").style.display = "none";
}