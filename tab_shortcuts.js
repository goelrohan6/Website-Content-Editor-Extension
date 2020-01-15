const tabDesignModeMapping = {};
let activeTabId;

function setDesignModeOff(tabId, showNotification = false) {
  tabDesignModeMapping[tabId] = "off";
  chrome.tabs.executeScript({
    code: 'document.designMode="off"'
  });
  chrome.browserAction.setIcon({path: "icon-off.png"});
  if (showNotification) {
    createNotification("off");
  }
}
function setDesignModeOn(tabId, showNotification = false) {
  tabDesignModeMapping[tabId] = "on";
  chrome.tabs.executeScript({
    code: 'document.designMode="on"'
  });
  chrome.browserAction.setIcon({path: "icon-on.png"});
  if (showNotification) {
    createNotification("on");
  }
}

function getDesignModeForTab(tabId) {
  if (tabDesignModeMapping.hasOwnProperty(tabId)) {
    return tabDesignModeMapping[tabId] || "off";
  }
  return "off";
}

function setActiveTab(tabId) {
  activeTabId = tabId;
  console.log("setActiveTab -> activeTabId", activeTabId)
  if (!tabDesignModeMapping.hasOwnProperty(activeTabId)) {
    tabDesignModeMapping[tabId] = "off";
    this.setDesignModeOff(tabId);
  } else {
    if (tabDesignModeMapping[tabId] === "on") {
      this.setDesignModeOn(tabId);
    } else if (tabDesignModeMapping[tabId] === "off") {
      this.setDesignModeOff(tabId);
    }
  }
}
function createNotification(type) {
  let title;
  let message;
  const notificationType = "basic";
  if (type === "on") {
    title = "Content edit on ⚡️";
    message = "Just click on the content to edit it :)";
    iconUrl = "icon-on.png";
  } else {
    title = "Content edit off ❌";
    message = "Press CMD + SHIFT + X to turn on content edit again."
    iconUrl = "icon-off.png";
  }
  chrome.notifications.create({
    type: notificationType,
    iconUrl,
    title,
    message
  })
}
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.status == 'complete') {
    setActiveTab(tabId);
  }
});
chrome.tabs.onActivated.addListener(({tabId, windowId}) => {
  setActiveTab(tabId);
});

chrome.commands.onCommand.addListener(function(command) {
  console.log("chrome.tabs", chrome.tabs)
  if (command === "toggle-designMode") {
    if (getDesignModeForTab(activeTabId) === "on") {
      setDesignModeOff(activeTabId, true);
    } else {
      setDesignModeOn(activeTabId, true);
    }
  }
});
