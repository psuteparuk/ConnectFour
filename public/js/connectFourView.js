var ConnectFourView = function(model, options) {
  this.CELL_SIZE = 60;

  options = options || {};
  this.game = model;
  this.width = this.game.col * this.CELL_SIZE;
  this.height = this.game.row * this.CELL_SIZE;
  this.$gameElem = $(options.gameElem || '.game');
  this.$messageElem = $(options.messageElem || '.message');
};

ConnectFourView.prototype.init = function() {
  this.setTitle(this.game.title);
  this.addPlayerStatus(this.game.player1);
  this.addPlayerStatus(this.game.player2);
  this.addBoard();
  this.boardHandler();

  $(this.game).on('playerChanged', function(e, player) { this.setCurrentPlayer(player); }.bind(this));
  $('.replay').click(function(e) { this.reset(); }.bind(this));

  this.reset();
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

ConnectFourView.prototype.boardHandler = function() {
  var $cells = $('.board td, .board td *');

  // Turn-based interaction
  $cells.click(function(e) {
    if (!this.game.isActive) return;

    var $target = $(e.target).is('td') ? $(e.target) : $(e.target).parent();
    var targetCol = $target.attr('class');
    var matchedClass = /col-(\d+)/g.exec(targetCol);
    if (!matchedClass) return;

    var colIndex = parseInt(matchedClass[1], 10);
    if (!this.addToken(colIndex, this.game.currentPlayer)) return;

    if (this.game.checkWinningState(colIndex)) {
      this.showWinningState();
      return;
    }

    this.game.switchPlayer();
  }.bind(this));

  // Other interactions
  $cells.mouseenter(function(e) {
    var $target = $(e.target).is('td') ? $(e.target) : $(e.target).parent();
    var targetCol = $target.attr('class');
    $('.' + targetCol.replace(' ', '.')).addClass('hover');
  });
  $cells.mouseleave(function(e) {
    var $target = $(e.target).is('td') ? $(e.target) : $(e.target).parent();
    var targetCol = $target.attr('class');
    $('.' + targetCol.replace(' ', '.')).removeClass('hover');
  });
};

ConnectFourView.prototype.setTitle = function(title) {
  $('.title').html('<h2>' + title + '</h2>');
};

ConnectFourView.prototype.setCurrentPlayer = function(player) {
  this.setMessage(player.name + "'s turn");
  $('.player-status span').removeClass('current');
  player.$playerStatusElem.children('span').addClass('current');
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

ConnectFourView.prototype.addToken = function(colIndex) {
  var response = this.game.addToken(colIndex);

  if (response.success) {
    var $row = this.$gameElem.find('tr:nth-child(' + (response.rowIndex+1) + ')');
    var $cell = $row.children('td:nth-child(' + (colIndex+1) + ')');
    $cell.html(this.tokenTemplate(this.game.currentPlayer));
  } else {
    this.setMessage(response.error + " Still " + this.game.currentPlayer.name + "'s turn");
  }

  return response.success;
};

ConnectFourView.prototype.showWinningState = function() {
  this.setMessage(this.game.currentPlayer.name + " WINS!");
  this.game.isActive = false;
  $('.replay').show();
};

ConnectFourView.prototype.reset = function() {
  this.game.reset();
  $('.replay').hide();
  $('.board td').html('<div class="token token-default"></div>');
};
