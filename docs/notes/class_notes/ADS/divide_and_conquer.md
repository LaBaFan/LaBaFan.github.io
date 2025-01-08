# Divide and Conquer
General recurrence : T(N) = aT(N/b) + f(N)

$$
T(N) = 2T(N/2) + cN = 2[2T(N/2^2) + cN/2] +cN = 2^2T(N/2^2) + 2cN = \dots = 2^kT(N/2^k) + kcN = N + cNlogN = O(NlogN)
$$

$$
if　T(N) = 2T(N/2) + cN^2 = 2[2T(N/2^2) + cN^2/2^2] + cN^2 = 2^kT(N/2^k) + cN^2(1+ 1/2) = \dots = 2^kT(N/2^k) + cN^2(1+1/2+ \dots + 2/2^k) = \Omega(N^2)
$$

??? example1
    suppose $T(N) = 2T(\lfloor\sqrt{n}\rfloor) + \log{n},T(N) = ?$

    令$m = \log{n}$,那么原式可变为$T(2^m) = 2T(2^{\frac{m}{2}}) + m$

    然后另$S(m) = T(2^m)$,那么$S(m) = 2S(\frac{m}{2}) + m$,这是我们熟悉的归并排序的结果,因为$S(m) = O(m\log{m})$,那么$T(N) = \log{n}\log{\log{n}}$

??? example2
    suppose $T(N) = 2T(\lfloor\frac{N}{2}\rfloor + 17) + N$

    当$N$很大的时候,17是完全可以被我们忽略的,所以直接猜测$O(n\log{n})$,代入验证就可以了

??? example3
    给定一个整数M,

    $$
    T(n) =
    \left\{
    \begin{matrix}
    8T(\frac{n}{2}) + 1,n^2 > M \\
    M \ ,otherwise
    \end{matrix}
    \right.
    $$
    
    有$\log_{2}{\frac{n}{\sqrt{M}}}$层,每层1个单位时间,且有$8^{\log_{2}{\frac{n}{\sqrt{M}}}}$个叶子,每个叶子M个单位时间,故总时间为
    
    $$
    O(M \cdot 8^{\log_{2}{\frac{n}{\sqrt{M}}}} + \log_{2}{\frac{n}{\sqrt{M}}}) = O(\frac{n^3}{M})
    $$

## Master Method

### Form 1
$$
T(n) = aT(\frac{n}{b}) + f(n),a \geq 1,b\geq2 \notag
$$

1. 若对于某个$\epsilon$有$f(n) = O(n^{\log_{b}a-\epsilon})$,则$T(n) = \Theta(n^{\log_{b}a})$;
2. 若$f(n) = \Theta(n^{\log_{b}a})$,则$T(n) = \Theta(n^{\log_{b}a}\log{n})$;
3. 若对于某个$\epsilon$有$f(n) = \Omega(n^{\log_{b}a+\epsilon})$,且对某个常数$c < 1$和所有足够大的$n$有$af(n) \leq cf(n)$,则$T(n) = \Theta(f(n))$

 - In example 2,the conclusion is wrong because $ f(N) = NlogN $ doesn't match any form above.So we can't use master method.

### Another form of master method

1. 若对于某个常数有$c>1$有$af(\frac nb)=cf(n)$,则$T(n) = \Theta(n^{\log_b a})$;
2. 若$af(\frac nb)=f(n)$,则$T(n)=\Theta(n^{log_ba}\log n)$;
3. 若对于某个常数$c<1$有$af(\frac nb)=cf(n)$,则$T(n)=\Theta(f(n))$;

同样是看谁占据主导地位,最后时间复杂度就由谁控制.

### Theorem

对于递推式$T(n)=aT(\frac nb)+\Theta(n^k\log^pn),a \geq1,b>1,k\geq1,p\geq0$

1. 若$a>b^k$,则$T(n) = \Theta(n^{\log_ba})$;
2. 若$a=b^k$,则$T(n)=\Theta(n^k\log^{p+1}n)$;
3. 若$a<b^k$,则$T(n) = \Theta(n^k\log^pn)$.

??? tips "主定理记忆小技巧"
    - 主定理顾名思义是看谁占主导地位,如果$a > b^k$,那么我们就可以说是$\log_{b}{a}$占据了主导地位,这时候$T(N) = O(N^{\log_{b}{a}})$
    - 而如果$a < b^k$,我们就可以说是$f(N)$占据了主导地位,这时候$T(N) = O(f(N))$
    - 如果相等,二者各占一半,$T(N) = O(f(N)\log{N})$
    - 其他两种形式也是一样的

??? info "更强的主定理"
    对于上面的主定理我们还有更强的形式:
    
    $$
    \begin{align*}
    &对于递推式T(n)=aT(\frac nb)+\Theta(n^k\log^pn),a \geq1,b>1,k\geq1,p为任意实数\\
    &1. 若a>b^k,则T(n) = \Theta(n^{\log_ba});\\
    &2. 若a=b^k,则\\
    &   (a). 若p>-1,则T(n)=\Theta(n^k\log^{p+1}n);\\
    &   (b). 若p=-1,则T(n)=\Theta(n^k\log{\log{n}});\\
    &   (c). 若p<-1,则T(n)=\Theta(n^k);\\
    &3, 若a<b^k,则 \\
    &   (a). 若p\geq 0,则T(n) = \Theta(n^k\log^pn).\\
    &   (b). 若p<0,则T(n) = \Theta(n^k).
    \end{align*}
    $$

## 最近点对问题

分别为三个部分,左最近点对、右最近点对和分离最近点对,关键在于线性时间找到分离最近点对.

我们首先可以取$x$坐标的中点,记为$\overline{x}$,然后考虑$\lbrack\overline{x}-\delta,\overline{x}+\delta\rbrack$($\delta$是左右两半中最近点对距离)之间的所有点$q_1,q_2,\dots q_l$,它们按$y$坐标排序.设$q_i$的坐标为$y_i$,那么我们只需要对$q_i$检查$x$坐标在$\lbrack\overline{x}-\delta,\overline{x}+\delta\rbrack$之间,$y$坐标在$\lbrack y_i,y_i+\delta\rbrack$之间构成的长方形区域中的点是否有更近点点对即可(所有点往上找就行,往下和下面的点往上找重合).

我们将这个长方形区域平均分为8块,则每块内最多出现一个点,否则每块内两点距离不超过$\frac{\sqrt 2}{2}\delta$,并且每块都不跨中点,这与$\delta$是左右两半中最近点对距离矛盾,因为我们可以找到距离最短的两点.所以对于每个$q_i$,我们只需找向上7个点即可,所以找分离最近点对的时间复杂性是线性的.

[最近点对](https://oi-wiki.org/geometry/nearest-points/)
