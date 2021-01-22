//This script runs in the background, and closes tabs when their expiration time passes
setInterval(checkTabs, 15000);

function checkTabs() {
	var tabtimes = []; // Stores tab IDs and the time to close them.

	chrome.storage.local.get(['tabtimes'], function (result) {
		tabtimes = result.tabtimes;
		if (tabtimes == undefined) {
			tabtimes = [];
		}
		var d = new Date();
		var time = d.getHours() + ":" + d.getMinutes();
		for (var i = 0; i < tabtimes.length; i++) {
			if (tabtimes[i].expires == time) {
				//This tab's time is up!
				chrome.tabs.remove(Number(tabtimes[i].id), function () {});
				//RIP tab, remove it from the array to prevent errors
				tabtimes.splice(i, 1);
				console.log(tabtimes);
				console.log(i);
				chrome.storage.local.set({
					'tabtimes': tabtimes
				}, function () {});
			}
		}
	});
}
