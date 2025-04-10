---
comments: true
---

# **Design**

牛顿迭代法

$$
x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}
$$

今天的目标就是做一个牛顿法的求解器。

## **类的抽象**

如果我们想求 $\sqrt{2}$，那代码很简单：

```cpp
#include <iostream>
#include <cmath>

int main()
{
    double a = 2;
    double tolerance = 1e-12;
    int max_iterations = 30;

    int k = 0;
    double x = 1.0;
    std::cout << "k = " << k << ", x = " << x << std::endl;

    while ((std::fabs(x * x - a) > tolerance) && (k++ < max_iterations))
    {
        x = x - (x * x - a) / (2 * x);
        std::cout << "k = " << k << ", x = " << x << std::endl;
    }
}
```

但是如果想把代码做的更通用一点，那么我们就要把代码做的更抽象一点。

```cpp
#include <iostream>
#include <cmath>

class NewtonSolver
{
private:
    double a;
    double tolerance;
    int max_iterations;

    int k;
    double x;

public:
    NewtonSolver(double a = 612.0, double tolerance = 1e-12, int max_iterations = 30) : a(a), tolerance(tolerance), max_iterations(max_iterations) {}

    void printInfo()
    {
        std::cout << "k = " << k << ", x = " << x << std::endl;
    }

    double f(double x)
    {
        return x * x - a;
    }

    double df(double x)
    {
        return 2 * x;
    }

    bool is_close(double x) 
    {
        return (std::fabs(f(x)) < tolerance);
    }

    void improve(double x0)
    {
        k = 0;
        x = x0;
        printInfo();

        while (!is_close(x) && (k < max_iterations))
        {
            k++;
            x = x - ((f(x)) / df(x));
            printInfo();
        }
    }
};

int main()
{
    NewtonSolver solver;
    solver.improve(1.0);
}
```

但是我们发现上边的代码有一点不好，我们的牛顿求解器需要满足更普遍的问题，但是上边的 $f(x)$ 和 $f'(x)$ 是死的，不能被修改。

所以我们需要把 $f(x)$和 $f'(x)$ 拿出来，单独定义成一个类，这个类继承自 `NewtonSolver`，然后我们就可以在这个类里定义 $f(x)$ 和 $f'(x)$ 了。

```cpp
class NewtonSolver
{
private:
    virtual double f(double x) = 0;
    virtual double df(double x) = 0;

    double tolerance = 1e-12;
    int max_iterations = 30;
    int k;
    double x;

    void printInfo()
    {
        std::cout << "k = " << k << ", x = " << x << ", f(x) = " << f(x) << std::endl;
    }

    bool is_close(double x)
    {
        return (std::fabs(f(x)) < tolerance);
    }

public:
    NewtonSolver() : k(0), x(1) {}

    void improve(double x0)
    {
        k = 0;
        x = x0;
        printInfo();

        while (!is_close(x) && (k < max_iterations))
        {
            k++;
            x = x - ((f(x)) / df(x));
            printInfo();
        }
    }
};

class SqrtSolver : public NewtonSolver
{
private:
    double a;

public:
    SqrtSolver(double a) : a(a) {}

private:
    double f(double x) override
    {
        return x * x - a;
    }
    double df(double x) override
    {
        return 2 * x;
    }
};
```

这样我们只用提供 $f(x)$ 和 $f'(x)$ 就可以很方便地使用牛顿迭代法了。

我们还可以自己写一个求解 $n$ 次方的求解器：

```cpp
class NthRootSolver : public NewtonSolver
{
private:
    int n;
    double a;

public:
    NthRootSolver(int n, double a) : n(n), a(a) {}

    double f(double x) override
    {
        return std::pow(x, n) - a;
    }

    double df(double x) override
    {
        return n * pow(x, n - 1);
    }
};
```

另一种抽象方法是函数式编程。

## **函数式编程**

函数式编程中，函数可以被当作参数传递，或者被当作返回值。

在函数式编程中没有类的概念，一切工作都是函数来完成的。

```cpp
#include <iostream>
#include <cmath>
#include <functional>

using fn = std::function<double(double)>;

void printInfo(int k, double x, double fx)
{
    std::cout << "k = " << k << ", x = " << x << ", f(x) = " << fx << std::endl;
}

bool is_close(double fx, double tolerance)
{
    return (std::fabs(fx) < tolerance);
}

double newton_solver(fn f, fn df, double x0, double tolerance = 1e-12, int max_iterations = 30)
{
    int k = 0;
    double x = x0;
    printInfo(k, x, f(x));

    while (!is_close(f(x), tolerance) && (k < max_iterations))
    {
        k++;
        x = x - (f(x) / df(x));
        printInfo(k, x, f(x));
    }
    return x;
}

double sqrt_newton(double a, double x0 = 1.0)
{
    auto f = [a](double x)
    { return x * x - a; };
    auto df = [](double x)
    { return x * 2; };

    return newton_solver(f, df, x0);
}

int main()
{
    sqrt_newton(64);
}
```

可以看到这里的全部工作都是通过函数来完成的，需要注意的是，我们使用了 ```fn``` 来进行函数的传递。```using fn = std::function<double(double)>;``` 代表它是一个函数，需要一个 ```double``` 类型的参数，返回一个 ```double``` 类型的值。

!!! NOTE

    注意到在 ```sqrt_newton``` 函数中出现了一类新的语句 ```auto f = [a](double x) { return x * x - a; };```, 这个叫做 ```lambda``` 语句，中括号代表需要从上下文获取参数，这里就是需要获取 ```a```, 传递给大括号中的表达式。

所以这里用户在使用的时候只需要给定 ```a, f(x), df(x)```, 就能够快速求解了，与之前的类一样都很方便。

