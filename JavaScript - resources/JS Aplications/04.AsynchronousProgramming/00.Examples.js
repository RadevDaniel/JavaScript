let p1 = new Promise(function (resolve, reject) {
    console.log('Promise1 started');
    setTimeout(function () {
        resolve('promise1 result');
        console.log('Promise1 Done');
    }, 1000);

});

let p2 = new Promise(function (resolve, reject) {
    console.log('Promise2 started');
    setTimeout(function(){
        resolve('Promise2 result')
        console.log('Promise2 Done');
    }, 1500);
});

let p3 = new Promise(function (resolve, reject) {
    console.log('Promise3 started');
    setTimeout(function () {
        resolve('Promise3 result');
        console.log('Promise3 Done');
    }, 500)
});

console.log('All Tasks Started');

Promise.all([p1, p2, p3]).then(
    function (result) {
        console.log('AllTasksFinished');
        console.log('Result: ' + result.join(', '))
    }
).catch(function(error){
    console.log('Some of The Tasks Failed');
   console.log('error: ' + error);
});
