/// <reference path='./third_party_definitions/_definitions.ts' />
var Util;
(function (Util) {
    function random(min = 0, max = 1) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    Util.random = random;
    function isDefined(value) {
        return (!_.isNull(value) && !_.isUndefined(value));
    }
    Util.isDefined = isDefined;
    function isNumeric(s) {
        return !isNaN(parseFloat(s)) && isFinite(s); // based from: http://stackoverflow.com/a/6449623
    }
    Util.isNumeric = isNumeric;
    function unixToReadableClock(unix) {
        return formatUnixTimestamp(unix, "HH:mm");
    }
    Util.unixToReadableClock = unixToReadableClock;
    function unixToReadableDay(unix) {
        return formatUnixTimestamp(unix, "DD/MM/YYYY");
    }
    Util.unixToReadableDay = unixToReadableDay;
    function unixToReadableDate(unix) {
        return formatUnixTimestamp(unix, "DD/MM/YYYY HH:mm");
    }
    Util.unixToReadableDate = unixToReadableDate;
    function unixToReadableDateVerbose(unix) {
        return formatUnixTimestamp(unix, "dddd DD/MM/YYYY [a las] HH:mm");
    }
    Util.unixToReadableDateVerbose = unixToReadableDateVerbose;
    function formatUnixTimestamp(unix, layout) {
        if (isNumeric(unix)) {
            return moment.unix(unix).format(layout);
        }
        else {
            console.warn(`Unix timestamp value(=${unix}) is not a number`);
            return '';
        }
    }
    Util.formatUnixTimestamp = formatUnixTimestamp;
    /** Generates a map by id of the given collection of identificables. */
    function toMapById(entites) {
        return _.indexBy(entites, 'id');
    }
    Util.toMapById = toMapById;
    /** Generates a map by id of the given collection of elements whose id is extracted using the correspondant method */
    function toMapByIdUsingGetter(list, idGetterFunc) {
        return list.reduce((map, elem) => {
            map[idGetterFunc(elem)] = elem;
            return map;
        }, {});
    }
    Util.toMapByIdUsingGetter = toMapByIdUsingGetter;
})(Util || (Util = {}));
var Arrays;
(function (Arrays) {
    /** Determines if two arrays has the same values regardless their order and duplicates.
        Dev notes: It doesn't support arrays with duplicated values with same quantity of elements, e.g: [1,2,2] would be considered as equal to [1,1,2]
    */
    function hasSameValues(a1, a2, areEquals) {
        if (_.size(a1) !== _.size(a2)) {
            return false;
        }
        const a1ConstainsA2 = _.reduce(a1, (acc, e1) => {
            return acc && ((a2).findIndex((e2) => areEquals(e1, e2)) !== -1);
        }, true);
        const a2ConstainsA1 = _.reduce(a2, (acc, e2) => {
            return acc && ((a1).findIndex((e1) => areEquals(e1, e2)) !== -1);
        }, true);
        return a1ConstainsA2 && a2ConstainsA1;
    }
    Arrays.hasSameValues = hasSameValues;
    /**
     * Generates an array containing all possible combinations (in form of array).
     * So it returns an array of n! elements where each element is an array holding a possible combination.
     * @param array
     * @returns An array of arrays that containst all the possible combinations.
     */
    function generatePermutations(array) {
        if (array.length == 1) {
            return [array];
        }
        else {
            var combinations = [];
            array.forEach((value, index) => {
                const others = array.slice(0, index).concat(array.slice(index + 1, array.length));
                const subcombinations = generatePermutations(others);
                subcombinations.forEach((subcombination) => {
                    //const combination = [value].concat(subcombination).flat(1)
                    const combination = [value].concat(...subcombination);
                    combinations.push(combination);
                });
            });
            return combinations;
        }
    }
    Arrays.generatePermutations = generatePermutations;
    let Tests;
    (function (Tests) {
        function CombineWorks() {
            const testRuns = [
                {
                    title: "Empty array",
                    input: [],
                    expected: [],
                },
                {
                    title: "2 element array",
                    input: [1, 2],
                    expected: [[1, 2], [2, 1]],
                },
                {
                    title: "3 element array",
                    input: [1, 2, 3],
                    expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]],
                },
                {
                    title: "4 element array",
                    input: [1, 2, 3, 4],
                    expected: [[1, 2, 3, 4], [1, 2, 4, 3], [1, 3, 2, 4], [1, 3, 4, 2], [1, 4, 2, 3], [1, 4, 3, 2], [2, 1, 3, 4], [2, 1, 4, 3], [2, 3, 1, 4], [2, 3, 4, 1], [2, 4, 1, 3], [2, 4, 3, 1], [3, 1, 2, 4], [3, 1, 4, 2], [3, 2, 1, 4], [3, 2, 4, 1], [3, 4, 1, 2], [3, 4, 2, 1], [4, 1, 2, 3], [4, 1, 3, 2], [4, 2, 1, 3], [4, 2, 3, 1], [4, 3, 1, 2], [4, 3, 2, 1]],
                },
            ];
            _.forEach(testRuns, (testRun) => {
                const computed = Arrays.generatePermutations(testRun.input);
                if (_.size(computed) != _.size(testRun.expected)) {
                    console.error("No tiene la misma dimension, computada es: ", _.size(computed), " y esperada es: ", _.size(testRun.expected));
                }
                for (var i = 0; i < _.size(computed); i++) {
                    const strComputedElem = JSON.stringify(computed[i]);
                    const strExpectedElem = JSON.stringify(testRun.expected[i]);
                    if (strComputedElem !== strExpectedElem) {
                        console.error(computed[i], " <> ", testRun.expected[i]);
                    }
                }
            });
        }
        Tests.CombineWorks = CombineWorks;
    })(Tests = Arrays.Tests || (Arrays.Tests = {}));
})(Arrays || (Arrays = {}));
var Sounds;
(function (Sounds) {
    let Clips;
    (function (Clips) {
        Clips[Clips["GameAction1"] = 0] = "GameAction1";
        Clips[Clips["GameAction2"] = 1] = "GameAction2";
        Clips[Clips["Welcome"] = 2] = "Welcome";
        Clips[Clips["GameMessage"] = 3] = "GameMessage";
        Clips[Clips["BroadcastMessage"] = 4] = "BroadcastMessage";
    })(Clips = Sounds.Clips || (Sounds.Clips = {}));
    ;
    const filenameByClip = Object.freeze({
        [Clips.GameAction1]: "game-action-1.mp3",
        [Clips.GameAction2]: "game-action-2.mp3",
        [Clips.Welcome]: "welcome.mp3",
        [Clips.GameMessage]: "game-message.mp3",
        [Clips.BroadcastMessage]: "broadcast-message.mp3",
    });
    const audioByClip = {};
    function loadSounds() {
        const commonPath = "/presentation/web/assets/sounds/";
        const clips = Object.keys(Clips).filter((v) => !isNaN(Number(v)));
        clips.forEach((clip) => {
            const filename = filenameByClip[clip];
            const fullpath = commonPath + filename;
            audioByClip[clip] = new Audio(fullpath);
        });
    }
    loadSounds();
    function playWelcome() {
        audioByClip[Clips.Welcome].play();
    }
    Sounds.playWelcome = playWelcome;
    function playGameMessage() {
        audioByClip[Clips.GameMessage].play();
    }
    Sounds.playGameMessage = playGameMessage;
    function playBroadcastMessage() {
        audioByClip[Clips.BroadcastMessage].play();
    }
    Sounds.playBroadcastMessage = playBroadcastMessage;
    function playAnAction() {
        const rand = Math.floor(Math.random() * 2);
        audioByClip[rand].play(); // rand will be between 0 and 1, and those slots intentionally belongs to action sounds
    }
    Sounds.playAnAction = playAnAction;
})(Sounds || (Sounds = {}));
