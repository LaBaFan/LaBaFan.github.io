---
comments: true
---

# **Pipeline**

## **What is Pipeline**

Three modes of execution:

- Sequential execution
- Single overlapping execution
- Twice overlapping execution

假设指令的执行被分为三个阶段：

- Instruction fetch (IF)
- Instruction decode (ID)
- Execute (EX)

### **Sequential execution**

如果指令是顺序执行的话，只能等上一条指令执行结束后，才能执行下一条指令。

<figure markdown="span">
![](./figure/ch2/sequential_ex.png){width="400"}
<figurecaption>Sequential execution</figurecaption>
</figure>

那么总的执行时间

$$
T \ = \ \sum_{i=1}^{n}(t_{IFi} + t_{IDi} + t_{EXi}) \ = \ 3n\Delta t
$$

### **Overlapping execution**

每一条指令内部是顺序执行的，但是不同指令之间可以重叠执行。

<figure markdown="span">
![](./figure/ch2/overlap_ex.png){width="400"}
<figurecaption>Overlapping execution</figurecaption>
</figure>

上图是每个阶段时间相同，每个阶段可以很好的重叠执行。

但是，如果每个阶段时间不同的话，就会发生资源的浪费，比如：

<figure markdown="span">
![](./figure/ch2/over_waste1.png){width="400"}
<figurecaption>Overlapping execution with different time</figurecaption>
</figure>

或者：

<figure markdown="span">
![](./figure/ch2/over_waste2.png){width="400"}
<figurecaption>Overlapping execution with different time</figurecaption>
</figure>

- Single overlapping execution
    : 可以缩短$\frac{1}{3}$的时间，但是需要额外的硬件开销

    $n$条指令总的执行时间:

    $$
    T \ = \ (2n \ + \ 1)\Delta t
    $$

<figure markdown="span">
![](./figure/ch2/single_overlap.png){width="400"}
<figurecaption>Single overlapping execution</figurecaption>
</figure>

- Twice overlapping execution
    : 可以缩短$\frac{2}{3}$的时间，但是需要更多的硬件开销，并且需要另外的 FETCH, DECODE, EXECUTE 插件。

    $n$条指令总的执行时间:

    $$
    T \ = \ (n \ + \ 2)\Delta t
    $$

<figure markdown="span">
![](./figure/ch2/twice_overlap.png){width="400"}
<figurecaption>Twice overlapping execution</figurecaption>
</figure>

#### **Adding Instruction Buffer**

Conflict in access memory:

- Instruction memory & data memory
- Instruction cache & data cache (same memory):<font color = red>Harvard architecture</font>
- Multibody cross structure (same memory with limitations)
- Adding instruction buffer between instruction memory and instruction decode unit

<figure markdown="span">
![](./figure/ch2/inst_buffer.png){width="400"}
<figurecaption>Adding instruction buffer</figurecaption>
</figure>

在取指和内存中间加上一个 buffer ，只要这个 buffer 没满，就一直取指令。

添加 buffer 之后，取指的时间变得非常短，因此可以把 IF 和 ID 两个阶段合并，这样 Twice overlapping 就变成了 Single overlapping。

但是如果合并后的 ID 阶段执行时间和 EX 阶段执行时间不同的话，就会浪费资源。

#### **Advanced Control**

<figure markdown="span">
![](./figure/ch2/advanced_ctrl.png){width="400"}
<figurecaption>Advanced control</figurecaption>
</figure>

可以把 ID 阶段提前执行，然后把结果存到 buffer 中，等到 EX 阶段执行的时候再取出来。

Common features: They work by FIFO, and are composed of a group of serveral storage units that can be accessed quickly and related control logic.

通过 FIFO（先进先出）等方式，提高了指令的执行效率。

## **Classes of Pipeline**

- Single function pipeline: only the fixed function pipelining.
- Multi function pipelining: each section of the pipelining can be connected differently for serveral different functions.

<figure markdown="span">
![](./figure/ch2/multi_pipe.png){width="400"}
<figurecaption>Multi function pipelining</figurecaption>
</figure>

上图中左侧 Segmentation 表示流水线中所有的元件，中间的 FLoating Point Arithmetic 表示浮点运算需要的元件，右侧的 Multiply 表示乘法需要的元件。

而对于 Multi function pipelining，又可以分为两类：

- Static pipelining(静态流水线): 在同一时间，流水线的每个部分只能执行相同类型的操作
这就意味着对于静态流水线，只有输入的是相同类型的指令，它的效率才能最大化。

<figure markdown="span">
![](./figure/ch2/static_pipe.png){width="400"}
<figurecaption>Static pipelining</figurecaption>
</figure>

从上图可以看出，对于 Floating Point Arithmetic 和 Multiply 部分，静态流水线只能等 Floating Point Arithmetic 部分执行完毕后，才能执行 Multiply 部分。

- Dynamic pipelining(动态流水线): 在同一时间，流水线的每个部分可以执行不同类型的操作
    - 灵活，但是控制信号复杂
    - 提高单元的利用率
<figure markdown="span">
![](./figure/ch2/dynamic_pipe.png){width="400"}
<figurecaption>Dynamic pipelining</figurecaption>
</figure>

不同于静态流水线，动态流水线可以在同一时间执行不同类型的操作。

根据粒度分类：

- <font color = blue>Component level pipelining(组件级流水线)</font>: 处理器的算数和逻辑组件分成很多段，从而不同种类的操作都可以执行
- <font color = blue>Processor level pipelining</font>: 指令的解释和执行是通过流水线实现的。指令的执行过程被分成很多小部分，每个小部分都是通过独立的功能模块实现的。
- <font color = blue>Inter processor pipelining</font>: 由一系列的处理器串联组成，每个处理器执行一个指令的一个部分，然后把结果传递给下一个处理器。

