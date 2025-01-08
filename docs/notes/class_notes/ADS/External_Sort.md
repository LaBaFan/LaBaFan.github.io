---
comments: true
---

# 外部排序 (External Sort)

- 假设有$N$个数据，同时能处理$M$个record
- 最普通的方法需要$1+\log{\lceil \frac NM \rceil}$个pass
- 对于$k-way\ merge$，需要$1+\log_{k}{\lceil \frac NM \rceil}$个pass，使用$2k$个tapes

## 最优分配策略

对于$k-way\ merge$，如何分配才能使总的$pass$最小？以三阶合并为例（总共31个run）：

1. 写出$k$阶斐波那契数列
: 1, 1, 2, 4, 7, 13, 24, 44

2. 寻找最优分配

: 找到第一个大于31的数：44

: 计算差值：44 - 31 = 13

: 初步分配：24, 13, 7

: 调整分配：(24-13), 13, 7，即11, 13, 7
