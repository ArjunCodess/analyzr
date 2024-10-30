(function () {
  ("use strict");

  var location = window.location;
  var document = window.document;

  var scriptElement = document.currentScript;
  var dataDomain = scriptElement.getAttribute("data-domain");
  // we get the utm query in order to track the source of each visit
  let queryString = location.search;
  const params = new URLSearchParams(queryString);
  var source = params.get("utm");

  var endpoint = "http://localhost:3000/api/track";

  function generateSessionId() {
    // Generate a random session ID
    return "session-" + Math.random().toString(36).substr(2, 9);
  }

  function initializeSession() {
    var sessionId = localStorage.getItem("session_id");
    var expirationTimestamp = localStorage.getItem(
      "session_expiration_timestamp"
    );

    if (!sessionId || !expirationTimestamp) {
      // Generate a new session ID
      sessionId = generateSessionId();

      // Set the expiration timestamp
      expirationTimestamp = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Store the session ID and expiration timestamp in localStorage
      localStorage.setItem("session_id", sessionId);
      localStorage.setItem("session_expiration_timestamp", expirationTimestamp);
      trackSessionStart();
    }

    return {
      sessionId: sessionId,
      expirationTimestamp: parseInt(expirationTimestamp),
    };
  }
  // Function to check if the session is expired
  function isSessionExpired(expirationTimestamp) {
    return Date.now() >= expirationTimestamp;
  }

  function checkSessionStatus() {
    var session = initializeSession();
    if (isSessionExpired(session.expirationTimestamp)) {
      localStorage.removeItem("session_id");
      localStorage.removeItem("session_expiration_timestamp");
      trackSessionEnd();
      // if visitor landed on the website after expiration we need to create new session in order to count it as a new visit.
      initializeSession();
    }
  }

  // Call checkSessionStatus() when the user lands on the website
  checkSessionStatus();

  // Function to send tracking events to the endpoint
  function trigger(eventName, options) {
    var payload = {
      event: eventName,
      url: location.href,
      domain: dataDomain,
      source,
    };

    sendRequest(payload, options);
  }

  // Function to send HTTP requests
  function sendRequest(payload, options) {
    var request = new XMLHttpRequest();
    request.open("POST", endpoint, true);
    request.setRequestHeader("Content-Type", "application/json");

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        options && options.callback && options.callback();
      }
    };

    request.send(JSON.stringify(payload));
  }

  // Queue of tracking events
  var queue = (window.your_tracking && window.your_tracking.q) || [];
  window.your_tracking = trigger;
  for (var i = 0; i < queue.length; i++) {
    trigger.apply(this, queue[i]);
  }

  // Function to track page views
  function trackPageView() {
    // Trigger a custom event indicating page view
    trigger("pageview");
  }
  function trackSessionStart() {
    // Trigger a custom event indicating page view
    trigger("session_start");
  }
  function trackSessionEnd() {
    trigger("session_end");
  }

  // Track page view when the script is loaded
  trackPageView();
  var initialPathname = window.location.pathname;

  // Event listener for popstate (back/forward navigation)
  window.addEventListener("popstate", trackPageView);
  // Event listener for hashchange (hash-based navigation)
  window.addEventListener("hashchange", trackPageView);
  document.addEventListener("click", function (event) {
    setTimeout(() => {
      if (window.location.pathname !== initialPathname) {
        trackPageView();
        // Update the initialPathname for future comparisons
        initialPathname = window.location.pathname;
      }
    }, 3000);
  });
})();