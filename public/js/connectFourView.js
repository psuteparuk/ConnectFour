var ConnectFourView = function(model, options) {
  options = options || {};
  this.width = model.width;
  this.height = model.height;
  this.$targetElem = $(options.targetElem) || $('.content');
};

ConnectFourView.prototype.init = function() {
  this.$targetElem.css('width', this.width*60 + 'px');
  this.$targetElem.css('height', this.height*60 + 'px');
};
