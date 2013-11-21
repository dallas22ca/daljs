$(function() {
  $("template").hide();
  Dal.init();
  Dal.create({ model: "Contact", name: "Melanie", birthday: "September 5, 1988" });
  Dal.create({ model: "Contact", name: "Reanna", birthday: "April 22, 1987" });
});

$(document).on({
  blur: function() {
    var modeller = $(this).closest("[_id]");
    var id = modeller.attr("_id");
    var model = modeller.attr("model");
    var attr = $(this).attr("editable");
    var obj = _.findWhere(Dal.db.collections[model], { _id: id });
    
    if (obj.user_id == Dal.currentUser._id) {
      obj[attr] = $(this).text();
      Dal.sync(obj);
    } else {
      $(this).text($(this).attr("initial-content"));
      Dal.log("You are not authorized to edit this " + model + " (" + id + ").")
    }
  },
  click: function() {
    $(this).attr("initial-content", $(this).text());
    $(this).attr("contenteditable", true);
  }
}, "[editable]");

$(document).on("click", "[show]", function() {
  var link = $(this);
  var shows = $(this).attr("show").split("|");
  var guessed_model = $(this).closest("[_id]");
  var id = guessed_model.attr("_id");
  
  $.each(shows, function(index, value){
    value = $.trim(value);
    var show = value.split(" at ");
    var template = $.trim(show[0]);
    var template_model = template.split(" ")[0];
    var at = $.trim(show[1]);
    var obj = Dal.db.find(template_model, id);
    
    if (!obj) {
      var related_model = guessed_model.attr("model")
      var related = Dal.db.find(related_model, id);
      
      if (related) {
        var related_field = template_model.toLowerCase() + "_id";
        var obj_id = related[related_field];
        var obj = Dal.db.find(template_model, obj_id);
      }
    }
    
    if (!obj) { var obj = {}; }
    Dal.useTemplate($(at), template, obj, "replaceContent");
  });
  
  return false;
});

$(document).on("submit", "[for]", function() {
  var form = $(this);
  var obj = {};
  var model = $(this).attr("for");
  var address = $(this).attr("email");
  var email_template = $(this).attr("email-template");
  
  $(this).find("[name]").each(function() {
    var name = $(this).attr("name").toLowerCase();
    var val = $(this).val();
    
    if (val != "") {
      obj[name] = val;
    }
  });
  
  $.each(Dal.models[model].belongs_to, function(index, value) {
    var relationship_model = value.toLowerCase() + "_id";
    var relationship_id = form.parents("[model='" + value + "'][_id]").attr("_id")
    obj[relationship_model] = relationship_id;
    Dal.log("Added " + value + " (" + relationship_id + ") to " + model + ".");
  });
  
  if (!$.isEmptyObject(obj)) {
    obj.model = model;
    Dal.create(obj);
    if (address) { Dal.email(address, email_template, obj); }
    $(this)[0].reset();
    $(this).find("[refocus]").focus();
  }
  return false;
});