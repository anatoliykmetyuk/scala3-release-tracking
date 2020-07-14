function commitment_main() {
  var person = commitment_sheet().getRange("B1")
    .getValue();
  console.log("Processing " + person);

  var milestones = milestones_sheet()
    .getRange("A2:A99").getValues();
  var personCol = milestones_sheet()
    .getRange(1, 5, 1, 99)
    .getValues()[0]
    .findIndex(p => p == person) + 5;

  for (r = 0; r < milestones.length; r++) {
    var ms = milestones[r][0];
    var commitment = milestones_sheet()
      .getRange(r + 2, personCol).getValue();
    if (commitment != "")
      insert_milestone(person, ms, commitment);
  }
}

function insert_milestone(person, milestone, commitment) {
  console.log("Adding " + milestone + " for " +
    person + " with commitment " + commitment);
}


function app() {
  return SpreadsheetApp.getActive();
}

function milestones_sheet() {
  return app().getSheetByName("Milestones");
}

function commitment_sheet() {
  return app().getSheetByName("Commitment");
}
