QUnit.module('ConnectFourView', function(hooks) {
  hooks.beforeEach(function() {
    $('<div class="title"></div>').appendTo('#qunit-fixture');
    $('<div class="status"><div class="versus"><span>V.S.</span></div></div>').appendTo('#qunit-fixture');
    $('<div class="message"></div>').appendTo('#qunit-fixture');
    $('<div class="replay"><a class="replay-link">Replay?</a></div>').appendTo('#qunit-fixture');
    $('<div class="game"></div>').appendTo('#qunit-fixture');

    this.player1 = new Player({ name: 'Player1', imgUrl: 'http://www.example1.com' });
    this.player2 = new Player({ name: 'Player2', imgUrl: 'http://www.example2.com' });
    this.model = new ConnectFour(this.player1, this.player2);
    this.view = new ConnectFourView(this.model);
    this.view.init();
  });

  hooks.afterEach(function() {
    $('#qunit-fixture').empty();
  });

  QUnit.module('Game Initialization', function() {
    QUnit.test('Show player names', function(assert) {
      assert.ok($('.status').text().indexOf(this.player1.name) > -1);
      assert.ok($('.status').text().indexOf(this.player2.name) > -1);
    });

    QUnit.test('Show player tokens', function(assert) {
      assert.deepEqual($('.status .token-' + this.player1.id).attr('src'), this.player1.imgUrl);
      assert.deepEqual($('.status .token-' + this.player2.id).attr('src'), this.player2.imgUrl);
    });

    QUnit.test('Show player1 turn', function(assert) {
      assert.deepEqual($('.message').text(), this.player1.name + "'s turn");
    });

    QUnit.test('Show the right board dimension', function(assert) {
      assert.deepEqual($('.game table tr').length, this.model.row, 'correct number of rows');
      assert.deepEqual($('.game table tr:first-child td').length, this.model.col, 'correct number of columns');
    });

    QUnit.test('Show an empty board', function(assert) {
      assert.deepEqual($('.game table td img').length, 0);
    });

    QUnit.test('Hide replay link', function(assert) {
      assert.notOk($('.replay').is(':visible'));
    });
  });

  QUnit.module('Board Interaction', function() {
    QUnit.module('Clicking a cell', function() {
      QUnit.test('When game is not active', function(assert) {
        var done = assert.async();
        this.model.isActive = false;
        $('.game table tr:first-child td:first-child').click();
        setTimeout(function() {
          assert.deepEqual($('.game table tr td:first-child img').length, 0, 'does not add a token');
          done();
        });
      });

      QUnit.test('When the column is full', function(assert) {
        var done = assert.async();
        var id1 = this.player1.id;
        for (var i = 0; i < this.model.row; ++i) {
          this.model.currentState[0].push(id1);
        }
        $('.game table tr:first-child td:first-child').click();
        setTimeout(function() {
          assert.deepEqual($('.game table tr td:first-child img').length, 0, 'does not add a token');
          assert.deepEqual($('.message').text(), "This column is full! Still " + this.model.currentPlayer.name + "'s turn");
          done();
        }.bind(this));
      });

      QUnit.test('Add the correct token', function(assert) {
        var done = assert.async();
        $('.game table tr:first-child td:first-child').click();
        setTimeout(function() {
          assert.deepEqual($('.game table tr:last-child td:first-child img').attr('src'), this.player1.imgUrl);
          done();
        }.bind(this), 2000);
      });

      QUnit.test('Show winning state', function(assert) {
        var done = assert.async();
        var id1 = this.player1.id;
        this.model.currentState[0] = [id1, id1, id1];
        $('.game table tr:first-child td:first-child').click();
        setTimeout(function() {
          assert.deepEqual($('.message').text(), this.model.currentPlayer.name + " WINS!");
          assert.ok($('.replay').is(':visible'), 'show replay link');
          assert.notOk(this.model.isActive, 'set game to inactive');
          done();
        }.bind(this), 2000);
      });
    });
  });

  QUnit.module('Reset the game', function() {
    QUnit.test('Show player1 turn', function(assert) {
      assert.deepEqual($('.message').text(), this.player1.name + "'s turn");
    });

    QUnit.test('Show an empty board', function(assert) {
      assert.deepEqual($('.game table td img').length, 0);
    });

    QUnit.test('Hide replay link', function(assert) {
      assert.notOk($('.replay').is(':visible'));
    });
  });

  QUnit.module('setTitle', function() {
    QUnit.test('Set correct title', function(assert) {
      this.view.setTitle('New Title');
      assert.deepEqual($('.title').text(), 'New Title');
    });
  });

  QUnit.module('setCurrentPlayer', function() {
    QUnit.test('Set correct message', function(assert) {
      this.view.setCurrentPlayer(this.player2);
      assert.deepEqual($('.message').text(), this.player2.name + "'s turn", 'switch to the opponent');
    });
  });

  QUnit.module('setMessage', function() {
    QUnit.test('Set correct message', function(assert) {
      this.view.setMessage('New Message');
      assert.deepEqual($('.message').text(), 'New Message');
    });
  });

  QUnit.module('addToken', function() {
    QUnit.test('When response is not a success', function(assert) {
      var success = this.view.addToken(-1);
      assert.notOk(success, 'return failure');
      assert.ok($('.message').text().indexOf("Still " + this.model.currentPlayer.name + "'s turn") > -1);
    });

    QUnit.test('When response is a success', function(assert) {
      var done = assert.async();
      var success = this.view.addToken(0);
      assert.ok(success, 'return success');
      setTimeout(function() {
        assert.deepEqual($('.game table tr:last-child td:first-child img').attr('src'), this.player1.imgUrl);
        done();
      }.bind(this), 2000);
    });
  });

  QUnit.module('showWinningState', function(hooks) {
    hooks.beforeEach(function() {
      this.view.showWinningState();
    });

    QUnit.test('Show correct message', function(assert) {
      assert.deepEqual($('.message').text(), this.model.currentPlayer.name + " WINS!");
    });

    QUnit.test('Set game to inactive', function(assert) {
      assert.notOk(this.model.isActive);
    });

    QUnit.test('Show replay link', function(assert) {
      assert.ok($('.replay').is(':visible'));
    });
  });
});
