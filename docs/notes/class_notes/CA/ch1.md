---
comments: true
---

# **计算机设计基础**

<figure markdown="span">
![](./figure/ch1/architecture.png)
<figcaption>计算机系统的层次结构</figcaption>
</figure>

## **Classes of Computers**

- Desktop computers(or Personal computers)
    - General purpose, variety of software
    - Emphasize good performance for a single user at relatively low cost.
    - Mostly execute third-party software.
- Server computers
    - Emphasize great performance for a few complex applications.
    - Or emphasize reliable performance for many users at once.
    - Greater computing, storage, or network capacity than personal computers.
- Embedded computers
    - Largest class and most diverse.
    - Hidden as components of systems.
    - Stringent power/performance/cost constraints.
- Personal Mobile Devices
    - Smartphones
    - Tablet/iPad
    - generally have the same design requirements as PCs
- Supercomputer
    - Computer cluster
    - High capacity, performance, reliability
    - Range to building sized

### **Classed by Flynn**

- SISD: Single Instruction Stream, Single Data Stream
- SIMD: Single Instruction Stream, Multiple Data Stream
- MISD: Multiple Instruction Stream, Single Data Stream
- MIMD: Multiple Instruction Stream, Multiple Data Stream

!!! note

    IS: Instruction Stream

    DS: Data Stream

    CS: Control Stream

    CU: Control Unit

    PU: Process Unit
    
    MM&SM: Memory

<figure markdown="span">
![](./figure/ch1/Classed_by_Flynn.png)
<figcaption>Classed by Flynn</figcaption>
</figure>

## **Performance**

### **Response Time and Throughput**

- Latency(Response time)
    - Is the time between the start and completion of an event
    - How long it takes to do a take
- Throughput(bandwidth)
    - Is the total amount of work done in a given period of time
    - Total work done per unit time

### **Performance**

- Define Performance = $1 / Execution Time$
- We say that "X is $n$ time faster than Y" means

$$
Performance_X / Performance_Y = n
$$

$$
= \ Execution time_Y / Execution time_X = n
$$

!!! example "time take to run a program"

    - $10s$ on A, $15s$ on B
    - $Execution Time_B \ / \ Execution Time_A = 15s \ / \ 10s = 1.5$
    - So A is $1.5$ times faster than B

### **Measuring Execution Time**

- Elapsed time
    - Total response time, including all aspects
        - Processing, I/O, OS overhead, idle time
    - Determines system performance
- CPU time
    - Time spent processing a given job
        - Discounts I/O time, other job's shares
    - Comprises user CPU time and system CPU time
        - User CPU time: CPU time spent in the program itself
        - System CPU time: CPU time spent in the OS, performing tasks on behalf of the program.
    - Different programs are affected differently by CPU and system performance.

<font color = red><center>**The main goal of architecture improvement is to improve the performance of the system**</center></font>

## **Quantitative approaches**

### **Measuring Data Size**

- kibibyte(KiB): $2^{10}(1024) \ bytes$
- mebibyte(MiB): $2^{20}(1024^2) \ bytes$
- gibibyte(GiB): $2^{30}(1024^3) \ bytes$
- tebibyte(TiB): $2^{40}(1024^4) \ bytes$
- pebibyte(PiB): $2^{50}(1024^5) \ bytes$

### **CPU Performance**

In order to determine the effect of a design on the performance experienced by the user, we can use the following relation:

$$
\mathrm{CPU\ Execution\ Time} \ = \ \mathrm{CPU\ Clock\ Cycles} \times \mathrm{Clock\ Period}
$$

Alternatively,

$$
\mathrm{CPU\ Execution\ Time} \ = \ \frac{\mathrm{CPU\ Clock\ Cycles}}{\mathrm{Clock\ Rate}}
$$

### **CPU Clocking**

- Clock period: duration of a clock cycle
- Clock rate: cycles per second

### **CPU Time**

$$
\begin{align*}
\mathrm{CPU\ Time} \ &= \ \mathrm{CPU\ Clock\ Cycles} \times \mathrm{Clock\ Cycle\ Time} \\
\ &= \ \frac{\mathrm{CPU\ Clock\ Cycles}}{\mathrm{Clock\ Rate}}
\end{align*}
$$

