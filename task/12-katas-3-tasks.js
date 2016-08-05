'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ];
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false
 */
 function findStringInSnakingPuzzle(puzzle, searchStr) {
   var obj  = new Graph(puzzle, searchStr);
   return obj.findWord();
 }

 function Graph (puzzle, searchStr) {
   this.puzzle = puzzle.map( (d) => d.split("") );
   this.puzzle = this.puzzle.map( (data, i) => {
     return data.map( (d, j) => new Vertex(d, i, j));
   });
   this.searchStr = searchStr;

   this.height = this.puzzle.length;
   if (this.height <= 0) throw new Error('Puzzle hasn\'t row!');
   this.width = this.puzzle[0].length;
 }

 Graph.prototype = {
   findWord () {
     var i, j;
     while (true) {
       for (i = 0; i < this.height; i++) {
         for (j = 0; j < this.width; j++)
           if (this.puzzle[i][j].isEnable() &&
               this.puzzle[i][j].letter === this.searchStr[0]) break;
         if (j !== this.width) break;
       }
       if (i === this.height) return false;
       var cur = this.puzzle[i][j];
       cur.Enable = false;
       this.index = 1;

       while (true) {
         if (!cur.isUsed()) {
           cur.Used = true;
           var neighbors = this.getNeighbor(cur);
           cur.ways = neighbors.filter( (d) => {
             return this.searchStr[this.index] === d.letter
           });
           this.index++;
         }
         if (this.index - 1 === this.searchStr.length) return true;
         if (cur.ways.length === 0) {
           var prev = cur.prev;
           cur.prev = null;
           cur.Used = false;
           this.index--;
           cur = prev;
         }
         else {
           var next = cur.ways.pop();
           next.prev = cur;
           cur = next;
         }
         if (cur === null) break;
       }
     }
   },
   getNeighbor (vertex) {
     var arr = [];
     if (vertex.y > 0 &&
         !this.puzzle[vertex.y - 1][vertex.x].isUsed())
       arr.push(this.puzzle[vertex.y - 1][vertex.x]);
     if (vertex.y < this.height - 1 &&
         !this.puzzle[vertex.y + 1][vertex.x].isUsed())
       arr.push(this.puzzle[vertex.y + 1][vertex.x]);
     if (vertex.x > 0 &&
         !this.puzzle[vertex.y][vertex.x - 1].isUsed())
       arr.push(this.puzzle[vertex.y][vertex.x - 1]);
     if (vertex.x < this.width - 1 &&
         !this.puzzle[vertex.y][vertex.x + 1].isUsed())
       arr.push(this.puzzle[vertex.y][vertex.x + 1]);
     return arr;
   },
 }

 function Vertex (letter, y, x) {
   this.letter = letter;
   this.used = false;
   this.enable = true;
   this.prev = null;
   this.ways = [];
   this.x = x;
   this.y = y;
 }
 Vertex.prototype = {
   set Enable (val) {
     if (typeof val !== "boolean") throw new Error('Data Error!');
     this.enable = val;
   },
   isEnable () {
     return this.enable;
   },
   set Used (val) {
     if (typeof val !== "boolean") throw new Error('Data Error!');
     this.used = val;
   },
   isUsed () {
     return this.used;
   },
 }


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 *
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
 function* getPermutations(chars) {
   var seq = chars.split("");
   var len = seq.length;
   var coomb = fact(len) - 1;
   var iter = 0;
   if (len === 1) { yield chars; return; }
   while (true) {
     var number = "000".repeat(len - 1) + (iter++).toString(len);
     number = number.slice(-len).split("").map( (d) => +d );
     var check = number.filter( (data) => {
       return number.filter( (d) => d === data ).length === 1;
     }).length;
     if (check !== len) continue;
     yield number.map( (d) => seq[d]).join("");
     if (coomb-- === 0) return;
   }
 }
 function fact(n) {
   return n ? n * fact(n - 1) : 1;
 }


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing.
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 *
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
 function getMostProfitFromStockQuotes(quotes) {
   var i;
   var result = 0;
   while (quotes.length > 0) {
     var sum = 0;
     var max = getMaxOfArray(quotes);
     var index = quotes.indexOf(max);
     for (i = 0; i < index; i++) sum += quotes[i];
     result += index * quotes[i] - sum;
     quotes = quotes.slice(index + 1);
   }
   return result;
 }
 function getMaxOfArray(numArray) {
   return Math.max.apply(null, numArray);
 }


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 *
 * @class
 *
 * @example
 *
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 *
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {

    encode: function(url) {
        throw new Error('Not implemented');
    },

    decode: function(code) {
        throw new Error('Not implemented');
    }
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
