let timerId = null;

const label = document.getElementById('autoJbLabel');
const checkbox = document.getElementById('autoJbInput');
const jeilbrekBtn = document.getElementById('jeilbrek');
const UAElement = document.getElementById("UA");

const storedAutoJb = localStorage.getItem("autoJb");

// Auto Jailbreak is OFF by default
let autoJbValue = storedAutoJb !== null
    ? storedAutoJb === "true"
    : false;

// choose one of kernel exploits
var exploitChain = localStorage.getItem("exploitChain") || "lapse";

const netctrlRadio = document.getElementById("netctrl-exploit");
const lapseRadio = document.getElementById("lapse-exploit");
const kexForm = document.getElementById('kernel-options');

// Show user agent
UAElement.innerText += " " + navigator.userAgent;


// =========================================================
// EXPLOIT CHAIN SELECTION
// =========================================================

kexForm.addEventListener("change", function (event) {
    localStorage.setItem("exploitChain", event.target.value);
    exploitChain = event.target.value;
});


// =========================================================
// JAILBREAK EXECUTION
// =========================================================

jeilbrekBtn.addEventListener("click", function (e) {

    // Stop any active auto-jailbreak countdown
    stopInterval();

    // Keep the jailbreak button enabled
    // so it does NOT become greyed out after pressing it.
    jeilbrekBtn.disabled = false;

    doJb();
});


// =========================================================
// AUTO JAILBREAK
// =========================================================

checkbox.addEventListener('change', function () {

    localStorage.setItem("autoJb", checkbox.checked);

    if (checkbox.checked) {

        if (jeilbrekBtn.disabled === false) {
            jailbreakCountdown();
        }

        return;
    }

    stopInterval();
});


// =========================================================
// STOP COUNTDOWN
// =========================================================

function stopInterval() {

    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }

    label.textContent = "Auto Jailbreak";
}


// =========================================================
// AUTO JAILBREAK COUNTDOWN
// =========================================================

function jailbreakCountdown() {

    stopInterval();

    let countdown = 5;

    label.textContent =
        `Auto Jailbreaking in: ${countdown}`;

    timerId = setInterval(() => {

        countdown--;

        label.textContent =
            `Auto Jailbreaking in: ${countdown}`;

        if (countdown < 0) {

            clearInterval(timerId);
            timerId = null;

            label.textContent = "Executing";

            // Do NOT disable the main button
            jeilbrekBtn.disabled = false;

            doJb();
        }

    }, 1000);
}


// =========================================================
// CACHE PROGRESS
// =========================================================

function cacheProgress(e) {

    var Percent =
        Math.round(e.loaded / e.total * 100);

    document.title =
        "Caching: " + Percent + "%";
}


function displayCacheProgress() {

    setTimeout(function () {

        document.title = "\u2713";

    }, 1000);

    setTimeout(function () {

        document.title = "CSSFontFace exploit";

    }, 3000);
}


// =========================================================
// INITIALIZATION
// =========================================================

document.addEventListener("DOMContentLoaded", function() {

    // Cache handling
    if (window.applicationCache) {

        window.applicationCache.addEventListener(
            "progress",
            cacheProgress,
            false
        );

        window.applicationCache.oncached =
            function (e) {
                displayCacheProgress();
            };

        window.applicationCache.onupdateready =
            function (e) {
                displayCacheProgress();
            };
    }


    // Choose preferred exploit chain
    if (exploitChain == "netctrl") {

        netctrlRadio.checked = true;

    } else {

        lapseRadio.checked = true;
    }


    // Apply Auto Jailbreak setting
    checkbox.checked = autoJbValue;


    // Only start countdown if the user has
    // explicitly enabled Auto Jailbreak.
    if (autoJbValue) {
        jailbreakCountdown();
    }
});