!!! example

    - Computer A: $2.0$ GHz clock, $10s$ CPU time
    - Designing Computer B
        - Aim for $6s$ CPU time
        - Can do faster clock, but causes $1.2 \times \mathrm{clock cycles}$
    - How fast must Computer B clock be?

    $$
    \begin{align*}
    \mathrm{Clock\ Rate_B} &= \frac{\mathrm{Clock\ Cycles_B}}{\mathrm{CPU\ Time_B}} \ = \ \frac{1.2 \times \mathrm{Clock\ Cycles_A}}{6s} \\
    \mathrm{Clock\ Cycles_A} &= \mathrm{CPU\ Time_A} \times 
    \mathrm{Clock\ Rate_A} \ = \ 10s \times 2G Hz = 20 \times 10^9 \\
    \mathrm{Clock\ Rate_B} &= \frac{1.2 \times 20 \times 10^9}{6} = 4.0 GHz  
    \end{align*}
    $$

CPI: average cycles per Instruction

$$
\mathrm{CPI} = \frac{\mathrm{CPU\ Clock\ Cycles}}{\mathrm{Instruction\ Count}}
$$

!!! important

    $$
    \begin{align*}
    \mathrm{CPU\ Clock\ Cycles} &= \mathrm{Instructions\ for\ a\ program} \times \mathrm{Average\ Clock\ Cycles\ Per\ Instruction} \\
    \mathrm{CPU\ Time} &= \mathrm{Instruction\ Count} \times \mathrm{CPI} \times \mathrm{Clock\ Period} \\
    \mathrm{CPU\ Time} &= \frac{\mathrm{Instruction\ Count \times CPI}}{\mathrm{Clock\ Rate}}
    \end{align*}
    $$

### **Perofrmance Summary**

The BIG Picture

$$
\mathrm{CPU\ Time} = \frac{\mathrm{Instructions}}{\mathrm{program}} \times \frac{\mathrm{Clock\ Cycles}}{\mathrm{Instruction}} \times \frac{\mathrm{Seconds}}{\mathrm{Clock\ Cycle}}
$$

Performance depends on:
- Algorithm:affects IC, possibly CPI
- Programming language: affects IC, CPI
- Compiler: affects IC, CPI
- Instruction set architecture: affects IC, CPI, T_C

### **Amdahl's Law**
Amdahl's Law states that the performance improvement to be gained from using some faster mode of execution is limited by the fraction of the time faster mode can be used.

Amdahl's Law depends on two factors:

- The fraction of the time the enhancement can be exploited.
- The improvement gained bt the enhancement while it is exploited.

$$
\mathrm{Improved\ Execution\ Time} = \frac{\mathrm{Affected\ Execution\ Time}}{\mathrm{Amount\ of\ Improvement}} + \mathrm{Unaffected\ Execution\ Time}
$$

改进后的总时间等于“被改进的时间除以改进的比例”加上“未被改进的时间”。

可以记为:

$$
T_{\mathrm{improved}} = \frac{T_{\mathrm{affected}}}{\mathrm{Improvement\ factor}} + T_{\mathrm{unaffected}}
$$

!!! example 

    Multiply accounts for 80s/100s

    How much improvement in multiply performance to get $5 \times \mathrel{overall}$?

    $$
    20 = \frac{80}{n} + 20
    $$

    We know that it is impossible!

Based on the basic idea, we get the following formula

If we say the fraction of enhanced time is $f$ and the speedup of enhanced time is $Sp$:

$$
\mathrm{Execution\ time_{new}} = \mathrm{Execution\ time_{old}} \times \left((1 \ - \ f) + \frac{f}{Sp} \right)
$$

$$
\mathrm{Speedup_{overall}} = \frac{\mathrm{Execution\ Time_{old}}}{\mathrm{Execution\ Time_{new}}} = \frac{1}{(1 \ - f) + \frac{f}{Sp}}
$$

- Improved ratio: