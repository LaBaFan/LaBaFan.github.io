---
comments: true
---

# B+ TREE

如果一个B+树是order M的话,那么:

1. 它的所有数据都储存在叶子节点,并且所有的叶子结点都在同一层
2. 每个叶子结点有$2 - M$个数据
3. 每个非叶子节点有$\lceil M/2 \rceil - M$个孩子

![B+树](./figures/B+_tree/B+树.png)