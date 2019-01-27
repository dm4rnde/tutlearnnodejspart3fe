// ********************

// DOM Ready **********
$(document).ready(function() {

  populatePlanetsList();
  attachPlanetFormResponses();
  
  attachMoonFormResponses();
  
  attachOnEnterOnAnyFieldPostImmediatelyBehaviorToForms();
  
});

// Functions ***********

function attachOnEnterOnAnyFieldPostImmediatelyBehaviorToForms() {

  // Planets 
  $('#planets-area-add-planet-section fieldset input').keydown(function(event) {
    if (event.which == 13) {
      $('#planets-area-add-planet-section fieldset button#btnPlAdd').click();
      event.preventDefault();
    }
  });

  $('#planets-area-edit-planet-section fieldset input').keydown(function(event) {
    if (event.which == 13) {
      $('#planets-area-edit-planet-section fieldset button#btnPlEditSave').click();
      event.preventDefault();
    }
  });
  
  // Moons
  $('#moons-area-add-moon-section fieldset input').keydown(function(event) {
    if (event.which == 13) {
      $('#moons-area-add-moon-section fieldset button#btnMnAdd').click();
      event.preventDefault();
    }
  });

  $('#moons-area-edit-moon-section fieldset input').keydown(function(event) {
    if (event.which == 13) {
      $('#moons-area-edit-moon-section fieldset button#btnMnEditSave').click();
      event.preventDefault();
    }
  });

};

function attachMoonFormResponses() {
  $('#btnMnAdd').on('click', addMn);
};

function addMn(event){

  event.preventDefault();

  if($('#moons-area-add-moon-section input#inputMnName').val().trim() === '') {
    // If certain that required field is empty, then simply reject
    return false;
  }
  
  var newMon;
  var inputMnDiamMissingValue = ($('#moons-area-add-moon-section fieldset input#inputMnDiam').val().trim() === '');
  var inputMnDiscovByMissingValue = ($('#moons-area-add-moon-section fieldset input#inputMnDiscovBy').val().trim() === '');

  if(inputMnDiamMissingValue && inputMnDiscovByMissingValue) {
    newMon = {
        'name': $('#moons-area-add-moon-section fieldset input#inputMnName').val().trim()
    };
  } else if(inputMnDiamMissingValue){
    newMon = {
        'name': $('#moons-area-add-moon-section fieldset input#inputMnName').val().trim(),
        'discoveredBy': $('#moons-area-add-moon-section fieldset input#inputMnDiscovBy').val().trim()
    };
  } else if(inputMnDiscovByMissingValue){
    newMon = {
        'name': $('#moons-area-add-moon-section fieldset input#inputMnName').val().trim(),
        'diam': $('#moons-area-add-moon-section fieldset input#inputMnDiam').val().trim()
    };
  } else {
    newMon = {
        'name': $('#moons-area-add-moon-section fieldset input#inputMnName').val().trim(),
        'diam': $('#moons-area-add-moon-section fieldset input#inputMnDiam').val().trim(),
        'discoveredBy': $('#moons-area-add-moon-section fieldset input#inputMnDiscovBy').val().trim()
    };    
  }
  
  var currPlntID = $('.currSelectedPlt').attr('rel');
  
  $.ajax({
    url: '/planets/' + currPlntID + '/moons',
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(newMon),
    contentType: 'application/json; charset=utf-8',
    complete: function(xhr, textStatus) {
      if(xhr.status===201) {
        // Clear the form
        $('#moons-area-add-moon-section fieldset input').val('');
        // Refresh - show up-to-date data
        populateMoonsOfCurrentlySelectedPlanet();
      }
    } 
  });
  
};

function attachPlanetFormResponses() {
  $('#btnPlAdd').on('click', addPl);
};

