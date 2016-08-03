'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    var numbers = " _     _  _     _  _  _  _  _ " +
                  "| |  | _| _||_||_ |_   ||_||_|" +
                  "|_|  ||_  _|  | _||_|  ||_| _|";
    var widthDigit = 3;
    var i, j, res = "";

    var numDigits = 10;
    var lenDigitRow = widthDigit * numDigits;
    var a2 = lenDigitRow, a3 = lenDigitRow * 2;

    var numDigitsBankAccount = 9;
    var lenBankAccount = widthDigit * numDigitsBankAccount + 1;
    var b2 = lenBankAccount, b3 = lenBankAccount * 2;

    for (i = 0; i < lenBankAccount; i += 3)
    {
        for (j = 0; j < lenDigitRow; j += 3)
        {
            if (bankAccount[i]          === numbers[j]          &&
                bankAccount[i + 1]      === numbers[j + 1]      &&
                bankAccount[i + 2]      === numbers[j + 2]      &&
                bankAccount[i + b2]     === numbers[j + a2]     &&
                bankAccount[i + b2 + 1] === numbers[j + a2 + 1] &&
                bankAccount[i + b2 + 2] === numbers[j + a2 + 2] &&
                bankAccount[i + b3]     === numbers[j + a3]     &&
                bankAccount[i + b3 + 1] === numbers[j + a3 + 1] &&
                bankAccount[i + b3 + 2] === numbers[j + a3 + 2])
            {
                res += j / 3;
                break;
            }
        }
    }
    return +res;
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
  var pos = 0,
      start = 0,
      end = 0;
  var lenText = text.length;

  while ( start < lenText ) {
    for (pos = start; pos - start <= columns && pos <= lenText; pos++)
      if (text[pos] === " " || pos === lenText)
        end = pos;

    yield text.substr(start, end - start);
    pos = start = end + 1;
  }
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
  var card = new Cards(hand);
  return card.CheckCards();
}

function Cards (hand) {
  var rev = false;
  this.num = hand.map( (d) => {
    var cur = d.slice(0, d.length - 1);
    if (cur === 'K') rev = true;
    switch (cur) {
      case 'A':  return 0;  break;
      case '2':  return 1;  break;
      case '3':  return 2;  break;
      case '4':  return 3;  break;
      case '5':  return 4;  break;
      case '6':  return 5;  break;
      case '7':  return 6;  break;
      case '8':  return 7;  break;
      case '9':  return 8;  break;
      case '10': return 9;  break;
      case 'J':  return 10; break;
      case 'Q':  return 11; break;
      case 'K':  return 12; break;
      default:   throw new Error('Card isn\'t exist: ' + d);
    }
  });
  if (rev)
    this.num = this.num.map( (d) => d === 0 ? 13 : d);
  this.num.sort(function (a, b) {
    if (a > b) return 1;
    if (a < b) return -1;
  });

  this.suit = hand.map( (d) => {
    var cur = d.slice(-1);
    switch (cur) {
      case '♥': return 0; break;
      case '♠': return 1; break;
      case '♦': return 2; break;
      case '♣': return 3; break;
      default:  throw new Error('Card isn\'t exist: ' + d);
    }
  });
}
Cards.prototype.Straight = function () {
  var prev = this.num[0] - 1;
  return this.num.filter( (d) => d === ++prev ).length === 5;
}
Cards.prototype.Flush = function () {
  var prev = this.suit[0];
  return this.suit.filter( (d) => d === prev ).length === 5;
}
Cards.prototype.StraightFlush = function () {
  return this.Straight() && this.Flush();
}
Cards.prototype.FourOfKind = function () {
  return this.checkRepeat(4);
}
Cards.prototype.FullHouse = function () {
  return this.checkRepeat(3) && this.checkRepeat(2);
}
Cards.prototype.ThreeOfKind = function () {
  return this.checkRepeat(3);
}
Cards.prototype.TwoPairs = function () {
  return this.checkRepeat(2, 3);
}
Cards.prototype.OnePair = function () {
  return this.checkRepeat(2);
}
Cards.prototype.CheckCards = function () {
  if (this.StraightFlush()) return PokerRank.StraightFlush;
  if (this.FourOfKind())    return PokerRank.FourOfKind;
  if (this.FullHouse())     return PokerRank.FullHouse;
  if (this.Flush())         return PokerRank.Flush;
  if (this.Straight())      return PokerRank.Straight;
  if (this.ThreeOfKind())   return PokerRank.ThreeOfKind;
  if (this.TwoPairs())      return PokerRank.TwoPairs;
  if (this.OnePair())       return PokerRank.OnePair;
  return PokerRank.HighCard;
}
Cards.prototype.checkRepeat = function (repeat, num) {
  num = typeof num !== 'undefined' ?  num : 0;
  return this.num.filter( (data) =>
    this.num.filter( (d) => d === data ).length === repeat
  ).length > num;
}

