/**
 * ============================================
 *  WEDDING RSVP — Google Apps Script
 * ============================================
 *
 *  SETUP INSTRUCTIONS:
 *
 *  1. Go to https://sheets.google.com and create a new spreadsheet
 *  2. Rename the first sheet tab to "RSVPs" (exactly)
 *  3. Add these headers in Row 1:
 *     A1: Timestamp
 *     B1: Name
 *     C1: Phone
 *     D1: Attending
 *     E1: Event
 *     F1: Guest Count
 *     G1: Guest Names
 *     H1: Message
 *     I1: Updated At
 *
 *  4. Click Extensions > Apps Script
 *  5. Delete everything in Code.gs and paste this ENTIRE file
 *  6. Click Deploy > New Deployment
 *  7. Select type: "Web app"
 *  8. Set "Execute as": Me
 *  9. Set "Who has access": Anyone
 * 10. Click Deploy and copy the Web App URL
 * 11. Paste that URL into your script.js where it says GOOGLE_SCRIPT_URL
 *
 *  HOW TO RESET SOMEONE'S RSVP:
 *  - Just delete their row from the Google Sheet
 *  - Next time they open the invitation, it will check the sheet,
 *    see they're gone, and let them RSVP again fresh
 *
 * ============================================
 */

// Handle POST requests (new RSVP or update)
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVPs');

    if (!sheet) {
      return response({ success: false, error: 'Sheet "RSVPs" not found' });
    }

    var phone = (data.phone || '').trim();
    if (!phone) {
      return response({ success: false, error: 'Phone number is required' });
    }

    // Handle delete action (redo RSVP)
    if (data.action === 'delete') {
      var deleteRow = findRowByPhone(sheet, phone);
      if (deleteRow > 0) {
        sheet.deleteRow(deleteRow);
        return response({ success: true, action: 'deleted' });
      }
      return response({ success: true, action: 'not_found' });
    }

    // Check if this phone number already exists
    var existingRow = findRowByPhone(sheet, phone);

    if (existingRow > 0) {
      // Update existing row (only editable fields: guest count, guest names, message)
      sheet.getRange(existingRow, 6).setValue(data.guestCount || '1');
      sheet.getRange(existingRow, 7).setValue((data.guestNames || []).join(', '));
      sheet.getRange(existingRow, 8).setValue(data.message || '');
      sheet.getRange(existingRow, 9).setValue(new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }));

      return response({ success: true, action: 'updated' });
    }

    // New RSVP — append row
    sheet.appendRow([
      new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }), // Timestamp
      data.name || '',
      phone,
      data.attending || '',
      data.event || '',
      data.guestCount || '1',
      (data.guestNames || []).join(', '),
      data.message || '',
      '' // Updated At (empty for new entries)
    ]);

    return response({ success: true, action: 'created' });

  } catch (err) {
    return response({ success: false, error: err.message });
  }
}

// Handle GET requests (check if phone already submitted)
function doGet(e) {
  try {
    var phone = (e.parameter.phone || '').trim();
    if (!phone) {
      return response({ exists: false });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVPs');
    if (!sheet) {
      return response({ exists: false, error: 'Sheet not found' });
    }

    var row = findRowByPhone(sheet, phone);
    if (row > 0) {
      var values = sheet.getRange(row, 1, 1, 9).getValues()[0];
      return response({
        exists: true,
        data: {
          name: values[1],
          phone: values[2],
          attending: values[3],
          event: values[4],
          guestCount: values[5].toString(),
          guestNames: values[6] ? values[6].split(', ') : [],
          message: values[7],
        }
      });
    }

    return response({ exists: false });

  } catch (err) {
    return response({ exists: false, error: err.message });
  }
}

// Find a row by phone number (column C)
function findRowByPhone(sheet, phone) {
  var data = sheet.getDataRange().getValues();
  var normalizedPhone = normalizePhone(phone);

  for (var i = 1; i < data.length; i++) {
    if (normalizePhone(data[i][2].toString()) === normalizedPhone) {
      return i + 1; // Sheets are 1-indexed
    }
  }
  return -1;
}

// Normalize phone numbers for comparison (strip spaces, dashes, etc.)
function normalizePhone(phone) {
  return phone.replace(/[\s\-\(\)\+]/g, '');
}

// Return JSON response
function response(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
