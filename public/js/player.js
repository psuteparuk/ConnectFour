var Player = function(options) {
  if (!Player.id) Player.id = 0;
  options = options || {};
  this.id = ++Player.id;
  this.name = options.name || ('Player ' + this.id);
  this.imgUrl = options.imgUrl || '';
};