/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 *
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 *
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
  var obj = new Graph(figure);
  var str;
  try {
    while (true) {
      str = obj.getPath().getFigure();
      yield str;
    }
  }
  catch(e) { return ; }
}

function Graph (figure) {
  if (typeof figure !== 'string') throw new Error('Figure isn\'t string!');

  this.width = figure.indexOf("\n");
  if (this.width === -1) throw new Error('Figure hasn\'t row!');
  this.height = figure.length / (this.width + 1);

  this.fig = new Array(this.height).fill(0);
  this.fig = this.fig.map( () => new Array(this.width).fill(0));
  this.fig = this.convertToArray(this.fig, figure);
  this.bindVertex();
}

Graph.prototype = {
  convertToArray (mas, figure) {
    return mas.map( (data, i) => {
      return data.map( (d, j) => {
        try { var n = new Vertex(figure[i * (this.width + 1) + j]); }
        catch (e) { n = null; }
        return n;
      });
    })
  },
  bindVertex () {
    var i, j;
    var begin = null,
        vertex = null;
    for (i = 0; i < this.height; i++) {
      for (j = 0; j < this.width; j++) {
        vertex = this.fig[i][j];
        if (vertex !== null && vertex.isHorizontal()) {
          if (begin === null) begin = vertex;
          else {
            begin.addEdge(new Edge(vertex));
            vertex.addEdge(new Edge(begin));
            begin = vertex;
          }
        }
        else begin = null;
      }
      begin = null;
    }
    for (i = 0; i < this.width; i++) {
      for (j = 0; j < this.height; j++) {
        vertex = this.fig[j][i];
        if (vertex !== null && vertex.isVertical()) {
          if (begin === null) begin = vertex;
          else {
            begin.addEdge(new Edge(vertex));
            vertex.addEdge(new Edge(begin));
            begin = vertex;
          }
        }
        else begin = null;
      }
      begin = null;
    }
  },
  cleanPath () {
    this.fig.map( (data) => {
      data.map( (d) => { if (d !== null) d.cleanVertex(); } );
    });
  },
  getPath () {
    var i, j;
    for (i = 0; i < this.height; i++) {
      for (j = 0; j < this.width; j++) {
        if(this.fig[i][j] !== null   &&
           this.fig[i][j].isCorner() &&
           this.fig[i][j].isEnable())
           break;
      }
      if (j !== this.width) break;
    }
    if (i === this.height) throw new Error('Figures aren\'t exist!');
    this.cleanPath();

    var open  = [],
        close = [];

    var begin = this.fig[i][j];
    close.push(begin);
    open = begin.getOpenVertex(close);
    var end = open.shift();
    begin.prev = end;
    end.prev = null;
    while (true) {
      if (open.length === 0) break;
      var cur = open.shift();
      open = open.concat(cur.getOpenVertex(close));
      close.push(cur);
    }
    // Активация пройденых рёбер
    var prev = begin,
        cur  = end,
        next = end.prev;
    do {
      cur.activateWay(prev, next);
      prev = cur;
      cur = next;
      next = cur.prev;
    }
    while (cur !== end);
    // Выключение полностью пройденых вершин
    this.fig.map( (data) => {
      data.map( (d) => {
        try { if (d !== null) d.checkUsedWay(); }
        catch (e) { ; }
      });
    });
    return this;
  },
  getFigure () {
    var widthFigure = 0,
        heightFigure = 0,
        xF = -1, yF = -1;
    var len;
    this.fig.map( (data, i) => {
      len = data.filter( (d) => d !== null && d.isPath ).length;
      if (xF === -1 && len !== 0) data.map( (d, j) => {
        if (xF === -1 && d !== null && d.isPath) {
          xF = j;
          yF = i;
        }
      });
      if (len > widthFigure) widthFigure = len;
    });
    heightFigure = this.fig.filter( (data) => {
      len = data.filter( (d) => d !== null && d.isPath ).length;
      return len !== 0;
    }).length;
    // Перенос фигуры в новый массив
    var figure = new Array(heightFigure).fill(0);
    figure = figure.map( (data) => {
      return this.fig[yF++].slice(xF, xF + widthFigure);
    });
    // Преобразование в строку
    var mas = figure.map( (data) => {
      return data.map( (d) => {
        if (d !== null) return d.type;
        else return " ";
      });
    });
    // Упрощение фигуры
    mas = mas.map( (data, i) => {
      return data.map( (d, j) => {
        if (d === "+") {
          if (j > 0 && j < widthFigure - 1 &&
              mas[i][j - 1] === "-"        &&
              mas[i][j + 1] === "-")
              return "-";
          if (i > 0 && i < heightFigure - 1 &&
              mas[i][j - 1] === "-"         &&
              mas[i][j + 1] === "-")
              return "-";
        }
        return d;
      });
    });
    return mas.map( (d) => d.join("")).join("\n") + "\n";
  },
}
/* ------------------
 * ----- Vertex -----
 * ------------------
 */
