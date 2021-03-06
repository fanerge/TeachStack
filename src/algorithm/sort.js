// test1
function mergeSort(nums) {
  let len = nums.length
  if (len <= 1) {
    return nums;
  }
  mSort(nums, 0, len, [])
  return nums;
}
function mSort(arr, start, end, temp) {
  // 空区间 或 只有一个元素
  // 为了防止strat + 1溢出，这里用strat >= end先判断一下
  if (start >= end || start + 1 >= end) {
    return;
  }
  // 分成两半, 二叉树可以自动取得root.left, root.right
  // 这里我们需要通过计算来得到左右子数组。
  let mid = start + Math.floor((end - start) / 2);
  // 类比二叉树分别遍历左子树和右子树。
  mSort(arr, start, mid, temp);
  mSort(arr, mid, end, temp);
  // i指向左子数组的开头，j指向右子数组的开头
  // to指向要临时数组t与区间[b, e)对应的位置
  let i = start;
  let j = mid;
  let to = start;
  // 将两个子数组进行合并, 注意下面是一个很重要的模板
  // 这里的判断条是，只要两个子数组中还有元素
  while (i < mid || j < end) {
    // 如果右子数组没有元素 或 左子数组开头的元素小于右子数组开头的元素
    // 那么取走左子数组开头的元素
    // 考点：a[i] <= a[j]这样可以保证合并排序是稳定的，不要写错!
    // j >= end，取不到end，因为end为数组长度
    if (j >= end || i < mid && arr[i] <= arr[j]) {
      temp[to++] = arr[i++]
    } else {
      // 否则就是取右子数组开头的元素
      temp[to++] = arr[j++]
    }
  }
  // 把合并的结果拷回原来的数组a[]
  console.log(temp)
  for (let i = start; i < end; i++) {
    arr[i] = temp[i];
  }
}

// console.log(mergeSort([9, 8, 3, 4, 1]));
function quickSort(nums) {
  if (nums == null) return;
  qSort(nums, 0, nums.length);
  return nums;
}
function qSort(arr, start, end) {
  // 像二叉树一样，如果空树/只有一个结点，那么不需要再递归了 
  // 如果给定的区间段为空，或者只有一个结点。 
  if (start >= end || start + 1 >= end) {
    return;
  }
  // 取数组中间的元素作为x
  let mid = start + Math.floor((end - start) / 2);
  let midVal = arr[mid];
  // 三路切分
  let first = start, i = start, last = end - 1;
  while (i <= last) {
    if (arr[i] < midVal) {
      swap(arr, first++, i++);
    } else if (arr[i] === midVal) {
      i++;
    } else {
      swap(arr, last--, i);
    }
  }
  // 像二叉树的前序遍历一样，分别遍历左子树与右子树。
  qSort(arr, start, first);
  qSort(arr, i, end);
}

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// console.log(quickSort([9, 8, 3, 4, 1]));