function addPl(event){

  event.preventDefault();

  if($('#planets-area-add-planet-section input#inputPlName').val().trim() === '') {
    // If certain that required field is empty, then simply reject
    return false;
  }
  var newPlnt = {
    'name': $('#planets-area-add-planet-section fieldset input#inputPlName').val().trim()
  }

  $.ajax({
    url: '/planets',
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(newPlnt),
    contentType: 'application/json; charset=utf-8',
    complete: function(xhr, textStatus) {
      if(xhr.status===201) {
        // Clear the form
        $('#planets-area-add-planet-section fieldset input').val('');
        // Refresh - show up-to-date data
        populatePlanetsList();
      }
    } 
  });
  
};

// Fill table with data
function populatePlanetsList() {

  // Empty content string
  var listContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/planets', function( data ) {

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      listContent += '<li class="linktorevealallmoonsofplanet removeLinkDecoration" rel="' + this._id + '">';
      listContent += '<span class="nameOfPl">' + this.name + '</span> ';
      listContent += '<a class="linktoeditplanet removeLinkDecoration specialAction" rel="' + this._id + '">edit</a> ';
      listContent += '<a class="linktodeleteplanet removeLinkDecoration specialAction" rel="' + this._id + '">del</a>';
      listContent += '</li>';
    });

    // Inject the whole content string into our existing HTML table
    $('#planetsList ul').html(listContent);
    
    // Clear the moons table (refresh)
    $('#moonsList table tbody').html('<tr></tr>');
    $('#moons-area').addClass('initialhide');
    $('#moons-area-add-moon-section').addClass('initialhide');
    
    $('.linktorevealallmoonsofplanet').on('click', populateMoonsOfCurrentlySelectedPlanet);
  
    // Here, must call off() before on(), as to avoid 
    // multiple triggering/firing of click events (to 
    // not allow to call related method many times on 
    // one and same click)
    $('#planetsList').off().on('click', 'ul li a.linktodeleteplanet', deleteAPlanet);
    // Now because of the off() have to use different
    // signature with sibling (otherwise one of them will 
    // not function).
    $('#planetsList ul').off().on('click', 'li a.linktoeditplanet', fillFormForAPlanetEdit);

  });
  
};

function populateMoonsOfCurrentlySelectedPlanet() {

  // When working with moons, means that 
  // planet can not have edit active; in case 
  // edit in progress but user goes to doing 
  // else, then just reset planed add/edit area.
  plnEditCancel();
  // Similar also for moons edit
  mnEditCancel();

  // Empty content string
  var tableContent = '';
  
  var pID = $(this).attr('rel');

  // decide if call comes from 'planets list'
  // or it is only about refreshing
  if(typeof(pID) != 'undefined') {
    // new 'planet' was selected

    // Mark new 'planet' in list as selected
    // (but before that remove any previous selections)
    $('.currSelectedPlt').each(function() {
        $(this).removeClass('currSelectedPlt');
    });
    $(this).addClass('currSelectedPlt');
  } else {
    // do refresh based on currSelectedPlt only
    pID = $('.currSelectedPlt').attr('rel');
  }
  
  
  // jQuery AJAX call for JSON
  $.getJSON( '/planets/' + pID + '/moons', function( data ) {
  
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td class="nameOfMoon">' + this.name + '</td>';
      if (typeof(this.diam) != 'undefined') {
        tableContent += '<td class="diamOfMoon">' + this.diam + '</td>';
      } else {
        tableContent += '<td class="diamOfMoon"></td>';
      }
      if (typeof(this.discoveredBy) != 'undefined') {
        tableContent += '<td class="discoveredByOfMoon">' + this.discoveredBy + '</td>';
      } else {
        tableContent += '<td class="discoveredByOfMoon"></td>';
      }
      tableContent += '<td><a class="linktoeditmoon removeLinkDecoration specialAction" rel="' + this._id + '">edit</a> ';
      tableContent += '<a class="linktodeletemoon removeLinkDecoration specialAction" rel="' + this._id + '">del</a></td>';
      tableContent += '</tr>';
    });
  
    var noItems = (tableContent === '');
    if(noItems){
      $('#moons-area').removeClass('initialhide');
      $('#moons-area-moons-tbl').addClass('initialhide');
      $('#moons-area-add-moon-section').removeClass('initialhide');
    } else {
      $('#moons-area').removeClass('initialhide');
      $('#moons-area-moons-tbl').removeClass('initialhide');
      $('#moons-area-add-moon-section').removeClass('initialhide');
    }
  
    // Inject the whole content string into our existing HTML table
    $('#moonsList table tbody').html(tableContent);

    // Here, must call off() before on(), as to avoid 
    // multiple triggering/firing of click events (to 
    // not allow to call related method many times on 
    // one and same click)
    $('#moonsList #moons-area-moons-tbl tbody').off().on('click', 'td a.linktodeletemoon', deleteAMoon);
    // Now because of the off() have to use different
    // signature with sibling (otherwise one of them will 
    // not function).
    $('#moonsList #moons-area-moons-tbl tbody td').off().on('click', 'a.linktoeditmoon', fillFormForAMoonEdit);
   
  });
  
};

