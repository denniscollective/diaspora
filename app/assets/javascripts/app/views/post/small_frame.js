//= require "../post_view"

app.views.Post.SmallFrame = app.views.Post.extend({
  className : "canvas-frame",

  templateName : "small-frame/default",  // default to fall back to

  events : {
    "click .info" : "goToPost"
  },

  subviews : {
    '.embed-frame' : "oEmbedView"
  },

  oEmbedView : function(){
    return new app.views.OEmbed({model : this.model})
  },

  smallFramePresenter : function(){
    //todo : we need to have something better for small frame text, probably using the headline() scenario.
    return _.extend(this.defaultPresenter(),
      {
        text : this.model && app.helpers.textFormatter(this.model.get("text"), this.model),
        likesCount : this.model.interactions.likesCount(),
        resharesCount : this.model.interactions.resharesCount(),
        commentsCount : this.model.interactions.commentsCount()
      })
  },

  initialize : function() {
    this.addStylingClasses()
  },

  postRenderTemplate : function() {
    this.addStylingClasses()
  },

  addStylingClasses : function() {
    this.$el.addClass([this.dimensionsClass(), this.colorClass(), this.frameClass()].join(' '))
  },

  frameClass : function(){
    var name = this.model.get("frame_name") || ""
    return name.toLowerCase()
  },

  colorClass : function() {
    var text = this.model.get("text")
      , baseClass = $.trim(text).length == 0 ? "no-text" : 'has-text';

    if(baseClass == "no-text" || this.model.get("photos").length > 0 || this.model.get("o_embed_cache")) { return baseClass }

    var randomColor = _.first(_.shuffle(['cyan', 'green', 'yellow', 'purple', 'lime-green', 'orange', 'red', 'turquoise', 'sand']));

    var textClass;
    if(text.length > 240) {
      textClass = "blog-text x2 width"
    } else if(text.length > 140) {
      textClass = randomColor
    } else if(text.length > 40) {
      textClass = randomColor
    } else {
      textClass =  "big-text " + randomColor
    }

    return [baseClass, textClass, "sticky-note"].join(" ")
  },

  dimensionsClass : function() {
    return (this.model.get("favorite")) ?  "x2 width height" : ""
  },

  goToPost : function(evt) {
    if(evt) { evt.stopImmediatePropagation(); }
    app.setPreload('post',this.model.attributes)
    app.router.navigate(this.model.url(), true)
  }
});
