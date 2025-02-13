---
comments: true
---

# NP-complete

三个经典的存在多项式时间算法的问题:

1. 最短路径问题:给定一个有向图$G=(V,E)$,即使是带负权的,我们可以在$O(|V||E|)$的时间内找到从单一源点开始的最短路径;
2. 欧拉回路问题:是否存在一个回路(即起点终点是同一个顶点)使得它恰好经过图中每条边一次?这个问题可以在$O(|E|)$的时间内用深度优先搜索解决;
3. 2-CNF的可满足性问题(简称2-SAT问题):我们称一个逻辑表达式是$k-CNF$即(k-合取范式)的,如果它是由$k$个子句的合取($\wedge$)构成的,每个子句是由$k$个变量或者它们的否定构成的析取($\vee$).2-SAT问题就是判断一个2-CNF逻辑表达式是否存在对其变量的某种0和1的赋值,使得它的值为1,这个问题可以在多项式时间内解决.例如

$$
(x_1\vee\neg x_2)\wedge(\neg x_1\vee x_3)\wedge(\neg x_2 \vee \neg x_3)\notag
$$

​	满足赋值条件$x_1=1,x_2=0,x_3=1$.这一问题与图论中的强连通分量有关.

??? warning "0-1背包问题"
    有一个容易出现混淆的$0-1$背包问题,我们最终的时间复杂度为$O(nC)$,$n$是输入的物品个数,$C$是背包最大容量.注意我们的$C$在输入时,是以二进制的方式表达的,它二进制表示的长度是$\log C$,而$n$是$\log C$的指数,因此它的时间复杂度实际上是指数级别的.

对上面问题进行变体:

1. 最短路问题变体:如果带负圈的最短路问题中我们的要求不是找到负圈就结束,而是给出具有最短路的无环路径,那我们就无法在多项式时间内解决这个问题;
2. 哈密顿回路:是否存在一个回路,经过图中其他节点刚好一次,这个问题也不存在多项式时间算法;
3. 3-SAT问题:没有多项式时间算法.

## 复杂类

### DTIME和NTIME

我们考虑一族函数$f(n)$.称一个问题是:

1. $DTIME(f(n))$的,如果求解规模为$n$的问题的确定性图灵机能在$f(n)$步之内停机;
2. $NTIME(f(n))$的,如果求解规模为$n$的问题的非确定性图灵机能在$f(n)$步之内停机;

一个形式语言$L$的判定问题的规模指的是输入的长度.

 - *P*问题:可以在多项式时间内解决(确定性图灵机能在多项式时间内停机解决).
   - $P=co-P$

 - *NP*:可以在多项式时间内验证(给一个解,我能验证它是对的还是错的)
 - *NP-complete*:
   - 既是$NP$,又是$NP-hard$,如果我们能在多项式时间内解决一个$NPC$问题,那么所有的$NP$问题都能在多项式时间内解决.
   - 它本身在*NP*中,并且所有$NP$问题都可以在多项式时间内归约到它

 - *NP-hard*:
   - 它不一定在*NP*中,但所有的$NP$问题都可以在多项式时间内归约到它

!!! note
    它们之间的关系:

    - $P$问题可以在多项式时间内解决,自然也能在多项式时间内验证,所以$P$问题也是$NP$问题;
    - $NPC$问题是$NP$问题的子集,$NPC \subseteq NP$;
    - $NPC$是$NP-hard$的子集,$NPC \subseteq NP-hard,NPC = NP \cap NP-hard$;
    - $NP-hard$问题不一定是$NP$问题,$NP-hard \nsubseteq NP$;
    - 如果$NPC$问题能在多项式时间内解决,那么所有的$NP$问题就能在多项式时间内解决,$P=NP \Rightarrow P=NP=NPC$.

如果我们不能在多项式时间内解决一个$NPC$问题,那么因为$NPC$问题是$NP$问题的子集,所以$P\neq NP$.

- $SAT$问题是$NP-完全$的,并且$SAT \leq_{P} 3-SAT$.
- $3-SAT$是$NP-完全$的.
- $2-SAT$是多项式时间可解的.
- 0-1背包问题是NP困难的
- 哈密尔顿回路是$NP-complete$
- 停机问题是$NP$困难
- Post Correspondence Problem是不确定的,不在NP内
- (0,1,2)- championship是P问题,(0,1,3)是NP完全问题
- 顶点覆盖是$NP完全$问题并且顶点覆盖与独立集问题等价(一个顶点覆盖的补就是独立集).
  - 在同一个图中,顶点覆盖与独立集是互补的
  - 一个图$G$中大小为$k$的团,对应补图中大小为$|V|-k$的顶点覆盖


## Karp归约

称一个语言A可以被多项式地归约(或Krap归约)到B,如果存在一个可以在多项式时间内计算的函数$f$使得
$$
x\in A \Leftrightarrow f(x)\in B\notag
$$
记作$A\leq_p B$.那么$A$一定不会比$B$难
