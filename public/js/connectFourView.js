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
  this.$messageElem = $(options.messageElem || '.message');
};

ConnectFourView.prototype.init = function() {
  this.setTitle(this.game.title);
  this.addPlayerStatus(this.player1);
  this.addPlayerStatus(this.player2);
  this.setCurrentPlayer(this.player1);
  this.addBoard();

  $('.board td').mouseenter(function(e) {
    var targetCol = $(e.target).attr('class');
    $('.' + targetCol.replace(' ', '.')).addClass('hover');
  });
  $('.board td').mouseleave(function(e) {
    var targetCol = $(e.target).attr('class');
    $('.' + targetCol.replace(' ', '.')).removeClass('hover');
  });
  $('.board td').click(function(e) {
    if (!this.game.isActive) return;

    var targetCol = $(e.target).attr('class');
    var matchedClass = /col-(\d+)/g.exec(targetCol);
    if (!matchedClass) return;

    var colIndex = parseInt(matchedClass[1], 10);
    if (!this.addToken(colIndex, this.currentPlayer)) return;

    this.game.checkWinningState();
    this.switchPlayer();
  }.bind(this));
};

ConnectFourView.prototype.addPlayerStatus = function(player) {
  player.$playerStatusElem = $('<div class="player-status player-' + player.id + '"></div>');
  var $vsElem = $('.status .versus');
  var tokenTemplate = this.tokenTemplate(player);
  var nameTemplate = this.nameTemplate(player);

  if (player.id == 1) {
    player.$playerStatusElem.append(tokenTemplate);
    player.$playerStatusElem.append(nameTemplate);
    $vsElem.before(player.$playerStatusElem);
  } else {
    player.$playerStatusElem.append(nameTemplate);
    player.$playerStatusElem.append(tokenTemplate);
    $vsElem.after(player.$playerStatusElem);
  }

  // if (player.id === this.currentPlayer.id) player.$playerStatusElem.children('span').addClass('current');
};

ConnectFourView.prototype.addBoard = function() {
  this.$gameElem.css('width', this.width + 'px');
  this.$gameElem.css('height', this.height + 'px');

  var $table = $('<table class="board"></table>');
  this.$gameElem.append($table);

  for (var row = 0; row < this.game.row; ++row) {
    var $row = $('<tr></tr>');
    $table.append($row);
    for (var col = 0; col < this.game.col; ++col) {
      $row.append('<td class="col-' + col + '"></td>');
    }
  }
};

ConnectFourView.prototype.setTitle = function(title) {
  $('.title').html('<h2>' + title + '</h2>');
};

ConnectFourView.prototype.setCurrentPlayer = function(player) {
  this.currentPlayer = player;
  this.setMessage(player.name + "'s turn");
  $('.player-status span').removeClass('current');
  player.$playerStatusElem.children('span').addClass('current');
};

ConnectFourView.prototype.switchPlayer = function() {
  if (this.currentPlayer.id === 1) this.setCurrentPlayer(this.player2);
  else this.setCurrentPlayer(this.player1);
};

ConnectFourView.prototype.getMessage = function() {
  return this.$messageElem.html();
};

ConnectFourView.prototype.setMessage = function(message) {
  this.$messageElem.html(message);
};

ConnectFourView.prototype.tokenTemplate = function(player) {
  return '<img class="token token-' + player.id + '" src="' + player.imgUrl + '" align="middle" />';
};

ConnectFourView.prototype.nameTemplate = function(player) {
  return '<span><i>' + player.name + '</i></span>';
};

ConnectFourView.prototype.addToken = function(colIndex, player) {
  var response = this.game.addToken(colIndex, player.id);

  if (response.success) {
    var $row = this.$gameElem.find('tr:nth-child(' + (response.rowIndex+1) + ')');
    var $cell = $row.children('td:nth-child(' + (colIndex+1) + ')');
    $cell.html(this.tokenTemplate(player));
  } else {
    this.setMessage(response.error + " Still " + player.name + "'s turn");
  }

  return response.success;
};
