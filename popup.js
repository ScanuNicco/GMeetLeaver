var tabtimes = []; // Stores tab IDs and the time to close them.
var nonmeets = false;

document.getElementById("othertabsbox").addEventListener('click', otherTabs, false);

chrome.storage.local.get(['tabtimes', 'othertabs'], function (result) {
	tabtimes = result.tabtimes;
	nonmeets = result.othertabs;
	if(tabtimes == undefined){
		tabtimes = [];
	}
	if(nonmeets == undefined){
		nonmeets = false;
	}
	document.getElementById("othertabsbox").checked = nonmeets;
	getMeetings(tabtimes);
});

function getMeetings(times) {
	console.log(times);
	chrome.tabs.query({
		windowId: chrome.windows.WINDOW_ID_CURRENT
	}, (tabs) => {
		var numentries = 0;
		for (var i = 0; i < tabs.length; i++) {
			if (tabs[i].title.includes("Meet") || tabs[i].title.includes("BigBlueButton") || nonmeets) {
				numentries++;
				var time = -1;
				for (var j = 0; j < times.length; j++) {
					if (times[j].id == tabs[i].id) {
						time = times[j].expires;
					}
				}
				var tab = document.createElement("div");
				tab.classList.add('tab');
				if (time == -1) { //No time has previously been set
					tab.innerHTML += "<img src='" + tabs[i].favIconUrl + "' class='meeticon'><h2>" + tabs[i].title + "</h2><div class='actionsContainer'><input type='time' id='time" + i + "'><button class='actionButton' tabId='" + tabs[i].id + "' id='action" + i + "'>Set End Time</button></div>";
					document.getElementById("meetingsCont").appendChild(tab);
					document.getElementById("action" + i).addEventListener('click', setTimer);
				} else { //A time has beeen set for this tab, display it.
					tab.innerHTML += "<img src='" + tabs[i].favIconUrl + "' class='meeticon'><h2>" + tabs[i].title + "</h2><div class='actionsContainer'><h3>Scheduled To Close At " + time + "</h3><button class='actionButton' tabId='" + tabs[i].id + "' id='close" + i + "'>Cancel</button></div>";
					document.getElementById("meetingsCont").appendChild(tab);
					document.getElementById("close" + i).addEventListener('click', clearTimer);
				}
			}
		}
		if(numentries == 0){
			document.getElementById("meetingsCont").innerHTML += "<h2 style='color: grey; margin: 30px;'>No Meetings Open</h2>";
		}
	});
}

function setTimer(evt) {
	console.log('test');
	tabID = evt.target.getAttribute("tabID");
	time = document.getElementById("time" + evt.target.id.replace(/^\D+/g, '')).value;
	if(time == ""){
		alert("No Time Set!");
		return;
	}
	tabtimes.push({
		id: tabID,
		expires: time
	});
	saveTimes();
}

function clearTimer(evt) {
	tabID = evt.target.getAttribute("tabID");
	for(var i = 0; i < tabtimes.length; i++){
		if(tabtimes[i].id == tabID){
			tabtimes.splice(i, 1);
		}
	}
	saveTimes();
}

function saveTimes() { // Stores the tabtimes array using the chrome.storage API
	chrome.storage.local.set({
		'tabtimes': tabtimes
	}, function () {
		window.location.reload();
	});
}

function otherTabs(){
	nonmeets = !nonmeets;
	chrome.storage.local.set({
		'othertabs': nonmeets
	}, function () {
		window.location.reload();
	});
}