var access_token = "";
var baseUrl = 'https://apuplacementsandroid.firebaseio.com/';

function firebaseLog(node, request) {
  var urlQueue = baseUrl + 'logs/' + node + '.json?auth=' + access_token;
  request.dateVal = new Date();
  request.author = Session.getActiveUser().getEmail();
  var strRequest = JSON.stringify(request);
  var options = {
   'method' : 'post',
   'payload' : JSON.stringify({data: strRequest})
  };
  var response = UrlFetchApp.fetch(urlQueue, options);
}

function insertNewItems(r) {
  var urlQueue = baseUrl + 'news-items/' + '.json?auth=' + access_token;
  var request = JSON.parse(r);
  request.dateVal = new Date();
  var options = {
   'method' : 'post',
   'payload' : JSON.stringify(request)
 };
  var response = UrlFetchApp.fetch(urlQueue, options);
  
  fcm_news_sender(request);
  return JSON.stringify('success');
  
}

function fcm_news_sender(r) {
  Logger.log(r);
  var fcmUrl = "https://fcm.googleapis.com/fcm/send";
  var serverKey = "";
  
  var payload = {
    "to": "/topics/news",
    "data": {
    "custom_notification": {
      "title": r.title,
      "body": r.description,
      "color":"#004d40",
	      "priority":"high",
	      "large_icon": "ic_launcher",
	            "icon": "ic_launcher",
	      "show_in_foreground": true,
	      "priority": "max",
	      "big_text": r.description,
	      "type": "news"
    }
  }
  };
  
  var options = {
    "contentType": "application/json",
    "headers": { "Authorization": "key=" + serverKey},
    "method": "post",
    "payload": JSON.stringify(payload)
  };

  var response = UrlFetchApp.fetch(fcmUrl, options);
  return JSON.stringify({status: "SUCCESS!"});
}

/* Integration Scripts from old-firebase */

function uid_mappings() {
  var studentMasterWorkbookId = '1gC6z3PwW3yH_EYL7QHiJ5XDhjAKNhvfkJ6DY1HR2Zb8';
  var workbook = SpreadsheetApp.openById(studentMasterWorkbookId);
  var allStudentsSheet = workbook.getSheetByName('students');
  var allStudents = allStudentsSheet.getDataRange().getValues();
  
  var outNode = {}
  for(var i=1; i<allStudents.length; i++){
    var userId = sign(allStudents[i][6]);
    outNode[userId] = {
      email: allStudents[i][6], 
      admissionId: allStudents[i][0],
      program: allStudents[i][1],
      name: allStudents[i][5],
      cvUploaded: allStudents[i][7],
      uid: userId
    };
  }
  
  var options = {
   'method' : 'put',
    'payload' : JSON.stringify(outNode)
 };
  
  var activityUrl = baseUrl + "student-map" + '.json?auth=' + access_token;
  var response = UrlFetchApp.fetch(activityUrl, options);
  
}

function transferData() {
  var fetchActivityUrl = baseUrlLegacy + 'my-activity.json';
  var myActivity = UrlFetchApp.fetch(fetchActivityUrl);
  var options = {
   'method' : 'put',
    'payload' : myActivity.getContentText()
  };
  var setActivityUrl = baseUrl + "my-activity" + '.json?auth=' + access_token;
  var response = UrlFetchApp.fetch(setActivityUrl, options);
  
  
  var fetchLogsUrl = baseUrlLegacy + 'logs.json';
  var logs = UrlFetchApp.fetch(fetchLogsUrl);
  var options = {
   'method' : 'put',
    'payload' : logs.getContentText()
  };
  var setLogsUrl = baseUrl + "logs" + '.json?auth=' + access_token;
  response = UrlFetchApp.fetch(setLogsUrl, options);
  
}

