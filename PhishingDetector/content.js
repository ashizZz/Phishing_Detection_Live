var getBlockedList = browser.storage.sync.get('blocked');
var URLBlockList = ["www.tpbproxypirate.com", "lms.softwarica.edu.np", "instagram.com"];
getBlockedList.then((res) => {

    // replace harmful hrefs // alternate: new redirect tab
    // function nativeSelector() {
    //     var elements = document.querySelectorAll("body, body *");
    //     var results = [];
    //     var child;
    //     for (var i = 0; i < elements.length; i++) {
    //         child = elements[i].childNodes[0];
    //         if (elements[i].hasChildNodes() && child.nodeType == 3) {
    //             results.push(child);
    //         }
    //     }
    //     return results;
    // }

    // var textnodes = nativeSelector(),
    //     _nv;


    // for (var i = 0, len = textnodes.length; i < len; i++) {
    //     _nv = textnodes[i].nodeValue;
    //     // alert(_nv);
    //     textnodes[i].nodeValue = _nv.replace(/contact/g, 'fuck');
    // }

    // var alc = 0
    for (let link of document.getElementsByTagName("a")) {
        URLBlockList.forEach(element => {
            if (link.href.search(element) > -1) {
                // if (alc == 0) {
                // link.style.pointerEvents == "";
                // alert(link.href);
                link.href = "https://www.google.com/url?q=" + link.href;
                //     alc++;
                // }
            }
        });
    }

    let blockedList = res.blocked;
    if (blockedList.includes(window.location.hostname)) {
        document.body.innerHTML = '<div style="background-color:red; text-align:center;"><text style="font-size:50px;"><b>Blocked! <img src="https://img.icons8.com/emoji/48/000000/warning-emoji.png"/></b></text><br><tpd style="color:white;">by The Phishing Detector<tpd></div>';
    } else if (URLBlockList.includes(window.location.hostname)) {
        document.body.innerHTML = '<div style="background-color:red; text-align:center;"><text style="font-size:50px;"><b>Harmful Site Blocked! <img src="https://img.icons8.com/external-flatart-icons-flat-flatarticons/64/000000/external-warning-corona-virus-flatart-icons-flat-flatarticons.png"/></b></text><br><tpd style="color:white;">by The Phishing Detector</tpd></div>';
    } else {
        return;
    }
});


// EMAIL check

let raw_message = document.getElementById("raw_message_text").innerHTML;
var check = [];
var linkCounter = 0;

// Check if sender is blacklisted
blockedSender = ["deadfake.com", "spoofbox.com", "sendananymousemail.net", "emkei.cz", "anonymailer.net", "tempmail.ninja"];
for (var i = 0; i < blockedSender.length; i++) {
    const regex = new RegExp("@" + blockedSender[i], "gm");
    // alert(raw_message.match(regex))[0];
    if (raw_message.match(regex) == null) {
        continue;
    }
    if (raw_message.match(regex)[0] == "@" + blockedSender[i]) {
        check.blacklist = 'failed';
    } else {
        console.log('Blacklist check failed!');
    }
}

// check SPF
if (raw_message.includes("spf=pass")) {
    check.spf = 'passed';
} else {
    check.spf = 'failed';
}


// get all links and remove duplicates
const domainRegex = /([a-z0-9|-]+\.)*[a-z0-9|-]+\.[a-z]+/gi
var domains = raw_message.match(domainRegex);
domains = domains.filter(e => e !== 'google.com');
domains = domains.filter(e => e !== 'mx.google.com');
domains = domains.filter(e => e !== 'smtp.mailfrom');
domains = domains.filter(e => e !== 'gmail.com');
let uniqueDomains = [...new Set(domains)];
// alert(uniqueDomains);

// check the links
for (var j = 0; j < uniqueDomains.length; j++) {
    function reqListener() {
        if (this.responseText.includes('Unsafe URL')) {
            linkCounter += 1;
        } else {
            return;
        }
    }
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("POST", "https://ce72-110-44-124-164.ngrok.io/index.php");
    oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    oReq.send('check="' + uniqueDomains[j] + '"');
}


setTimeout(function() {
    confirm("This email is not safe:\n SPF check: " + check.spf + "\n Blacklist check: " + check.blacklist + "\n Suspicious URLs found: " + linkCounter + "");
}, 5000);