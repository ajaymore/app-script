var request = JSON.stringify({ "boothDetails": "{\"name\":\"\",\"key\":\"\"}", "clientChoice": { "placements": ["Jitesh pandey", "C R ANUSHA"], "sc": ["AKSHAYA SUNDARARAJAN", "Ayushi Sharma"], "ssc": ["Ankit Kumar", "Boban Baby"], "residence": ["SAKHIR.P"], "program": ["Raksha Balakrishna"] } });
function updateMyChoices() {
  var r = JSON.parse(request);
  var boothDetails = JSON.parse(r.boothDetails);
  var clientChoices = r.clientChoice;
  var program = "MAD";
  var isHostelite = true;
  var hostel = 'Sai PG';
  var year = 15;
  var genGuid = "erwerwewerw"

  console.log(boothDetails);
  var allEntries = [];
  //placements
  var placementsEntries = clientChoices.placements;
  for (var i = 0; i < placementsEntries.length; i++) {
    allEntries.push([placementsEntries[i], 'placements', genGuid]);
  }

  //club entries
  var clubEntries = clientChoices.sc;
  for (var i = 0; i < clubEntries.length; i++) {
    allEntries.push([clubEntries[i], 'clubs', genGuid]);
  }

  //ssc entries
  var sscEntries = clientChoices.ssc;
  for (var i = 0; i < sscEntries.length; i++) {
    allEntries.push([sscEntries[i], 'ssc', genGuid]);
  }

  //program entries
  var programEntry = [];
  if (program === 'MAD') {
    programEntry = [clientChoices.program[0], 'MAD', genGuid];
  } else if (student.program == 'LLM') {
    programEntry = [clientChoices.program[0], 'LLM', genGuid];
  } else if (student.program == 'MAE') {
    programEntry = [clientChoices.program[0], 'MAE', genGuid];
  } else if (student.program == 'MPG') {
    programEntry = [clientChoices.program[0], 'MPG', genGuid];
  }
  allEntries.push(programEntry);

  //hostel entries
  var hostelEntry = [];
  if (isHostelite && hostel === 'Sai PG') {
    if (year == 15) {
      hostelEntry = [clientChoices.residence[0], 'Sai PG-15', genGuid];
    } else if (year == 16) {
      hostelEntry = [clientChoices.residence[0], 'Sai PG-16', genGuid];
    }
  } else if (isHostelite && hostel === 'Metropolis') {
    if (year == 15) {
      hostelEntry = [clientChoices.residence[0], 'Metropolis-15', genGuid];
    } else if (year == 16) {
      hostelEntry = [clientChoices.residence[0], 'Metropolis-16', genGuid];
    }
  }
  allEntries.push(hostelEntry);

  console.log(allEntries);
  // sheet.getRange(lastRow + 1, 1, 1, allEntries.length).setValues([allEntries]);
}

updateMyChoices();