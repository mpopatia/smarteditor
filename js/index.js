var advancedEditor
var curr_sentence = ""
var curr_word = ""

var SHOW = 25;

var start_index = 0
var end_index = 0

_ = Quill.require('lodash');
// Change this
var countries = new Array("Afghanistan", "Albania", "Algeria", "American Samoa", "Angola", "Anguilla", "Antartica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Ashmore and Cartier Island", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Clipperton Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czeck Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Europa Island", "Falkland Islands (Islas Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern and Antarctic Lands", "Gabon", "Gambia, The", "Gaza Strip", "Georgia", "Germany", "Ghana", "Gibraltar", "Glorioso Islands", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See (Vatican City)", "Honduras", "Hong Kong", "Howland Island", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Ireland, Northern", "Israel", "Italy", "Jamaica", "Jan Mayen", "Japan", "Jarvis Island", "Jersey", "Johnston Atoll", "Jordan", "Juan de Nova Island", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Man, Isle of", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Midway Islands", "Moldova", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcaim Islands", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romainia", "Russia", "Rwanda", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Scotland", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and South Sandwich Islands", "Spain", "Spratly Islands", "Sri Lanka", "Sudan", "Suriname", "Svalbard", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Tobago", "Toga", "Tokelau", "Tonga", "Trinidad", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "USA", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands", "Wales", "Wallis and Futuna", "West Bank", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe");

advancedEditor = new Quill('.advanced-wrapper .editor-container', {
  modules: {
    'authorship': {
      authorId: 'advanced',
      enabled: true
    },
    'toolbar': {
      container: '.advanced-wrapper .toolbar-container'
    },
    'link-tooltip': true,
    'image-tooltip': true,
    'multi-cursor': false
  },
  styles: false,
  theme: 'snow'
});

function show_dialogue(type, list) {
  $("#type").html(type);
  $("#adjectives").html(JSON.stringify(list));
}

function getAllFull(word){
  var area = $(".preview");
  var dict = {};
  var both = {};
  area.empty();
  $.get("http://words.bighugelabs.com/api/2/##################################/"+word+"/json",
    {},
    function(data){
      for (var index in data){
        var both = {};
        var syns = [];
        var ants = [];
        var type = data[index];
        both["syns"] = syns;
        both["ants"] = ants;
        dict[index] = both;
        for (var num in type){
          if (num == "syn"){
            syns.push(type[num]);
          }
          if (num == "ant"){  
            ants.push(type[num]);
          }
          both["syns"] = syns;
          both["ants"] = ants;
          dict[index] = both;
        }
        $('#testpopover').attr("data-content", "Put Data here");
        $('#testpopover').popover('show');
      }
      // Done processing the dict
      if (("adjective" in dict) || ("noun" in dict) || ("verb" in dict)) {
        $("#loading").css('display', 'none');
        $("#keyword").html('<h4><b>' + word + "</b></h4>");
      }

      if ("adjective" in dict) {
        $("#adjectives").css('display', 'block');
        if ("syns" in dict["adjective"]) {
          if (dict["adjective"]["syns"].length > 0) {
            $("#adj-syns").css('display', 'block');
            var tmp = ""
            for (i=0; i<SHOW; i++) {
              if (i < dict["adjective"]["syns"][0].length) {
                tmp = tmp + "<a href=# onclick='swapper(" + '"' + dict["adjective"]["syns"][0][i] + '"' + ")'>" + dict["adjective"]["syns"][0][i] + "</a>";
                tmp = tmp + ", "
              } else {
                break;
              }
            }
            $("#adj-syns").html("<h6 style='font-style:italic;'>synonyms.</h6>" + tmp);
          }
        }
        if ("ants" in dict["adjective"]) {
          if (dict["adjective"]["ants"].length > 0) {
            $("#adj-ants").css('display', 'block');
            var tmp = ""
            for (i=0; i<SHOW; i++) {
              if (i < dict["adjective"]["ants"][0].length) {
                tmp = tmp + "<a href=# onclick='swapper(" + '"' + dict["adjective"]["ants"][0][i] + '"' + ")'>" + dict["adjective"]["ants"][0][i] + "</a>";
                tmp = tmp + ", "
              } else {
                break;
              }
            }
            $("#adj-ants").html("<h6 style='font-style:italic;'>antonyms.</h6>" + tmp);
          }
        }
      }
      if ("noun" in dict) {
        $("#nouns").css('display', 'block');
        if ("syns" in dict["noun"]) {
          if (dict["noun"]["syns"].length > 0) {
            $("#nouns-syns").css('display', 'block');
            var tmp = ""
            for (i=0; i<SHOW; i++) {
              if (i < dict["noun"]["syns"][0].length) {
                tmp = tmp + "<a href=# onclick='swapper(" + '"' + dict["noun"]["syns"][0][i] + '"' + ")'>" + dict["noun"]["syns"][0][i] + "</a>";
                tmp = tmp + ", "
              } else {
                break;
              }
            }
            $("#nouns-syns").html("<h6 style='font-style:italic;'>synonyms.</h6>" + tmp);
          }
        }
        if ("ants" in dict["noun"]) {
          if (dict["noun"]["ants"].length > 0) {
            $("#nouns-ants").css('display', 'block');
            var tmp = ""
            for (i=0; i<SHOW; i++) {
              if (i < dict["noun"]["ants"][0].length) {
                tmp = tmp + "<a href=# onclick='swapper(" + '"' + dict["noun"]["ants"][0][i] + '"' + ")'>" + dict["noun"]["ants"][0][i] + "</a>";
                tmp = tmp + ", "
              } else {
                break;
              }
            }
            $("#nouns-ants").html("<h6 style='font-style:italic;'>antonyms.</h6>" + tmp);
          }
        }
      }
      if ("verb" in dict) {
        $("#verbs").css('display', 'block');
        if ("syns" in dict["verb"]) {
          if (dict["verb"]["syns"].length > 0) {
            $("#verbs-syns").css('display', 'block');
            var tmp = ""
            for (i=0; i<SHOW; i++) {
              if (i < dict["verb"]["syns"][0].length) {
                tmp = tmp + "<a href=# onclick='swapper(" + '"' + dict["verb"]["syns"][0][i] + '"' + ")'>" + dict["verb"]["syns"][0][i] + "</a>";
                tmp = tmp + ", "
              } else {
                break;
              }
            }
            $("#verbs-syns").html("<h6 style='font-style:italic;'>synonyms.</h6>" + tmp);
          }
        }
        if ("ants" in dict["verb"]) {
          if (dict["verb"]["ants"].length > 0) {
            $("#verbs-ants").css('display', 'block');
            var tmp = ""
            for (i=0; i<SHOW; i++) {
              if (i < dict["verb"]["ants"][0].length) {
                tmp = tmp + "<a href=# onclick='swapper(" + '"' + dict["verb"]["ants"][0][i] + '"' + ")'>" + dict["verb"]["ants"][0][i] + "</a>";
                tmp = tmp + ", "
              } else {
                break;
              }
            }
            $("#verbs-ants").html("<h6 style='font-style:italic;'>antonyms.</h6>" + tmp);
          }
        }
      }

      $("#loading").css('display', 'none');
    },
    "json");
}

function swapper(word) {

  var text = advancedEditor.getText();
  advancedEditor.deleteText(start_index, end_index);
  advancedEditor.insertText(start_index, word);

}
function parseWord(word){

  // clearing out div
  $("#adj-syns").html('');
  $("#adj-ants").html('');
  $("#adjectives").css('display', 'none');
  $("#nouns-syns").html('');
  $("#nouns-ants").html('');
  $("#nouns").css('display', 'none');
  $("#verbs-syns").html('');
  $("#verbs-ants").html('');
  $("#verbs").css('display', 'none');
  $("#googled").html('');
  $("#keyword").html('');

  if (word[(word.length-1)] == "." || word[(word.length-1)] == "," || word[(word.length-1)] == "?" || word[(word.length-1)] == "!") {
    word = word.substring(0, word.length - 1);
    end_index = end_index -1;
  }


  if (word != "\n" && word != " " && word != "") {
    $("#loading").css('display', 'block');
    var upperCase = false;
    var first = word.slice(0,1);
    if (first == first.toUpperCase()){
      upperCase = true;
      if (countries.indexOf(word) >= 0){
        google_country(word);
      }
      else{
        google_search(word);
      }
    }
    else{
      getAllFull(word);
    }
  }
}


var naiveReverse = function(string) {
    return string.split('').reverse();
}

function local_parser(input_text) {
  index = advancedEditor.getSelection();
  if (index["start"] == index["end"]) {
    if (index["start"]+1 == input_text.length) {
      var rev = naiveReverse(input_text);
      if (rev[1] == " ") {
        var i = 2;
      } else {
        var i = 1;
      }
      var tmp_word = "";
      start_index = index["start"]-1;
      end_index = index["end"]-1;
      for (i; i<rev.length; i++) {
        if (rev[i] != " ") {
          start_index--;
          tmp_word = tmp_word + rev[i];
        } else {
          break;
        }
      }
      if (tmp_word) {
        parseWord(naiveReverse(tmp_word).join(""));
      }
    } else {
      var local_text = advancedEditor.getText();
      var tmp_word = "";
      start_index = index["start"];
      end_index = index["start"];
      for (i=index["start"]-1; i>=0; i--) {
        if (local_text[i] != " ") {
          tmp_word = tmp_word + local_text[i];
          start_index--;
        } else {
          break;
        }
      }
      tmp_word = tmp_word.split('').reverse().join('');
      for (i=index["start"]; i<local_text.length; i++) {
        if (local_text[i] != " ") {
          tmp_word = tmp_word + local_text[i];
          end_index++;
        } else {
          break;
        }
      }
      parseWord(tmp_word);
    }
  }
}

advancedEditor.on('selection-change', function(range) {
  if (range != null) {
    local_parser(advancedEditor.getText);
  }
});

advancedEditor.on('text-change', function(delta, source) {


  if (delta['ops'].length == 1) {
    var addition = delta['ops'][0]["insert"].split("");
  } else {
    if ("insert" in delta["ops"][1]) {
      var addition = delta['ops'][1]["insert"].split("");
    } else {
      var addition = []
    }
  }

  for (i=0; i<addition.length; i++) {
    if (addition[i] == " ") {
      local_parser(advancedEditor.getText());
    }
  }
});


function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function google_country(term){
  var dict = {};
  term = term.toLowerCase();
  var search = "https://www.googleapis.com/freebase/v1/search?query="+term+"&";
  var topic = "https://www.googleapis.com/freebase/v1/topic/en/"+term+"?";
  $.get(
    topic+'key=##########################s&filter=/location/country/',
    {},
    function(data){
    for(var index in data["property"]){
      var len = index.length;
      var field = index.slice(18,len);
      if (field == "calling_code") {
            dict[field] = data["property"][index]["values"][0]["text"];
          } else if (field == "currency_used") {
            dict[field] = data["property"][index]["values"][0]["text"];
          } else if (field == "capital") {
            dict[field] = data["property"][index]["values"][0]["text"];
          } else if (field == "fifa_code") {
            dict[field] = data["property"][index]["values"][0]["text"];
          } else if (field == "form_of_government") {
            dict[field] = data["property"][index]["values"][0]["text"];
          } else if (field == "official_language") {
            dict[field] = data["property"][index]["values"][0]["text"];
          } else if (field == "national_anthem") {
            dict[field] = data["property"][index]["values"][0]["text"];
          }
    }
    // done processing
    $("#adj-syns").html('');
    $("#adj-ants").html('');
    $("#adjectives").css('display', 'none');
    $("#nouns-syns").html('');
    $("#nouns-ants").html('');
    $("#nouns").css('display', 'none');
    $("#verbs-syns").html('');
    $("#verbs-ants").html('');
    $("#verbs").css('display', 'none');
    $("#googled").html('');
    $("#keyword").html('');
    $("#loading").css('display', 'none');

    term = capitaliseFirstLetter(term);

    $("#keyword").html('<h4><b>' + term + "</b></h4><hr>");
    var tmp = ''
    for(var key in dict) {
      tmp = tmp + "<p>" + key + ":  " + dict[key] + "</p>";
    }
    $("#googled").html(tmp);
  });
}

function google_search(term){
  term = term.toLowerCase();
  var search = "https://www.googleapis.com/freebase/v1/search?query="+term+"&limit=1&";
  var topic = "https://www.googleapis.com/freebase/v1/topic/en/"+term+"?";
  $.get(
    search+'key=#######################################',
    {},
    function(data){
      var term = data["result"][0]["id"];
    var len = term.length;
    var name = term.slice(4,len);
    google_person(name);
  });
}

function google_person(term){
  var dict = {};
  term = term.toLowerCase();
  var search = "https://www.googleapis.com/freebase/v1/search?query="+term+"&";
  var topic = "https://www.googleapis.com/freebase/v1/topic/en/"+term+"?";
  $.get(
    topic+'key=###########################&filter=/people/person/',
    {},
    function(data){
    for(var index in data["property"]){
      var len = index.length;
      var field = index.slice(15,len);
      dict[field] = data["property"][index]["values"][0]["text"];
    }
    // done processing
    $("#adj-syns").html('');
    $("#adj-ants").html('');
    $("#adjectives").css('display', 'none');
    $("#nouns-syns").html('');
    $("#nouns-ants").html('');
    $("#nouns").css('display', 'none');
    $("#verbs-syns").html('');
    $("#verbs-ants").html('');
    $("#verbs").css('display', 'none');
    $("#googled").html('');
    $("#keyword").html('');
    $("#loading").css('display', 'none');

    term = term.split("");

    for(i=0; i<term.length; i++) {
      if (term[i] == "_") {
        term[i] = " ";
      }
    }

    term = term.join('')

    term = term.split(" ");
    for(i=0; i<term.length; i++) {
      term[i] = capitaliseFirstLetter(term[i]);
    }

    term = term.join(' ');

    $("#keyword").html('<h4><b>' + term + "</b></h4><hr>");
    var tmp = ''
    for(var key in dict) {
      tmp = tmp + "<p>" + key + ":  " + dict[key] + "</p>";
    }
    $("#googled").html(tmp);
  });
}

function clickTest(){
}

function copy(){
  var text = advancedEditor.getText();
  window.prompt("Press Ctrl+c to copy", text);
}