根据是否线性分类：

- <font color = blue>Linear pipelining</font>: 流水线每个部分串联，没有反馈回路。数据最多流过每个部分一次。
- <font color = blue>Nonlinear pipelining</font>: 串行连接，并且存在反馈回路。

<figure markdown="span">
![](./figure/ch2/nonlinear.png){width="400"}
<figurecaption>Nonlinear pipelining</figurecaption>
</figure>

分为顺序/乱序：

- <font color = blue>Ordered pipelining</font>: 在流水线中，任务输出顺序与输入顺序完全相同，每个任务按顺序流过流水线。
- <font color = blue>Disordered pipelining</font>: 任务的输出顺序与输入顺序不同，允许后边的任务先完成。

根据是否能处理向量数据分类：

- <font color = blue>Scalar pipelining</font>: 流水线没有向量处理程序，只能处理标量数据。
- <font color = blue>Vector pipelining</font>: 流水线可以处理向量数据。

## **Pipeline Performance**

### **Throughput(TP)**

TP: 每个时钟周期可以完成的指令数

$$
TP \ = \ \frac{n}{T_K}
$$

$n$: 完成的指令数
$T_K$: 完成所有指令所用的时间

<figure markdown="span">
![](./figure/ch2/TP.png){width="400"}
<figurecaption>Throughput</figurecaption>
</figure>

$$
TP = \frac{n}{T_K} = \frac{n}{(m + n - 1)T_0}
$$

当 $n$ 很大，即指令很多时，$TP$ 可以近似为：

$$
TP_{max} = \frac{n}{(m+n-1)T_0} = \frac{1}{T_0}
$$

就是说流水线的吞吐量只与时钟周期有关，与流水线的级数无关。

那么

$$
TP \ = \ \frac{n}{n + m - 1}TP_{max}
$$

如果流水线每个阶段的时间不一样的话，我们把最长的那个阶段叫做 bottleneck stage(瓶颈阶段).

那么

$$
\begin{align*}
TP &= \frac{n}{\sum_{i=1}^{n}\Delta t_i + (n-1)max(\Delta t_1, \Delta t_2, \cdots, \Delta t_n)} \\
&= \frac{n}{(m-1)+n \ max(\Delta t_1, \Delta t_2, \cdots, \Delta t_n)}
\end{align*}
$$

$$
TP_{max} = \frac{1}{max(\Delta t_1, \Delta t_2, \cdots, \Delta t_n)}
$$

可以看到，$TP_{max}$ 只与瓶颈阶段时间有关。

#### **Common methods to solve pipeline bottleneck**

- Subdivision: 把瓶颈阶段分成几个小阶段，每个阶段时间与其他阶段相等，都是$\Delta t$。

<figure markdown="span">
![](./figure/ch2/subdivision.png){width="400"}
<figurecaption>Subdivision</figurecaption>
</figure>

- Repetition: 在瓶颈阶段多用几个部件，这样就可以提高吞吐量。

<figure markdown="span">
![](./figure/ch2/repetition.png){width="400"}
<figurecaption>Repetition</figurecaption>
</figure>

### **Speedup(Sp)**

Speedup(加速比): 一个流水线相对于一个非流水线的性能提升。

<figure markdown="span">
![](./figure/ch2/Speedup.png){width="400"}
<figurecaption>Speedup</figurecaption>
</figure>

$$
\begin{align*}
Sp &= \frac{n \times m \times \Delta t}{(m + n - 1)\Delta t} \\
&= \frac{n \times m}{m + n - 1}
\end{align*}
$$

如果 $n \gg m$，那么 $Sp \approx m$。

### **Efficiency($\eta$)**

Efficiency(效率): 从计算机硬件考虑，纵轴代表使用不同的部件，效率指的是我们真正使用这个部件占整个时空的百分比。

<figure markdown="span">
![](./figure/ch2/Speedup.png){width="400"}
<figurecaption>Efficiency</figurecaption>
</figure>

总空间为 $m \times (n-m+1)$，因为一共有$m$个部件，每个部件有$n-m+1$个时空。

指令占的空间为 $n \times m$。一共$n$个指令，每个指令占$m$个时空。

则效率

$$
\eta = \frac{n \times m}{m \times (n-m+1)} = \frac{n}{n-m+1}
$$

若 $n \gg m$，那么 $\eta \approx 1$。

!!! question

    === "Static pipeline"

        <font figure markdown="span">
        ![](./figure/ch2/ques1.png){width="400"}
        </font>

        注意到这里是<font color = red>静态双功能流水线</font>，必须在乘法做完之后才能做加法。

        <figure markdown="span">
        ![](./figure/ch2/ans1.png){width="400"}
        </figure>

        所以:

        $$
        TP = \frac{4 + 3}{15}\Delta t = \frac{7}{15}\Delta t
        $$

        $$
        Sp = \frac{4 \times 3\Delta t + 3 \times 4\Delta t}{15\Delta t} = 1.6
        $$

        $$
        \eta = \frac{3 \times 4\Delta t + 4 \times 3\Delta t}{4 \times 3\Delta t} = 32%
        $$

    === "Dynamic pipeline"

        <font figure markdown="span">
        ![](./figure/ch2/ques2.png){width="400"}
        </font>

        注意到这里是<font color = red>动态双功能流水线</font>，可以在乘法做的同时做加法。

        <figure markdown="span">
        ![](./figure/ch2/ans2.png){width="400"}
        </figure>
    
既然流水线这么好，那么我们是不是可以把流水线的级数无限加大呢？

实则不然，太多的级数会导致：

- Lots of complications，太复杂了
- 大量的指令同时进行，中间可能存在复杂的依赖关系
- 控制信号太多了
- 需要特别多的流水线寄存器，硬件开销太大