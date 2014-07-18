var Dal = {
  models: {},
  debug: true,
  
  create: function(obj) {
    obj.temp_id = Dal.uuid();
    if (obj.model != "User") { obj.user_id = Dal.currentUser._id; }
    
    if (Dal.db.connection == "localStorage") {
      obj._id = obj.temp_id;
      $.each(obj, function(key, value){
        localStorage[obj.model + "." + obj._id] = JSON.stringify(obj);
      });
    } else {
      obj._id = obj.temp_id;
      Dal.db.collections[obj.model].push(obj);
    }
    
    Dal.log("Created " + obj.model + " (" + obj._id + ").");
    obj = Dal.db.find(obj.model, { _id: obj._id });
    Dal.update(obj);
    return obj;
  },
  
  update: function(obj) {
    var el = $("[_id='" + obj._id + "']");
    if (el.length) {
      el.each(function(){
        var template_name = $(this).attr("from_template");
        Dal.useTemplate($(this), template_name, obj, "replace");
      });
    } else {
      var collection = Dal.pluralize(obj.model);
      
      $("[collection='" + collection + "']").each(function() {
        if (!$(this).attr("belongs_to") && !$(this).parents("daltemplate").length) {
          var template_name = $(this).attr("template");
          if (!template_name) { template_name = obj.model; }
          Dal.useTemplate($(this), template_name, obj, "add"); 
        } 
      });
      
      $.each(Dal.models[obj.model].belongs_to, function(index, value) {
        var belongs_to_field = value.toLowerCase() + "_id";
        var belongs_to_model = value;
        
        $("[collection='" + collection + "'][belongs_to='" + value + ":" + obj[belongs_to_field] + "']").each(function() {
          if (!$(this).parents("daltemplate").length) {
            var template_name = $(this).attr("template");
            if (!template_name) { template_name = obj.model; }
            Dal.useTemplate($(this), template_name, obj, "add"); 
          }
        });
      });
    }
  },
  
  email: function(address, email_template, obj) {
    var content = Dal.useTemplate(null, email_template, obj);
    var msg = "Sent mail to " + address + ".";
    Dal.log(msg);
  },
  
  useTemplate: function(placer, name, obj, strategy) {
    var clone = $("daltemplate[name='" + name + "']").clone();
    var wrapper = $("<div />").html(clone.html());
    var first_child = wrapper.find(":first");
    
    first_child.attr("_id", obj._id);
    first_child.attr("model", obj.model);
    first_child.attr("from_template", name);
    first_child.attr("last_updated", (new Date).getTime());
    
    var html = $("<div />").html(Mustache.render(wrapper.html(), obj));
    
    html.find("[collection]").each(function(){
      var collection = $(this);
      var model = collection.attr("collection");
      $(this).attr("belongs_to", obj.model + ":" + obj._id);
      $.each(obj[model], function(index, value){
        Dal.useTemplate(collection, value.model, value, "add");
      });
    })
    
    if (strategy == "replaceContent") {
      placer.html(html.html());
    } else if (strategy == "add") {
      var sort = "asc";
      if (placer.attr("sort")) { sort = placer.attr("sort"); }
      
      if (sort == "desc") {
        placer.prepend(html.html());
      } else {
        placer.append(html.html());
      }
    } else if (strategy == "replace") {
      placer.replaceWith(html.html());
    }
    
    Dal.log("Rendered " + name + " with " + strategy + ".");
    
    return html.html();
  },
  
  findModels: function() {
    Dal.models["User"] = { name: "User", belongs_to: [], read: "self", write: "self" };
    Dal.db.collections["User"] = [];
    
    $("[collection]").each(function() {
      var model = { name: Dal.singularize($(this).attr("collection")) }
      var template = $(this).closest("daltemplate");
      model.belongs_to = [];
      model.has_many = [];
      
      
      if (!$(this).attr("template")) { $(this).attr("template", model.name); }
      if ($(this).attr("belongs-to")) { model.belongs_to = $(this).attr("belongs-to").split("|"); }
      if ($(this).attr("read")) { model.read = $(this).attr("read"); }
      if ($(this).attr("write")) { model.write = $(this).attr("write"); }

      if (template.length) {
        if (template.attr("name")) {
          model.belongs_to.push(template.attr("name").split(" ")[0]);  
        }
      }
      
      if (typeof Dal.models[model.name] !== "undefined") {
        model.belongs_to = _.uniq(Dal.models[model.name].belongs_to.concat(model.belongs_to));
        $.extend(Dal.models[model.name], model);
      } else {
        Dal.models[model.name] = model;
        
        if (Dal.db.connection == "localStorage") {
          
        } else {
          Dal.db.collections[model.name] = [];
        }
      }
    });
    
    $("daltemplate").each(function() {
      var model = $(this).attr("name").split(" ")[0]
      
      $(this).find("[collection]").each(function() {
        Dal.models[model].has_many.push($(this).attr("collection"));
      });
    });
  },
  
  loadData: function() {
    alert("hi")
  },
  
  setCurrentUser: function() {
    var user = Dal.db.find("User", { _id: $.cookie("user_id") });
    
    if (!user) {
      user = Dal.create({
        model: "User",
        name: "Dallas", 
        email: "dallas@excitecreative.ca"
      });
      $.cookie("user_id", user._id, { expires: 7, path: '/' });
    }
    
    Dal.currentUser = user;
    
    return user;
  },
  
  init: function() {
    Dal.db.connect();
    Dal.findModels();
    Dal.setCurrentUser();
    Dal.startupTemplates();
    $("#dal_loading").fadeOut();
  },
  
  startupTemplates: function() {
    $("[startup]").each(function(){
      var template = $(this).attr("startup");
      Dal.useTemplate($(this), template, {}, "replaceContent");
    });
  },
  
  log: function(data) {
    if (Dal.debug) { console.log(data); }
  },
  
  singularize: function(str) {
    return str.substring(0, str.length - 1);
  },
  
  pluralize: function(str) {
    return str + "s";
  },
  
  uuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  }
}

