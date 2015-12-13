var ConnectFourView = function(gameModel, player1, player2, options) {
  this.CELL_SIZE = 60;

  options = options || {};
  this.game = gameModel;
  this.player1 = player1;
  this.player2 = player2;
  this.currentPlayer = this.player1;
  this.width = this.game.col * this.CELL_SIZE;
  this.height = this.game.row * this.CELL_SIZE;
  this.$gameElem = $(options.gameElem || '.game');
};

ConnectFourView.prototype.init = function() {
  $('.title').append('<h2>' + this.game.title + '</h2>');
  this.addPlayerStatus(this.player1);
  this.addPlayerStatus(this.player2);
  this.addBoard();
};

ConnectFourView.prototype.addPlayerStatus = function(player) {
  var $playerStatusElem = $('<div class="player-status player-' + player.id + '"></div>');
  var $vsElem = $('.status .versus');

  if (player.id == 1) {
    $playerStatusElem.append('<img class="avatar avatar-' + player.id + '" src="' + player.imgUrl + '" align="middle" />');
    $playerStatusElem.append('<span><i>' + player.name + '</i></span>');
    $vsElem.before($playerStatusElem);
  } else {
    $playerStatusElem.append('<span><i>' + player.name + '</i></span>');
    $playerStatusElem.append('<img class="avatar avatar-' + player.id + '" src="' + player.imgUrl + '" align="middle" />');
    $vsElem.after($playerStatusElem);
  }
};

ConnectFourView.prototype.addBoard = function() {
  this.$gameElem.css('width', this.width + 'px');
  this.$gameElem.css('height', this.height + 'px');

  this.$table = $('<table></table>');
  this.$gameElem.append(this.$table);

  for (var row = 0; row < this.game.row; ++row) {
    var $row = $('<tr></tr>');
    this.$table.append($row);
    for (var col = 0; col < this.game.col; ++col) {
      $row.append('<td></td>');
    }
  }
};
