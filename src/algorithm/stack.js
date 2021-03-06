/**
 * 题目】字符串中只有字符'('和')'。合法字符串需要括号可以配对。比如：
输入："()"
输出：true
解释：()，()()，(())是合法的。)(，()(，(()是非法的。
 */
function stack1(str) {
  if (!str) {
    return true;
  }
  let leftNum = 0;
  // let stack = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '(') {
      // stack.push('(')
      ++leftNum;
    } else {
      // if (stack.length > 0) stack.pop();
      if (leftNum > 0) --leftNum;
    }
  }

  // return stack.length === 0;
  return leftNum === 0;
}
// test
// console.log(stack1('(())(()('));

/**
 * 【题目扩展】给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。有效字符串需满足：
左括号必须用相同类型的右括号闭合
左括号必须以正确的顺序闭合
注意空字符串可被认为是有效字符串
 */
function stack2(str) {
  if (!str) { return true }
  const len = str.length;
  if (len % 2 === 1) return false;
  let stack = [];
  const lefts = ['(', '{', '['];
  for (let i = 0; i < len; i++) {
    if (lefts.includes(str[i])) {
      stack.push(str[i])
    } else if (str[i] === ')') {
      if (stack.length > 0) {
        let last = stack.slice(-1)[0];
        if (last !== '(') {
          return false;
        }
        stack.pop();
      } else {
        return false;
      }
    } else if (str[i] === '}') {
      if (stack.length > 0) {
        let last = stack.slice(-1)[0];
        if (last !== '{') {
          return false;
        }
        stack.pop();
      } else {
        return false;
      }
    } else if (str[i] === ']') {
      if (stack.length > 0) {
        let last = stack.slice(-1)[0];
        if (last !== '[') {
          return false;
        }
        stack.pop();
      } else {
        return false;
      }
    }
  }

  return stack.length === 0;
}
// test
// console.log(stack2('(){'));

/**
 * 【题目】在水中有许多鱼，可以认为这些鱼停放在 x 轴上。再给定两个数组 Size，Dir，Size[i] 表示第 i 条鱼的大小，Dir[i] 表示鱼的方向 （0 表示向左游，1 表示向右游）。这两个数组分别表示鱼的大小和游动的方向，并且两个数组的长度相等。鱼的行为符合以下几个条件:
所有的鱼都同时开始游动，每次按照鱼的方向，都游动一个单位距离；
当方向相对时，大鱼会吃掉小鱼；
鱼的大小都不一样。
 */
function stack3(sizes, dirs) {
  let fishNum = sizes.length;
  if (fishNum <= 1) return fishNum;
  let left = 0;
  let right = 1;
  // 存放 index
  let stack = [];

  for (let i = 0; i < fishNum; i++) {
    let curSize = sizes[i];
    let curDir = dirs[i];
    // 当前的鱼是否被栈中的鱼吃掉了
    let hasEat = false;
    // 如果栈中还有鱼，并且栈中鱼向右，当前的鱼向左游，那么就会有相遇的可能性
    while (stack.length > 0 && dirs[stack.slice(-1)[0]] === right && curDir === left) {
      // 栈顶的鱼比当前比较的鱼大
      if (sizes[stack.slice(-1)[0]] > curSize) {
        hasEat = true;
        break;
      }
      stack.pop();
    }
    if (!hasEat) {
      stack.push(i);
    }
  }

  return stack.length;
}
var Size = [4, 2, 5, 3, 1];
var Dir = [1, 1, 0, 0, 0]
// console.log(stack3(Size, Dir));

/**
【题目】一个整数数组 A，找到每个元素：右边第一个比我小的下标位置，没有则用 -1 表示。
输入：[5, 2]
输出：[1, -1]
解释：因为元素 5 的右边离我最近且比我小的位置应该是 A[1]，最后一个元素 2 右边没有比 2 小的元素，所以应该输出 -1。
*/

function findRightSmall(A) {
  // 递增栈（小数消大数）
  // index
  let stack = [];
  let ans = [];

  for (let i = 0; i < A.length; i++) {
    if (stack.length <= 0) {
      stack.push(i);
      continue;
    }
    while (stack.length > 0 && A[stack[stack.length - 1]] > A[i]) {
      // 先存储在删除
      ans[stack[stack.length - 1]] = i;
      stack.pop();
    }
    stack.push(i);
  }

  // 栈中还有元素，则没有右边比它小的了，全设置为 -1
  while (stack.length > 0) {
    let index = stack.pop();
    ans[index] = -1;
  }

  return ans;
}

// findRightSmall([5, 2])

/**
数组中右边第一个比我大的元素的位置
*/
function findRightBig(A) {
  // 递减栈（小数消大数）
  // index
  let stack = [];
  let ans = [];

  for (let i = 0; i < A.length; i++) {
    if (stack.length <= 0) {
      stack.push(i);
      continue;
    }
    while (stack.length > 0 && A[stack[stack.length - 1]] < A[i]) {
      // 先存储在删除
      ans[stack[stack.length - 1]] = i;
      stack.pop();
    }
    stack.push(i);
  }

  // 栈中还有元素，则没有右边比它小的了，全设置为 -1
  while (stack.length > 0) {
    let index = stack.pop();
    ans[index] = -1;
  }

  return ans;
}
// findRightBig([5, 2])