Dal.db = {
  collections: {},
  connect: function() {
    if ('localStorage' in window && window['localStorage'] !== null) {
      Dal.db.connection = "localStorage";
    } else {
      Dal.db.connection = "JS";
    }
    Dal.log("Using " + Dal.db.connection + " as storage.")
  },
  
  find: function(model, args) {
    if (Dal.db.connection == "localStorage") {
      if (args._id) {
        var obj = JSON.parse(localStorage[model + "." + args._id]);
      }
    } else {
      var obj = _.findWhere(Dal.db.collections[model], args);
    }
    
    if (obj) {
      Dal.log("Found " + obj.model + " (" + obj._id + ").");
      if (obj.user_id) { obj.user = Dal.db.find("User", { _id: obj.user_id }); }

      $.each(Dal.models[obj.model].belongs_to, function(index, value) {
        lowered_value = value.toLowerCase()
        var lowered_id = obj[lowered_value + "_id"];
        if (lowered_id) {
          obj[lowered_value] = Dal.db.find(value, { _id: lowered_id });
        }
      });
      
      var dal_model = Dal.models[obj.model];
      if ($.type(dal_model.has_many) == "array") {
        $.each(dal_model.has_many, function(index, value) {
        
          var args = {};
          args[obj.model.toLowerCase() + "_id"] = obj._id
          obj[value] = Dal.db.where(Dal.singularize(value), args);
        });
      }
    }
    
    return obj;
  },
  
  where: function(model, args) {
    if (Dal.db.connection == "localStorage") {
      var objs = [];
      Object.keys(localStorage).forEach(function(key, index){
        var namespace = new RegExp(model + ".")
        if (namespace.test(key)) {
          var obj = JSON.parse(localStorage[key]);
          if (obj) { objs.push(obj); }
        }
      });
    } else {
      var objs = _.where(Dal.db.collections[model], args)
    }
    return objs;
  }
}