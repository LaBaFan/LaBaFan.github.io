---
comments: true
---

# Chapter 3: 程序的机器级表示

!!! note "前言"

    我们如今编程都是写诸如 C, Python, Jave 之类的高级语言,而过去的程序员们是直接写汇编的,如今的编译器已经可以把高级语言翻译成汇编,那么学习汇编对我们来说似乎就没那么有必要了.
    
    那为什么我们还要花时间来学习汇编语言呢?因为通过阅读汇编代码,我们可以理解编译器的优化能力,分析代码中隐藏的低效率问题,并尝试最大化一段代码的性能.同时,高级语言提供的抽象层会隐藏一些我们想要了解的细节,而汇编则可以帮助我们理解这些细节.
    
    本章我们将基于 x86-84 架构学习:C语言,汇编代码以及机器码之间的关系;了解如何实现C语言的控制结构,函数调用,数组和指针等;最后将会学习一些使用 GDB 调试代码的技巧.

## **3.2 程序编码**
### **3.2.1 机器级代码**
计算机系统使用多种不同形式的抽象,利用更简单的抽象来隐藏实现的细节.对于机器级编程来说,有两种抽象尤为重要:

- **指令集体系结构或指令集架构(ISA)**来定义机器级程序的格式和行为.它将程序的行为描述成好像每条指令都是按顺序执行的,一条结束后再执行下一条.处理器的硬件远比,它们并发地执行许多指令,但是可以采取措施保证整体行为与ISA指定的顺序一致.
- 机器级程序使用的内存地址是虚拟地址,提供的内存模型看上去是一个非常大的字节数组.

一些对C语言程序员隐藏的处理器状态在机器级编程中是可见的:

- **程序计数器(PC,在x86-64中用%rip表示)**:给出将要执行的下一条指令在内存中的地址.
- **整数寄存器文件**:包含16个命名的位置,分别存储64位的值.
- **条件码寄存器**:保存最近执行的算术或逻辑指令的状态信息.它们用来实现控制或数据流中的条件变化,比如说用来实现```if```和```while```语句.
- **一组向量寄存器**:用来存储一个或多个整数或浮点数值.

### **3.2.2 代码示例**
机器执行的程序只是一个字节序列,它是对一系列编码的指令.机器对产生这些指令的源代码几乎一无所知.

一些关于机器代码和它的反汇编表示的特性值得注意:

- x86-64的指令长度从1到15个字节不等.常用的指令以及操作数较少的指令通常比较短.
- 设计指令格式的方式是,从某个给定位置开始,可以将字节唯一地解码成机器指令.例如,只有指令```pushq %rbx```的第一个字节是```0x53```.
- 反汇编器只是基于机器代码文件中的字节序列来确定汇编代码.它不需要访问该程序的源代码或汇编代码.
- 反汇编器的指令命名规则与 GCC 生成的汇编代码使用的有细微差别.例如,```movq```指令在反汇编器中被命名为```mov```.

### **3.2.3 关于格式的注解**
假设我们有如下代码:

```C
long mult2(long, long);

void multstore(long x, long y, long *dest) {
    long t = mult2(x, y);
    *dest = t;
}
```

使用 GCC 生成汇编代码之后:

```asm
    .file "010-mstore.c"
    .text
    .globl multstore
    .type multstore, @function

multstore:
    pushq %rbx
    movq %rdx, %rbx
    call mult2
    movq %rax, (%rbx)
    popq %rbx
    ret
    .size multstore, .-multstore
    .ident "GCC: (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0"
    .section .note.GNU-stack,"",@progbits
```

我们发现有很多以'.'开头的行,这些行是汇编器的伪指令,用来控制汇编器的行为.我们通常可以忽略这些行.

所以我们采用这样一种格式来表示汇编代码,它省略了大部分伪指令,但包含行号和解释性说明,例:

<pre>
<code>
    <font color = blue>void multisotre(long x, long y, long *dest) {</font>
    <font color = blue>x in %rdi, y in %rsi, dest in %rdx</font>
<font color = blue>1</font>   multisotre:
<font color = blue>2</font>       pushq %rbx        <font color = blue>Save %rbx</font>
<font color = blue>3</font>       movq %rdx, %rbx   <font color = blue>Copy dest to %rbx</font>
<font color = blue>4</font>       call mult2        <font color = blue>Call mult2(x, y)</font>
<font color = blue>5</font>       movq %rax, (%rbx) <font color = blue>Store result at dest</font>
<font color = blue>6</font>       popq %rbx         <font color = blue>Restore %rbx</font>
<font color = blue>7</font>       ret               <font color = blue>Return</font>
</code>
</pre>
## **3.3 数据格式**

| C声明  | Intel数据类型 | 汇编代码后缀 | 大小(字节) |
| :----: | :-----------: | :----------: | :--------: |
|  char  |     字节      |      b       |     1      |
| short  |      字       |      w       |     2      |
|  int   |     双字      |      l       |     4      |
|  long  |     四字      |      q       |     8      |
| char*  |     四字      |      q       |     8      |
| float  |    单精度     |      s       |     4      |
| double |    双精度     |      l       |     8      |

??? question

    我们观察到，在汇编代码指令中，都有一个字符后缀，而整数 int 和 双精度浮点数 double 都是用 ‘l’ 后缀，这样是否会产生歧义呢？

    答案是不会，因为整数和浮点数使用的是完全不同的两组指令和寄存器。

## **3.4 访问信息**

## **3.5 Arithmetic and Logical Operations**

## **3.6 Control**

## **3.7 Procedures**

## **3.8 Array Allocation and Access**

## **3.9 Heterogeneous Data Structures**

## **3.10 Combining Control and Data in Machine-Level Programs**

## **Floating-Point Code**