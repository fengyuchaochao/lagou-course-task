//leetcode: https://leetcode-cn.com/problems/gu-piao-de-zui-da-li-run-lcof/

//暴力法
var maxProfit = function(prices) {
    let max = 0;
    for (let i = 0; i < prices.length - 1; i++) {
        for (let j = i + 1; j < prices.length; j++) {
            if (prices[j] - prices[i] > max) {
                max = prices[j] - prices[i];
            }
        }
    }
    return max;
};

//动态规划解法

