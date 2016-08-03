'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    var sides = ['N','E','S','W'];  // use array of cardinal directions only!
    var res = [], i, abbr;
    for (i = 0; i < 32; i++)
    {
        if (i % 8 === 0)
            abbr =  sides[i / 8];
        else if (i % 4 === 0)
            abbr = sides[(Math.floor((i + 8) / 16) % 2) * 2] + 
                   sides[(Math.floor(i / 16) * 2) + 1];
        else if (i % 2 === 0)
            abbr = sides[Math.floor((i+2) / 8) % 4] +
                               sides[(Math.floor((i + 6) / 16) % 2) * 2] + 
                               sides[(Math.floor((i - 2) / 16) * 2) + 1];
        else
        {
            if (((i % 16) - 1) % 14 === 0)
                abbr = sides[(Math.floor((i + 1) / 16) % 2) * 2] + "b" + 
                       sides[(((i % 4) % 3) + Math.floor(i / 8)) % 4];
            else 
            {
                if (((i % 8) - 1) % 6 === 0)
                    abbr = sides[(i % 2) + Math.floor(i / 16) * 2] + "b" + 
                           sides[(((i % 4) % 3) + Math.floor(i / 8)) % 4];
                else 
                    if (Math.floor(i / 8) % 3 === 0)
                        abbr = sides[0] + sides[(i % 2) + Math.floor(i / 16) * 2] + "b" + 
                                          sides[(((i % 4) % 3) + Math.floor(i / 8)) % 4];
                    else
                        abbr = sides[2] + sides[(i % 2) + Math.floor(i / 16) * 2] + "b" + 
                                          sides[(((i % 4) % 3) + Math.floor(i / 8)) % 4];
            }
        }
        res.push({
                abbreviation : abbr
            });
        res[i].azimuth = i * 11.25;
    }
    return res;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */

/*
  * Для решения задачи используется несколько шагов:
  * 1. Извлечение шаблонов из исходной строки и установка точек вхождения;
  * 2. Получение результирующей строки, посредством подстановки вместо точек вхождения - шаблонов;
  *
  * Для перебора шаблонов используются принципы бинарных последовательностей, что позволяет получить все возможные 
  * комбинации. Каждому шаблону соответствует число, соответствующее количеству внутренних вариантов строк.
  * Пример: {jpg,gif,png} => 3
  * Все эти числа помещаются в массив и в дальнейшем используются как верхняя граница для каждого шаблона. Для
  * осуществления перебора используется внутренняя функция counter()
  * Пример перебора: [0, 0, 0] -> [1, 0, 0] -> [2, 0, 0] -> [0, 1, 0] -> [1, 1, 0] -> ...
  * Помимо этого, строки, которые прошли перебор, помещаются в стек, где в дальнейшем используются для исключения
  * повторяющихся строк.
  */

function* expandBraces(str) {
    var pat = /\{[^\{\}]*\}/g;
    var s1 = [], s2 = []; // stack

    var tmp = str, oldStr;
    var maxIndex = []; 

    do {
        oldStr = tmp;
        tmp = tmp.replace(pat, (match, offset) => {
            s1.push(match.substring(1, match.length - 1)
                         .split(','));
            maxIndex.push(s1[s1.length - 1].length);
            return '?[' + (s1.length - 1) + ']';
        });
    } while (oldStr != tmp);

    var index = new Array(s1.length);
    index.fill(0);

    pat = /\?\[[0-9]+\]/g;
    str = tmp;

    var end = false;
    while (end === false) {
        do {
            oldStr = tmp;
            tmp = tmp.replace(pat, (match) => {
                match = match.substring(2, match.length - 1);
                match = +match;
                return s1[match][index[match]];
            });
        } while (oldStr != tmp); 

        counter();
        if (s2.indexOf(tmp) === -1) {
            s2.push(tmp);
            yield tmp;
        }

        tmp = str;
    }

    function counter() {
        var i = 0, len = index.length - 1;

        if (i > len)
            end = true;
        while(true) {
            index[i]++;
            if (index[i] >= maxIndex[i]) {
                if (i < len)
                    index[i++] = 0;
                else {
                    end = true;
                    break;
                }
            }
            else
                break;
        }
        return true;
    }

    return ;
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    var arr = new Array(n);
    arr.fill(0);
    arr = arr.map( (d) => {
        var tmp = new Array(n);
        tmp.fill(0);
        return tmp;
    });
    n--;

    var dir = [
        (x, y) => [x, y+1],
        (x, y) => [x+1, y],
        (x, y) => [x+1, y-1],
        (x, y) => [x-1, y+1]
    ];

    var i = 0, j = 0, step = true, 
        counter = 0, direction, tmp;
    
    while (i !== n || j !== n) {
        if (step === true) {
            if (((i === 0) && (j < n)) || (i === n ))
                tmp = dir[0](i, j);
            else if (j === 0 || j === n)
                tmp = dir[1](i, j);
            i = tmp[0];
            j = tmp[1];

            if (i === 0 || j === n)
                direction = 2;
            else
                direction = 3;

            step = false;
        } 
        else {
            tmp = dir[direction](i, j);
            i = tmp[0];
            j = tmp[1];

            if (i === 0 || j === 0 || i === n || j === n)
                step = true;
        }    
        counter++;
        arr[i][j] = counter;
    }
    return arr;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    var num = new Array(10);
    num.fill(0);

    dominoes.map( function(data) {
        num[data[0]]++;
        if (data[0] !== data[1])
            num[data[1]]++;
    });

    var sum = 0;
    num.map( (data) => sum += Math.floor(data/2) );

    return sum >= dominoes.length - 1;
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    var len = nums.length,
        min = 0, max = 1, size;
    var arr = [];
    var str = "";

    if (len === 1)
        return `${nums[0]}`;
    if (len === 2)
        return `${nums[0]},${nums[1]}`;

    for (; max <= len; max++)
    {
        if ((nums[max] !== (nums[max - 1] + 1)) || (max === len))
        {            
            size = max - min;
            if (size === 1)
                str = "" + nums[min];
            else if (size === 2)
                str = "" + nums[min] + "," + nums[max - 1];
            else
                str = "" + nums[min] + "-" + nums[max - 1];
            min = max;
            arr.push(str);
        }
    }
    return arr.join(",");
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
