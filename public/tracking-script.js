(function () {
  ("use strict");

  var location = window.location;
  var document = window.document;
  var navigator = window.navigator;

  var scriptElement = document.currentScript;
  var dataDomain = scriptElement.getAttribute("data-domain");
  let queryString = location.search;
  const params = new URLSearchParams(queryString);
  var source = params.get("utm");

  var endpoint = "https://getanalyzr.vercel.app/api/track";

  async function getUserLocation() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      const data = await response.json();
      return {
        city: data.city || 'Unknown',
        region: data.region || 'Unknown',
        country: data.country_name || 'Unknown',
      };
    } catch (error) {
      console.error('Error fetching location:', error);
      return {
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown',
      };
    }
  }

  function getOperatingSystem() {
    var userAgent = navigator.userAgent;
    var os = "Unknown";

    if (userAgent.indexOf("Windows") !== -1) os = "Windows";
    if (userAgent.indexOf("Mac OS") !== -1) os = "MacOS";
    if (userAgent.indexOf("Linux") !== -1) os = "Linux";
    if (userAgent.indexOf("Android") !== -1) os = "Android";
    if (userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("iPad") !== -1) os = "iOS";

    return os;
  }

  function generateSessionId() {
    return "session-" + Math.random().toString(36).substr(2, 9);
  }

  function initializeSession() {
    var sessionId = localStorage.getItem("session_id");
    var expirationTimestamp = localStorage.getItem(
      "session_expiration_timestamp"
    );

    if (!sessionId || !expirationTimestamp) {
      sessionId = generateSessionId();
      expirationTimestamp = Date.now() + 10 * 60 * 1000; // 10 minutes
      localStorage.setItem("session_id", sessionId);
      localStorage.setItem("session_expiration_timestamp", expirationTimestamp);
      trackSessionStart();
    }

    return {
      sessionId: sessionId,
      expirationTimestamp: parseInt(expirationTimestamp),
    };
  }

  function isSessionExpired(expirationTimestamp) {
    return Date.now() >= expirationTimestamp;
  }

  function checkSessionStatus() {
    var session = initializeSession();
    if (isSessionExpired(session.expirationTimestamp)) {
      localStorage.removeItem("session_id");
      localStorage.removeItem("session_expiration_timestamp");
      trackSessionEnd();
      initializeSession();
    }
  }

  checkSessionStatus();

  async function trigger(eventName, options) {
    try {
      const locationData = await getUserLocation();
      const operatingSystem = getOperatingSystem();

      var payload = {
        event: eventName,
        url: location.href,
        domain: dataDomain,
        source,
        city: locationData.city,
        region: locationData.region,
        country: locationData.country,
        operatingSystem
      };

      sendRequest(payload, options);
    } catch (error) {
      console.error('Error in trigger:', error);
    }
  }

  function sendRequest(payload, options) {
    var request = new XMLHttpRequest();
    request.open("POST", endpoint, true);
    request.setRequestHeader("Content-Type", "application/json");

    request.onreadystatechange = function () {
      if (request.readyState === 4 && options && options.callback) {
        options.callback();
      }
    };

    request.send(JSON.stringify(payload));
  }

  var queue = (window.your_tracking && window.your_tracking.q) || [];
  window.your_tracking = trigger;
  for (var i = 0; i < queue.length; i++) {
    trigger.apply(this, queue[i]);
  }

  function trackPageView() {
    trigger("pageview");
  }
  function trackSessionStart() {
    trigger("session_start");
  }
  function trackSessionEnd() {
    trigger("session_end");
  }

  trackPageView();
  var initialPathname = window.location.pathname;

  window.addEventListener("popstate", trackPageView);
  window.addEventListener("hashchange", trackPageView);
  document.addEventListener("click", function () {
    setTimeout(() => {
      if (window.location.pathname !== initialPathname) {
        trackPageView();
        initialPathname = window.location.pathname;
      }
    }, 3000);
  });
})();
