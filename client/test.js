// function binarySearch(arr, value, startPos, endPos) {
//     if (startPos > endPos) {
//         return -1
//     }

//     let middlePos = Math.floor((startPos + endPos) / 2);

//     if (arr[middlePos] === value) {
//         return middlePos
//     }

//     if (arr[middlePos] < value) {
//         return binarySearch(arr, value, middlePos + 1, endPos)
//     } else {
//         return binarySearch(arr, value, startPos, middlePos - 1)
//     }
// }

// console.log(binarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 6, 0, 9));

// var x = 23;

// (function () {
//     var x = 43;
//     (function random() {
//         x++;
//         console.log(x);
//         var x = 21;
//     })();
// })();

// (function (a) {
//     return (function () {
//         console.log(a);
//         a = 23;
//     })()
// })(45);

// sử dụng closure
// function bigFunc() {
//     let newArray = new Array(700).fill('♥');
//     return function (element) {
//         return newArray[element];
//     }
// }

// let getElement = bigFunc();
// console.log(getElement(599));
// console.log(getElement(670));
// function getPersonInfo(one, two, three) {
//     console.log(one);
//     console.log(two);
//     console.log(three);
// }

// const person = "Lydia";
// const age = 21;

// getPersonInfo`${person} is ${age} years old`;
// function getAge(...args) {
//     console.log(typeof args);
// }

// getAge(21);
const foo = () => console.log("First");
const bar = () => setTimeout(() => console.log("Second"));
const baz = () => console.log("Third");

bar();
foo();
baz();