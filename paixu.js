// 冒泡排序
// 最外层循环控制的内容是循环次数// 每一次比较的内容都是相邻两者之间的大小关系
let BubbleSort = function (arr, flag = 0) {
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  console.log(arr)
  return flag ? arr.reverse() : arr
};
let arr = [2, 9, 6, 7, 4, 3, 1, 7];
console.log(BubbleSort(arr, 0))


// 快速排序
let quickSort = function (arr) {
  // 递归出口就是数组长度为1    
  if (arr.length <= 1) return arr
  //获取中间值的索引，使用Math.floor向下取整；    
  let index = Math.floor(arr.length / 2)
  // 使用splice截取中间值，第一个参数为截取的索引，第二个参数为截取的长度；    
  // 如果此处使用pivot=arr[index]; 那么将会出现无限递归的错误；    
  // splice影响原数组    
  let pivot = arr.splice(index, 1)[0],
    left = [], right = [];
  console.log(pivot)
  console.log(arr)
  for (let i = 0; i < arr.length; i++) {
    if (pivot > arr[i]) {
      left.push(arr[i])
    }
    else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat([pivot], quickSort(right));
}
let arr = [2, 9, 6, 7, 4, 3, 1, 7]
 console.log(quickSort(arr))