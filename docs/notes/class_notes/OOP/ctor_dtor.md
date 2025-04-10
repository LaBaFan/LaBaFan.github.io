---
comments: true
---

# **Constructor and Destructor**

## **When is a Ctor/Dtor called?**

- 全局变量的构造函数在 ```main``` 函数之前被调用，析构函数在 ```main``` 函数之后，整个程序结束时被调用。
- 静态局部变量的构造函数在**第一次**运行到这一行代码时被调用，析构函数在程序结束时被调用。静态局部变量的构造函数只会被调用一次。
- 局部变量的构造函数在**每一次**运行到这一行代码的时候被调用，析构函数在离开作用域时被调用。
- 对象的构造函数在对象被创建时被调用，析构函数在对象被销毁时被调用。

## **RAII**

**RAII(Resource Acquisition Is Initialization)** 是一种编程习惯，指的是在对象的构造函数中分配资源，在析构函数中释放资源。RAII 的好处是可以避免内存泄漏和资源泄漏。

把资源的生命周期和对象的生命周期绑定在一起，确保资源在对象的构造函数中被分配，在析构函数中被释放。这样可以避免内存泄漏和资源泄漏的问题。

## **Initializer List**

```cpp
struct Point {
    int x;
    int y;
    Point(int x, int y) : x(x), y(y) {} // initializer list
};
```

## **Constant objects**

我们可以给对象的 ```member function``` 加上 ```const``` 关键字，与普通的 ```member function``` 加以区分，这样如果我们的对象是 ```const``` 的话，程序会自动调用 ```const``` 版本的 ```member function```，从而可以保护对象的成员变量不被修改。

```cpp
#include <iostream>

using namespace std;

struct X {
    int x;
    int y;

    X(int x, int y) : x(x), y(y) {}

    void foo() {
        cout << "foo" << endl;
    }

    void foo() const {
        cout << "foo const" << endl;
    }

    int main() {
        X x(1, 2);
        x.foo(); // foo
        const X y(3, 4);
        y.foo(); // foo const
    }
}
```

如果对象中有一个字段是 ```const``` 的话，那么这个字段的初始化必须在 ```initializer list``` 中进行。

```cpp
struct X {
    const int i;
    X(int i) : i(i) {} // initializer list
    X () {
        i = 0; // error: assignment of read-only member 'X::i'
    }
}
```

## **Static members**

```cpp
struct X {
    static void f();
    static int i;
}

int X::i = 0;   // 非常重要，如果没有这一句，会过不了编译

void X::f() {
    i = 1;
}
```

静态成员变量的初始化必须在类外进行，不能在类内进行。

```cpp
#include <iostream>

using namespace std;

struct X {
    static int i;
    
    X() {}

    void setdata(int i1) {
        i = i1;
    }

    void print() {
        cout << i << endl;
    }
};

int X::i = 0;

int main()
{
    X a,b;
    a.setdata(1);
    a.print();
    b.print();
}
```

运行上边的代码，我们期望的输出结果是 ```1, 0```，但是实际上输出是 ```1, 1```,这是由于 ```i``` 是 ```static```的，它放在了全局数据区，所以可以把它当成是一个全局变量。也就是说，```static``` 变量是所有对象共享的，所以它的值是共享的。

同时注意 ```static function``` 不跟某个对象绑定在一起，这意味着我们不能在 ```static function``` 中使用 ```this``` 指针。我们可以把 ```static function``` 当成是一个全局函数，只不过它的作用域被限制在了类里面而已。

```cpp
struct X {
    int m1;

    void f1() {
        m1 = 1;
    }

    static void f2() {
        m1 = 1; // error: 'm1' was not declared in this scope
    }
}
```

所以我们可以有两种调用的方式

```cpp
X::f2(); // 直接调用
```

```cpp
X x;
x.f2(); // 通过对象调用
```

## **Compile-time constants in class**

```cpp
class X {
    const int size;
    int array[size]; // error: 'size' was not declared in this scope
}
```

上边的代码是错误的，因为 ```size``` 不是在编译时刻确定的，我们可以用 ```static``` 来修正这个问题。

```cpp
static const int size = 100;
```

## **Multiple definition**

```cpp
// --- <cup.h> ---
class Cup {
    rgb color;
public:
    rgb getColor() { return color; }
    void setColor(rgb c) { color = c; }
};
```

我们之前讲过，如果在头文件中定义了一个类，那么在每一个引用这个头文件的源文件中都会生成一个类的定义，这样就会导致重复定义的问题。但是上边的代码是没有问题的，要想知道为什么，我们可以先了解一些事情。

我们的函数调用是要往栈里边写东西的：

- Push arguments
- Push return address
- Push frame pointer
- Prepare return values
- Pop all the pushed items

函数的调用是有代价的，我们想要通过某种办法，让这个代价消失，这就引入了 ```inline``` 关键字，它可以直接在调用的时候把函数的代码放到调用的地方，这样就可以避免函数调用的开销了。

```cpp
inline int add(int a, int b) {
    return a + b;
}

int main() {
    int a = 1;
    int b = 2;
    int c = add(a, b); // inline
    // 相当于
    int c = a + b; // inline
}
```

```inline``` 类似于我们之前学过的宏，但是宏是预处理，相当于直接文本替换。

```cpp
#define unsafe(i) ((i) >= 0 ? (i) : (-1))

int f();

int main()
{
    ans = unsafe(x++);  // 如果直接用宏替换，那么 x++ 可能会被做很多次
    ans = unsafe(f());  // 同样f() 会被多次调用
}
```

而 ```inline``` 则不存在上边的问题，它是编译器帮我们优化的。

```cpp
inline int unsafe(int i) {
    return (i) >= 0 ? (i) : (-1);
}

int f();

int main()
{
    ans = unsafe(x++);  // x++ 只会被做一次
    ans = unsafe(f());  // f() 只会被做一次
}
```

!!! Warning

    ```inline``` 只是一个请求，并不是强制的，由编译器自己决定。

    比如如果一个递归函数太深了，编译器就会选择不 ```inline``` 了。

由于我们调用 ```inline``` 的时候需要看到函数体，不然无法进行替换，所以如果函数定义在头文件中，```inline``` 会有一个机制，```multiple definitions are permitted```，也就是说可以重定义，```inline``` 会自动找一份合适的定义保留。

回到上面的问题，为什么那段代码没有问题呢？因为定义在 ```class``` 里边的 ```member function``` 默认就是 ```inline``` 的，所以我们可以在头文件中定义它们，而不会导致重复定义的问题。
