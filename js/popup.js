//
// copy kick_ps.json 
//  - mac:
// Google Chrome: ~/Library/Application Support/Google/Chrome/NativeMessagingHosts/kick_ps.json
// Chromium: ~/Library/Application Support/Chromium/NativeMessagingHosts/kick_ps.json


function invokeApp() {

  const divResult = document.getElementById('result_area');
  divResult.innerHTML = 'invoke';

  // --- continue ---
  const port = chrome.runtime.connectNative('kick_ping');
  port.onMessage.addListener((response) => {
    const str = JSON.stringify(response);
    console.log("Result: " + str);

    divResult.innerHTML += ('<br>' + str);
  });
  port.onDisconnect.addListener(function() {
    console.log("Disconnected");
    divResult.innerHTML += ('<br>--DISCONNECTED--');
  });

  /*--
  // --- onece ---
  const ret = chrome.runtime.sendNativeMessage('kick_ps',
    {},
    function(response) {
      const str = JSON.stringify(response);
      console.log("Result: " + str);
      divResult.innerText = 'result: ' + str;
    }
  );
  console.log('Ret:', ret);
  ---*/

}

document.getElementById('invoke_button').addEventListener('click', invokeApp);


/*
The same format is used to send messages in both directions:
 each message is serialized using JSON, UTF-8 encoded 
 and is preceded with 32-bit message length in native byte order.
 The maximum size of a single message from the native messaging host is 1 MB,
 mainly to protect Chrome from misbehaving native applications.
 The maximum size of the message sent to the native messaging host is 4 GB.
*/


/*
https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions/Native_messaging
*/
