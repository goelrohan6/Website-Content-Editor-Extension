const tabDesignModeMapping = {};
let activeTabId;

function setDesignModeOff(tabId) {
  tabDesignModeMapping[tabId] = "off";
  chrome.tabs.executeScript({
    code: 'document.designMode="off"'
  });
  chrome.browserAction.setIcon({path: "icon-off.png"});
}
function setDesignModeOn(tabId) {
  tabDesignModeMapping[tabId] = "on";
  chrome.tabs.executeScript({
    code: 'document.designMode="on"'
  });
  chrome.browserAction.setIcon({path: "icon-on.png"});
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
      setDesignModeOff(activeTabId);
    } else {
      setDesignModeOn(activeTabId);
    }
  }
});