另一个例子是求解 $n$ 次方根。

```cpp
double NthRootSolver(double a, int n, double x0 = 1.0)
{
    auto f = [a, n](double x)
    { return (pow(x, n) - a); };
    auto df = [n](double x)
    { return n * pow(x, n - 1); };

    return newton_solver(f, df, x0);
}
```

求解 $\cos{x} - x^3$

```cpp
double RectangleSolver(double x0=1.0)
{
    auto f = [](double x)
    { return (cos(x) - pow(x, 3)); };
    auto df = [](double x)
    { return (-sin(x) - 3 * pow(x, 2)); };

    return newton_solver(f, df, x0);
}
```

然后我们想对这个功能进行封装，跟前几节课讲的一样，函数声明放在 ```.h``` 头文件中, 函数实现放在 ```.cpp``` 文件中。

```newton_solver.h```

```cpp
#include <functional>

namespace ns{

	using fn = std::function<double(double)>;
	double newton_solver(fn f, fn df, double x0, double tolerance = 1e-12, int max_iterations = 30);

}

```

```newton_solver.cpp```

```cpp
#include <cmath>
#include <iostream>
#include "newton_solver.h"

namespace ns
{
    void printInfo(int k, double x, double fx)
    {
        std::cout << "k = " << k << ", x = " << x << ", f(x) = " << fx << std::endl;
    }

    bool is_close(double fx, double tolerance)
    {
        return (std::fabs(fx) < tolerance);
    }

    double newton_solver(fn f, fn df, double x0, double tolerance, int max_iterations)
    {
        int k = 0;
        double x = x0;
        printInfo(k, x, f(x));

        while (!is_close(f(x), tolerance) && (k < max_iterations))
        {
            k++;
            x = x - (f(x) / df(x));
            printInfo(k, x, f(x));
        }
        return x;
    }
}
```

```main.cpp```

```cpp
#include <cmath>
#include "newton_solver.h"

double sqrt_newton(double a, double x0 = 1.0)
{
    auto f = [a](double x)
    { return x * x - a; };
    auto df = [](double x)
    { return x * 2; };

    return ns::newton_solver(f, df, x0);
}

double NthRootSolver(double a, int n, double x0 = 1.0)
{
    auto f = [a, n](double x)
    { return (pow(x, n) - a); };
    auto df = [n](double x)
    { return n * pow(x, n - 1); };

    return ns::newton_solver(f, df, x0);
}

double RectangleSolver(double x0 = 1.0)
{
    auto f = [](double x)
    { return (cos(x) - pow(x, 3)); };
    auto df = [](double x)
    { return (-sin(x) - 3 * pow(x, 2)); };

    return ns::newton_solver(f, df, x0);
}

int main()
{
    sqrt_newton(64);

    NthRootSolver(64, 2);

    RectangleSolver();
}
```

## **截断**

如果

```cpp
Base b;
Derived d;
b = d;
```

会发生什么呢？

我们可以写代码检验一下

```cpp
#include <iostream>

using namespace std;

class Base
{
protected:
    int data;

public:
    Base() : data(10) {}
    virtual void bar()
    {
        cout << "Base::bar(): data = " << data << endl;
    }
};

class Derived : public Base
{
private:
    int datad;

public:
    Derived() : datad(100) { data = 7; }
    void bar() override
    {
        cout << "Derived::bar()" << ", data = " << data << ", datad = " << datad << endl;
    }
};

int main()
{
    Base b;
    b.bar();

    Derived d;
    Base *p = &d;
    p->bar();

    b = d;
    b.bar();
    p = &b;
    p->bar();
}
```

前两次的 ```bar()``` 函数的输出是正常的，但是当把 ```d``` 赋值给 ```b``` 的时候，我们发现两次 ```bar()``` 函数都是调用的 ```Base::bar()``` 函数，而不是 ```Derived::bar()``` 函数，而且 ```Base``` 中的 ```data``` 的值被改变成了 ```7```.

这意味着在进行赋值的时候，是把派生类的数据成员的值赋值给了基类的数据成员。而同时出于安全考虑，并不会修改基类的虚函数表指针，所以在调用 ```bar()``` 函数的时候，还是调用的基类的 ```bar()``` 函数。

如果想修改虚函数指针的话，可以这么做：

```cpp
void **pb = (void **)&b;
void **pd = (void **)&d;
*pb = *pd;
```

然后再次调用 ```b.bar()``` 我们发现静态绑定的 ```b.bar()``` 调用的是 ```Base::bar()``` 函数，而动态绑定的 ```p->bar()``` 调用的是 ```Derived::bar()``` 函数。

```
Base::bar(): data = 10
Derived::bar(), data = 7, datad = 100
Base::bar(): data = 7
Derived::bar(), data = 7, datad = 1
```

但是出现问题了：```datad``` 的值变成了 ```1```, 而不是原来的 ```100```。这是因为我们这时访问到的是 ```Base``` 对应偏移量的地址，而 ```Base``` 比 ```Derived``` 小，所以我们并不知道我们访问到的是什么数据，内存里边是什么，打印出来就是什么。

!!! NOTE "Relaxation Example"

    ```cpp
    class Expr {
    public:
        virtual Expr* newExpr();
        virtual Expr& clone();
        virtual Expr self();
    };

    class BinaryExpr : public Expr {
    public:
        virtual BinaryExpr* newExpr();  // OK
        virtual BinaryExpr& clone();    // OK
        virtual BinaryExpr self();      // Error!
    };
    ```

    子类中的 ```newExpr()``` 和 ```clone()``` 是可以正常工作的，他俩与基类构成了覆写关系，因为返回的都是同一个类型。

    而 ```self()``` 函数返回的是一个值，并不能构成覆写关系，所以会报错。