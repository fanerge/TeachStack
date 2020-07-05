/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

// BFS（实现原理-queue）
/**
 *
 * @param {*} node {val: Number, left: node|null, right: node|null}
 * @return {array} output
 */
function BFS(node) {
  let output = [];
  // 开始前放入根节点
  let queue = [node];
  // queue不为空，继续遍历
  while (queue.length) {
    let len = queue.length;
    for (let i = 0; i < len; i++) {
      let first = queue.shift();
      output.push(first.val);
      // 将其子节点放入队列
      first.left && queue.push(first.left);
      first.right && queue.push(first.right);
    }
  }
  return output;
}

// DFS（实现原理-栈，递归原理其实也是栈，只不过是系统栈）
// 🌲的preOrder（递归版，使用系统调用栈）

function preOrder(node, ary = []) {
  if (!node) return ary;
  // 根
  ary.push(node.val);
  // 左
  preOrder(node.left, ary);
  // 右
  preOrder(node.right, ary);
  return ary;
}
// 🌲的preOrder（迭代版，使用模拟栈）
function preOrder1(root) {
  let stack = [root];
  let output = [];
  if (!root) return output;
  while (stack.length > 0) {
    let top = stack.pop();
    // 根
    output.push(top.val);
    // 放入栈的顺序相反，因为栈顶元素先被弹出
    top.right && stack.push(top.right);
    top.left && stack.push(top.left);
  }
  return output;
}

// 🌲的midOrder（递归版，使用系统调用栈）
function midOrder(root, ary = []) {
  if (!root) return ary;
  // 左
  midOrder(root.left, ary);
  // 根
  ary.push(root.val);
  // 右
  midOrder(root.right, ary);
  return ary;
}
// 🌲的midOrder（迭代版，使用模拟栈）
function midOrder1(root) {
  let stack = [];
  let output = [];
  let curr = root;
  while (curr || stack.length > 0) {
    while (curr) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop();
    output.push(curr.val);
    curr = curr.right;
  }
  return output;
}

// 🌲的postOrder（递归版，使用系统调用栈）
function postOrder(root, ary = []) {
  if (!root) return ary;
  // 左右根
  postOrder(root.left, ary);
  postOrder(root.right, ary);
  ary.push(root.val);
  return ary;
}
// 🌲的postOrder（迭代版，使用模拟栈）
function postOrder1(root) {
  let stack = [root];
  let output = [];
  if (!root) return output;
  while (stack.length > 0) {
    let top = stack.pop();
    output.unshift(top.val);
    top.left && stack.push(top.left);
    top.right && stack.push(top.right);
  }
  return output;
}

// 从中序与后序遍历序列构造二叉树
function buildTree(inorder, postorder) {
  let build = (inorder) => {
    if (inorder.length === 0) return null;
    // 先序的话，根节点在 preorder.shift()
    let rootVal = postorder.pop();
    let rootIndex = inorder.indexOf(rootVal);
    let root = new TreeNode(rootVal);
    // 先序的话，需要交换 root.right 和 root.left 个构建顺序
    root.right = build(inorder.slice(rootIndex + 1));
    root.left = build(inorder.slice(0, rootIndex));
    return root;
  };

  return build(inorder);
}
