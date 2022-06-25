function displayURL() {
    function logTabs(tabs) {
        // get currentURL
        let tab = tabs[0]; // Safe to assume there will only be one result
        document.getElementById('hosturl').innerText = tab.url;

        //send URL to API
        function reqListener() {
            // console.log(this.responseText);
            document.querySelector('#check_in_progress').style.display = "none";
            if (this.responseText.includes('Safe URL') && tab.url.includes('https://')) {
                document.querySelector('#display_result').innerText = "This site is safe to visit."
            } else if (this.responseText.includes('Safe URL') && tab.url.includes('http://')) {
                document.querySelector('#display_result').innerText = "This site does not support SSL. Your communication is insecure."
            } else {
                console.log(this.responseText);
                document.querySelector('#display_result').innerText = "This site is NOT safe to visit."
            }
        }
        if (tab.url.includes('http')) {
            if (tab.url.includes('https://')) {
                var ssl = true;
            } else {
                var ssl = false;
            }
            var oReq = new XMLHttpRequest();
            oReq.addEventListener("load", reqListener);
            oReq.open("POST", "https://ce72-110-44-124-164.ngrok.io/index.php");
            oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            oReq.send('check="' + tab.url + '"');
        }
    }
    browser.tabs.query({ currentWindow: true, active: true }).then(logTabs, console.error);
}
displayURL();


function reportURL() {
    // make the button clickable
    document.querySelector('#report_Url').onclick = function() { report() };

    function report() {
        function reportTab(tabs) {
            // get currentURL
            let tab = tabs[0]; // Safe to assume there will only be one result
            //reportURL to API
            function reqListener() {
                if (this.responseText.includes('has been reported')) {
                    document.querySelector('#report_Url').innerText = "Successfully Reported!";
                }
            }
            if (tab.url.includes('http')) {
                var oReq = new XMLHttpRequest();
                oReq.addEventListener("load", reqListener);
                oReq.open("POST", "https://ce72-110-44-124-164.ngrok.io/index.php");
                oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                oReq.send('report="' + tab.url + '"');
            }
        }
        browser.tabs.query({ currentWindow: true, active: true }).then(reportTab, console.error);

    }
}
reportURL();


function blockURL() {
    function blockText(tabs) {
        // get currentURL
        let tab = tabs[0]; // Safe to assume there will only be one result
        const getHostname = (url) => {
                const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
                return matches && matches[1];
            }
            // Text change based on block list
        var getBlockedList = browser.storage.sync.get('blocked');
        getBlockedList.then((res) => {
            let blockedList = res.blocked;
            // Run with this line uncommented once to fix undeined issue, temporary fix
            // let blockedList = [];
            if (blockedList.includes(getHostname(tab.url))) {
                document.querySelector('#block_all').innerText = "Unblock this Site!";
                document.querySelector('#block_all').onclick = function() { unblock() };
            } else {
                document.querySelector('#block_all').onclick = function() { block() };
            }
        });
    }
    browser.tabs.query({ currentWindow: true, active: true }).then(blockText, console.error);

    // ###### //
    // make the button clickable
    function block() {
        function blockTab(tabs) {
            // get currentURL
            let tab = tabs[0]; // Safe to assume there will only be one result
            const getHostname = (url) => {
                const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
                return matches && matches[1];
            }
            var getBlockedList = browser.storage.sync.get('blocked');
            getBlockedList.then((res) => {
                let blockedList = res.blocked;
                if (blockedList.includes(getHostname(tab.url))) {
                    return;
                } else {
                    blockedList.push(getHostname(tab.url));
                    browser.storage.sync.set({ blocked: blockedList });
                    document.querySelector('#block_all').innerText = "Unblock this Site!";
                }
            });
        }
        browser.tabs.query({ currentWindow: true, active: true }).then(blockTab, console.error);
    }

    function unblock() {
        console.log

        function blockTab(tabs) {
            // get currentURL
            let tab = tabs[0]; // Safe to assume there will only be one result
            const getHostname = (url) => {
                const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
                return matches && matches[1];
            }
            var getBlockedList = browser.storage.sync.get('blocked');
            getBlockedList.then((res) => {
                let blockedList = res.blocked;
                if (blockedList.includes(getHostname(tab.url))) {
                    blockedList = blockedList.filter(e => e !== getHostname(tab.url));
                    // console.log('after: ' + tab.url);
                    browser.storage.sync.set({ blocked: blockedList });
                    document.querySelector('#block_all').innerText = "Block this Site!";
                }
            });
        }
        browser.tabs.query({ currentWindow: true, active: true }).then(blockTab, console.error);
    }

}
blockURL();