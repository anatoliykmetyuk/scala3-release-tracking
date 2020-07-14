var milestones_sheet = SpreadsheetApp.getActive().getSheetByName("Milestones");
var commitment_sheet = SpreadsheetApp.getActive().getSheetByName("Commitment");

function commitment_main() {
  commitment_sheet.getRange("A3:F99").clear();

  var person = commitment_sheet.getRange("B1")
    .getValue();
  console.log("Processing " + person);

  var milestones = milestones_sheet
    .getRange("A2:A99").getValues();
  var personCol = milestones_sheet
    .getRange(1, 5, 1, 99)
    .getValues()[0]
    .findIndex(p => p == person) + 5;

  for (r = 0; r < milestones.length; r++) {
    var ms = milestones[r][0];
    var commitment = milestones_sheet
      .getRange(r + 2, personCol).getValue();
    if (commitment != "")
      insert_milestone(person, ms, commitment);
  }
}

var milestones_num = 0;
function insert_milestone(person, milestone, commitment) {
  milestones_num += 1;
  var milestone_row = milestones_num + 2;
  style_milestone(milestone_row);

  commitment_sheet.getRange(milestone_row, 1).setValue(milestone);
}

function style_milestone(milestone_row) {
  // Milestone name background color: light green 3
  // See https://yagisanatode.com/2019/08/06/google-apps-script-hexadecimal-color-codes-for-google-docs-sheets-and-slides-standart-palette/
  commitment_sheet.getRange(milestone_row, 1).setBackground("#d9ead3");

  // Borders
  commitment_sheet.getRange(milestone_row, 1, 1, 6)
    .setBorder(true, true, true, true, true, true);

  // Time frames bg color: light yellow 3
  commitment_sheet.getRange(milestone_row, 2, 1, 5)
    .setBackground("#fff2cc");
}