/**
数组中元素左边离我最近且比我小的元素的位置
*/
function findLeftSmall(A) {
  // index，递增栈
  let stack = [];
  let ans = [];

  for (let i = A.length - 1; 0 <= i; i--) {
    if (stack.length <= 0) {
      stack.push(i);
      continue;
    }
    while (stack.length > 0 && A[stack[stack.length - 1]] > A[i]) {
      ans[stack[stack.length - 1]] = i;
      stack.pop();
    }
    stack.push(i)
  }


  while (stack.length > 0) {
    ans[stack[stack.length - 1]] = -1;
    stack.pop();
  }

  return ans;
}
// findLeftSmall([5, 2, 6, 7])

/**
数组中元素左边离我最近且比我大的元素的位置
*/
function findLeftBig(A) {
  // index，递减栈
  let stack = [];
  let ans = [];

  for (let i = A.length - 1; 0 <= i; i--) {
    if (stack.length <= 0) {
      stack.push(i);
      continue;
    }
    while (stack.length > 0 && A[stack[stack.length - 1]] < A[i]) {
      ans[stack[stack.length - 1]] = i;
      stack.pop();
    }
    stack.push(i)
  }


  while (stack.length > 0) {
    ans[stack[stack.length - 1]] = -1;
    stack.pop();
  }

  return ans;
}
// findLeftBig([5, 2, 6, 7])


/**
【题目】给定一个正整数数组和 k，要求依次取出 k 个数，输出其中数组的一个子序列，需要满足：1. 长度为 k；2.字典序最小。
输入：nums = [3,5,2,6], k = 2
输出：[2,6]
解释：在所有可能的解：{[3,5], [3,2], [3,6], [5,2], [5,6], [2,6]} 中，[2,6] 字典序最小。
所谓字典序就是，给定两个数组：x = [x1,x2,x3,x4]，y = [y1,y2,y3,y4]，如果 0 ≤ p < i，xp == yp 且 xi < yi，那么我们认为 x 的字典序小于 y。
*/
function findSmallSeq(nums, k) {
  // 递增栈
  let stack = [];
  let ans = [];

  for (let i = 0; i < nums.length; i++) {
    if (stack.length <= 0) {
      stack.push(nums[i]);
      continue;
    }
    // 小数消大数 && 栈不为空且栈中元素大于当前元素且栈中元素length + nums.length - i
    while (stack.length > 0 && stack[stack.length - 1] > nums[i] && stack.length + nums.length - i > k) {
      stack.pop();
    }
    stack.push(nums[i])
  }

  while (stack.length > 0) {
    ans.unshift(stack.pop());
  }
  return ans;
}
// console.log(findSmallSeq([9, 2, 4, 5, 1, 2, 3, 0], 3))
// console.log(findSmallSeq([3, 5, 2, 6], 2))


/**
 * https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/01.Stack/84.%E6%9F%B1%E7%8A%B6%E5%9B%BE%E4%B8%AD%E6%9C%80%E5%A4%A7%E7%9A%84%E7%9F%A9%E5%BD%A2.java
 * 给定一个数组，数组中的元素代表木板的高度。请你求出相邻木板能剪出的最大矩形面积
 * @param {number[]} heights
 * @return {number}
 */
var largestRectangleArea = function (heights) {
  let ans = 0;
  let len = heights == null ? 0 : heights.length;
  let rights = rightMinIndexs(heights)
  let lefts = leftMinIndexs(heights)
  for (let i = 0; i < len; i++) {
    let height = heights[i];
    let leftPos = lefts[i];
    let rightPos = rights[i] === -1 ? len : rights[i];

    let width = rightPos - leftPos - 1;
    let area = height * width;

    ans = Math.max(ans, area);
  }

  return ans;
};

// leftMinIndex
// rightMinINdex
// (leftMinIndex - rightMinINdex - 1) * heights[i]
function rightMinIndexs(heights) {
  let len = heights.length;
  // 放右边最小的index
  let res = [];
  // 放 index
  let stack = [];

  for (let i = 0; i < len; i++) {
    while (stack.length > 0 && heights[stack[stack.length - 1]] > heights[i]) {
      res[stack[stack.length - 1]] = i;
      stack.pop();
    }
    stack.push(i);
  }

  while (stack.length > 0) {
    res[stack[stack.length - 1]] = -1;
    stack.pop();
  }

  return res;
}
function leftMinIndexs(heights) {
  let len = heights.length;
  // 放左边最小的index
  let res = [];
  // 放 index
  let stack = [];

  for (let i = len - 1; i >= 0; i--) {
    while (stack.length > 0 && heights[stack[stack.length - 1]] > heights[i]) {
      res[stack[stack.length - 1]] = i;
      stack.pop();
    }
    stack.push(i);
  }

  while (stack.length > 0) {
    res[stack[stack.length - 1]] = -1;
    stack.pop();
  }

  return res;
}
// [2,1,5,6,2,3]

// console.log(largestRectangleArea([2, 1, 5, 6, 2, 3]))