function deleteAMoon(event) {
  
  var mID = $(this).attr('rel');
  
  $.ajax({
    url: '/moons/' + mID,
    type: 'DELETE',
    // success: function(result) {
    //   console.log('success');
    //   console.log(result);
    // },
    complete: function(xhr, textStatus) {
      if(xhr.status===204) {
        // Refresh - show up-to-date data
        populateMoonsOfCurrentlySelectedPlanet();
      }
    } 
  });

};

function deleteAPlanet(event) {
  
  var pID = $(this).attr('rel');
  
  $.ajax({
    url: '/planets/' + pID,
    type: 'DELETE',
    complete: function(xhr, textStatus) {
      if(xhr.status===204) {
        // Refresh - show up-to-date data
        populatePlanetsList();
      }
    } 
  });

};

function fillFormForAPlanetEdit(event) {

  // Cautious reset 
  plnEditCancel();
  
  var nameOfPl = $('li.currSelectedPlt span.nameOfPl').text();
  
  $('#planets-area-edit-planet-section').removeClass('initialhide');
  $('#planets-area-add-planet-section').addClass('initialhide');

  $('#planets-area-edit-planet-section input#inputPlName').val(nameOfPl);
  
  $('#btnPlEditSave').on('click', plnEditSave);
  $('#btnPlEditCancel').on('click', plnEditCancel);

};

function plnEditCancel(event) {

  // Clear the form
  $('#planets-area-edit-planet-section fieldset input').val('');

  $('#planets-area-edit-planet-section').addClass('initialhide');
  $('#planets-area-add-planet-section').removeClass('initialhide');
  
};

function plnEditSave(event) {

  var currPlntID = $('.currSelectedPlt').attr('rel');

  if($('#planets-area-edit-planet-section input#inputPlName').val().trim() === '') {
    // If certain that required field is empty, then simply reject
    return false;
  }
  var editedPlnt = {
    'name': $('#planets-area-edit-planet-section fieldset input#inputPlName').val().trim()
  }

  $.ajax({
    url: '/planets/' + currPlntID,
    type: 'PUT',
    dataType: 'json',
    data: JSON.stringify(editedPlnt),
    contentType: 'application/json; charset=utf-8',
    complete: function(xhr, textStatus) {
      if(xhr.status===200) {
        // Clear the form
        $('#planets-area-edit-planet-section fieldset input').val('');

        $('#planets-area-edit-planet-section').addClass('initialhide');
        $('#planets-area-add-planet-section').removeClass('initialhide');
        
        // Refresh - show up-to-date data
        populatePlanetsList();
      }
    } 
  });
  
};

