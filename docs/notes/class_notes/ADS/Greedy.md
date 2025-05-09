---
comments: true
---

# 贪心算法(Greedy)

## 活动选择问题

### 交换参数法

要证明我们的解是最优解,我们可以假设一个最优解,然后把最优解调成我们的解,证明它不会变差

我们的最优解是从前往后依次选择结束最早的活动.或者反过来,从后往前依次找开始最晚的活动.

## 调度问题

我们有$n$个任务,每个任务$i$有一个完成需要的时间$l_i$和权重$w_i$,我们只能按一定顺序完成这些任务,我们的目标就是最小化加权完成时间之和$T=\min\sum_{i=1}^{n}w_iC_i(\sigma)$

其中$\sigma$是我们完成次序的一个调度方法,$C_i(\sigma)$是某个任务的完成时间(即从流程开始一直到它被完成所需的时间).

## 哈夫曼编码

希望找到一个字母表的期望长度最小(依据字母出现频率)的前缀编码