function Vertex (type) {
  if ("+-|".indexOf(type) === -1) throw new Error('Vertex isn\'t exist!');

  this.type = type;
  this.edges = [];
  this.prev = null;
  this.enable = true;
  this.isPath = false;
}
Vertex.prototype = {
  addEdge (edge) {
    this.edges.push(edge);
  },
  isVertical () {
    return "+|".indexOf(this.type) !== -1;
  },
  isHorizontal () {
    return "+-".indexOf(this.type) !== -1;
  },
  isCorner () {
    return this.type === "+";
  },
  isEnable () {
    return this.enable;
  },
  getOpenVertex (close) {
    return this.edges.filter( (d) => close.indexOf(d.vertex) === -1 &&
                                     d.vertex.enable)
                     .map( (d) => {
                       d.vertex.prev = this;
                       return d.vertex;
                     });
  },
  activateWay (prev, next) {
    var edge;
    edge = this.edges.filter( (d) => d.vertex === prev || d.vertex === next );
    if (edge.length !== 2) throw new Error('Vertex hasn\'t edges!');
    edge[0].used = edge[1].used = true;
    this.isPath = true;
  },
  checkUsedWay () {
    if (this.isCorner()) {
      var len = this.edges.filter( (d) => d.used || !d.vertex.enable ).length;
      if (len === this.edges.length) this.enable = false;
      else throw new Error('Vertex has unused edges!');
    }
    else
    {
      var len = this.edges.filter( (d) => !d.vertex.enable ).length;
      if (len === 1) this.enable = false;
      else throw new Error('Vertex has unused edges!');
    }
  },
  cleanVertex () {
    this.prev = null;
    this.isPath = false;
    this.edges.map( (d) => d.used = false);
  }
}
/* ----------------
 * ----- Edge -----
 * ----------------
 */
function Edge (vertex) {
  this.vertex = vertex;
  this.used = false;
}
Edge.prototype = {
  isUsed () {
    return this.used;
  }
}

module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
