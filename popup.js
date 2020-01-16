'use strict';

function onToggle (e) {
    const input = document.getElementById("toggleDesignModeOn");
    const isToggleOn = input.checked;
    console.log("TCL: onToggle -> isToggleOn", isToggleOn)
    if (isToggleOn) {
        toggleEditMode("On");
        closeWindow();
    } else {
        toggleEditMode("Off");
        closeWindow();
    }
}
function closeWindow() {
    setTimeout(() => {
        window.close();
    }, 250);
}

function toggleEditMode(mode) {
    chrome.runtime.sendMessage(
        { message: "turn" + mode },
        response => {}
    );
}
function getCurrentStatus() {
    chrome.runtime.sendMessage(
        { message: "getStatusOfCurrentTab"},
        status => {
            const input = document.getElementById("toggleDesignModeOn");
            if (status === "on") {
                input.checked = true;
            } else {
                input.checked = false;
            }
        }
    );
}
document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById("toggleDesignModeOn");
  input.addEventListener("click", onToggle)
  getCurrentStatus();
  setInterval(getCurrentStatus, 500);
});