function organizations_listing() {
  var orgSheetId = '1ulvesJkUJbl6g0QeGG4Y3sfBPuhbq5ZFEjgUIhn8hYs';
  var workbook = SpreadsheetApp.openById(orgSheetId);
  var allOrgSheet = workbook.getSheetByName('organizations');
  var allOrgs = allOrgSheet.getDataRange().getValues(); 
  var allOrgScheduleSheet = workbook.getSheetByName('uploads');
  var allSchedules = allOrgScheduleSheet.getDataRange().getValues();
  
  var orgMap = {};
  for(var i=1; i<allOrgs.length; i++) {
    orgMap[allOrgs[i][1]] = {
      title: allOrgs[i][1],
      url: allOrgs[i][2],
      location: allOrgs[i][3],
      state: allOrgs[i][4],
      domains: allOrgs[i][5] ? allOrgs[i][5].split(',') : []
    }
  }
  
  for(var i=1; i<allSchedules.length; i++){
    if(allSchedules[i][1] in orgMap) {
      orgMap[allSchedules[i][1]]['deadline-date'] = allSchedules[i][3] ? allSchedules[i][3] : '';
      orgMap[allSchedules[i][1]]['deadline-time'] = allSchedules[i][4] ? allSchedules[i][4] : '';
    }
  }
  
  var orgData = { data: JSON.stringify(orgMap)};
  
  var options = {
   'method' : 'put',
    'payload' : JSON.stringify(orgData)
  };
  var setOrgs = baseUrl + "org-map" + '.json?auth=' + access_token;
  response = UrlFetchApp.fetch(setOrgs, options);
  
}

function cleanup() {
  var key = "f3fc73631540ee999d43a52d5a7f7181";
  var activityUrl = baseUrl + 'org-cv.json?auth=' + access_token;
  var activity = UrlFetchApp.fetch(activityUrl);
  var jsObject = JSON.parse(activity.getContentText());
  var itemKeys = Object.keys(jsObject);
  itemKeys.map(function(keyItem){
    var options = {
   'method' : 'put',
    'payload' : JSON.stringify(jsObject[keyItem])
  };
  var setOrgs = baseUrl + "logs/org-cv/" + keyItem + '.json?auth=' + access_token;
  response = UrlFetchApp.fetch(setOrgs, options);
  });
}

function fcm_sender(request) {
  var r = JSON.parse(request);
  var fcmUrl = "https://fcm.googleapis.com/fcm/send";
  var serverKey = "";
  
  var payload = {
    registration_ids: r.ids,
//    "to" : "",
    "data": {
    "type":"PLACEMENT_NOTIFICATION",
    "custom_notification": {
      "id": Utilities.getUuid(),
      "title": r.title,
      "body": r.description,
      "color":'#004d40',
      "priority":"high",
      "large_icon": "ic_launcher",
            "icon": "ic_launcher",
      "show_in_foreground": true
    }
  }
  };
  
  var options = {
    "contentType": "application/json",
    "headers": { "Authorization": "key=" + serverKey},
    "method": "post",
    "payload": JSON.stringify(payload)
  };

  var response = UrlFetchApp.fetch(fcmUrl, options);
  return JSON.stringify({status: "SUCCESS!"});
}

function fcm_tester(request) {
  var fcmUrl = "https://fcm.googleapis.com/fcm/send";
  var serverKey = "";
  
  var payload = {
    registration_ids: [""],
    "data": {
    "type":"PLACEMENT_NOTIFICATION",
    "custom_notification": {
      "title": "Sending push notification",
      "body": "Push notification description is here...",
      "id": Utilities.getUuid(),
      "color":'#004d40',
      "priority":"high",
      "large_icon": "ic_launcher",
            "icon": "ic_launcher",
      "show_in_foreground": true
    }
  }
  };
  
  var options = {
    "contentType": "application/json",
    "headers": { "Authorization": "key=" + serverKey},
    "method": "post",
    "payload": JSON.stringify(payload)
  };

  var response = UrlFetchApp.fetch(fcmUrl, options);
  return JSON.stringify({status: "SUCCESS!"});
}

function sign(message){     
  var signature = Utilities.computeDigest(
                       Utilities.DigestAlgorithm.MD5,
                       message,
                       Utilities.Charset.US_ASCII);
  var signatureStr = '';
    for (i = 0; i < signature.length; i++) {
      var byte = signature[i];
      if (byte < 0)
        byte += 256;
      var byteStr = byte.toString(16);
      // Ensure we have 2 chars in our byte, pad with 0
      if (byteStr.length == 1) byteStr = '0'+byteStr;
      signatureStr += byteStr;
    }   
  return signatureStr;
}

function sig_test() {
  Logger.log(sign('ajay.more15@apu.edu.in'));
}