function fillFormForAMoonEdit(event) {
  
  // Cautious reset 
  mnEditCancel();
  // Cautious reset 
  plnEditCancel();
  
  var mID = $(this).attr('rel');

  // Mark new 'moon' in list as selected
  // (but before that remove any previous selections)
  $('.currSelectedMn').each(function() {
      $(this).removeClass('currSelectedMn');
  });
  $(this).addClass('currSelectedMn');

  $('.currSelectedMnParentStyle').each(function() {
      $(this).removeClass('currSelectedMnParentStyle');
  });
  $(this).parent().parent().addClass('currSelectedMnParentStyle');

  var nameOfMn = $(this).parent().parent().find('td.nameOfMoon').text();
  var diamOfMn = $(this).parent().parent().find('td.diamOfMoon').text();
  var discoveredByOfMn = $(this).parent().parent().find('td.discoveredByOfMoon').text();
  
  $('#moons-area-edit-moon-section').removeClass('initialhide');
  $('#moons-area-add-moon-section').addClass('initialhide');
  
  $('#moons-area-edit-moon-section input#inputMnName').val(nameOfMn);
  $('#moons-area-edit-moon-section input#inputMnDiam').val(diamOfMn);
  $('#moons-area-edit-moon-section input#inputMnDiscovBy').val(discoveredByOfMn);
   
  $('#btnMnEditSave').on('click', mnEditSave);
  $('#btnMnEditCancel').on('click', mnEditCancel);

};

function mnEditCancel(event) {

  // Clear the form
  $('#moons-area-edit-moon-section fieldset input').val('');

  $('#moons-area-edit-moon-section').addClass('initialhide');
  $('#moons-area-add-moon-section').removeClass('initialhide');

  // Cancel also selection and 
  // any styling that needs to follow 
  $('.currSelectedMn').each(function() {
      $(this).removeClass('currSelectedMn');
  });
  $(this).addClass('currSelectedMn');

  $('.currSelectedMnParentStyle').each(function() {
      $(this).removeClass('currSelectedMnParentStyle');
  });
  $(this).parent().parent().addClass('currSelectedMnParentStyle');
  
};

function mnEditSave(event) {

  var currMnID = $('.currSelectedMn').attr('rel');

  if($('#moons-area-edit-moon-section input#inputMnName').val().trim() === '') {
    // If certain that required field is empty, then simply reject
    return false;
  }
  
  var editedMon;
  var inputMnDiamMissingValue = ($('#moons-area-edit-moon-section fieldset input#inputMnDiam').val().trim() === '');
  var inputMnDiscovByMissingValue = ($('#moons-area-edit-moon-section fieldset input#inputMnDiscovBy').val().trim() === '');

  if(inputMnDiamMissingValue && inputMnDiscovByMissingValue) {
    editedMon = {
        'name': $('#moons-area-edit-moon-section fieldset input#inputMnName').val().trim()
    };
  } else if(inputMnDiamMissingValue){
    editedMon = {
        'name': $('#moons-area-edit-moon-section fieldset input#inputMnName').val().trim(),
        'discoveredBy': $('#moons-area-edit-moon-section fieldset input#inputMnDiscovBy').val().trim()
    };
  } else if(inputMnDiscovByMissingValue){
    editedMon = {
        'name': $('#moons-area-edit-moon-section fieldset input#inputMnName').val().trim(),
        'diam': $('#moons-area-edit-moon-section fieldset input#inputMnDiam').val().trim()
    };
  } else {
    editedMon = {
        'name': $('#moons-area-edit-moon-section fieldset input#inputMnName').val().trim(),
        'diam': $('#moons-area-edit-moon-section fieldset input#inputMnDiam').val().trim(),
        'discoveredBy': $('#moons-area-edit-moon-section fieldset input#inputMnDiscovBy').val().trim()
    };
  }
  
  $.ajax({
    url: '/moons/' + currMnID,
    type: 'PUT',
    dataType: 'json',
    data: JSON.stringify(editedMon),
    contentType: 'application/json; charset=utf-8',
    complete: function(xhr, textStatus) {
      //console.log(textStatus);
      if(xhr.status===200) {
        // Clear the form
        $('#moons-area-edit-moon-section fieldset input').val('');

        $('#moons-area-edit-moon-section').addClass('initialhide');
        $('#moons-area-add-moon-section').removeClass('initialhide');
        
        // Refresh - show up-to-date data
        populateMoonsOfCurrentlySelectedPlanet();
      }
    } 
  });

};