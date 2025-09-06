---
comments: true
---

# **Exceptions**

## **Exception**

我们会把异常放在 ```try-catch``` 语句中。在 ```try``` 块中，我们会放置可能会抛出异常的代码，而在 ```catch``` 块中，我们会处理这些异常。

```cpp
try{
    open the file;
    determine its size;
    allocate that much memory;
    read the file into memory;
    close the file;
} catch ( fileOpenFailed ) {
    do something;
} catch ( sizeDeterminationFailed ) {
    do something;
} catch ( memoryAllocationFailed ) {
    do something;
} catch ( fileReadFailed ) {
    do something;
} catch ( fileCloseFailed ) {
    do something;
}
```

### **Example: Vector**

```cpp
template <class T>
class Vector {
private:
    T* m_elements;
    int size;
public:
    Vector(int size = 0) : m_size(size) { /* ... */ }
    ~Vector() { delete[] m_elements; }
    /* ... */
    int length() { return m_size; }
    T& operator[](int idx);     // How to implement?
}
```

我们有一个 ```Vector``` 类，它有一个成员函数 ```operator[]```，我们想要实现一个类似于数组的下标操作符。

如果下标 ```idx``` 越界了，我们有很多方法对它进行处理。

1. 直接返回 ```m_elememts[idx]```。这肯定是不对的，就算当时没有出问题，后续也可能会导致问题出现。
2. 我们可以设置一个特殊的值，当越界的时候，返回这个特殊的值。比如说 ```-1```。但是这也不对，因为我们并不知道这个值是否是合法的值。
3. ```exit()```。直接让程序退出。
4. Die, bug gracefully。我们可以利用 ```assert```, 在发生异常的时候，打印一些信息。

```cpp
assert(idx >= 0 && idx < m_size);
return m_elements[idx];
```

上述的方法都是用于写程序的时候 debug, 然而在生产环境中，程序抛出异常可能是外部环境导致的，而不是程序本身出了问题。此时上边的方法就没有用了，这时候我们就要用到 ```try-catch``` 语句。

```cpp
template <class T>
T& operator[](int idx) {
    if (idx < 0 || idx >= m_size) {
        throw <<something>>; // throw an exception
    }
    return m_elements[idx];
}
```

这里的 something 可以是自己定义的，也可以是 STL 中的异常。比如，我们可以自定义一个 ```VectorIndexError``` 类。

```cpp
class VectorIndexError {
public:
    VectorIndexError(int idx) : m_badValue(idx) {}
    ~VectorIndexError() {}
    void diagnostic() {
        cerr << "index " << m_badValue << " out of range!";
    }
private:
    int m_badValue;
}
```

然后我们就可以 ```throw VectorIndexError(idx)```, 在 caller 中就可以捕捉到异常。

```cpp
int func() {
    Vector<int> v(10);
    v[3] = 5;
    int i = v[20];  // out of range
    // control never reach here
    return i * 5;
}
```

如果不想处理这个异常的话，就什么都不做；否则的话需要用 ```try-catch``` 语句把它包起来。

!!! NOTE

    === "处理异常"

        ```cpp
        void outer() {
            try {
                func();
                func2();
            } catch (VectorIndexError& e) {
                e.diagnostic();
            }
            cout << "Control is here after exception" << endl;
        }
        ```

    === "不处理异常"

        如果不处理，只是看一下信息的话，可以这么做

        ```cpp
        void outer2() {
            string err_msg("exception caught");
            try {
                func();
            } catch (VectorIndexError&) {
                cout << err_msg << endl;
                throw;
            }
        }
        ```

        我们接收到异常之后，打印了一下异常信息，然后继续抛出异常。这样的话，异常就会继续向上抛，直到被处理。

### **Review**

```try-catch``` 有一个很好的机制是：当异常层层向上抛出的时候，同时会一层层的退栈，这个过程中会调用析构函数，保证创建的对象都被销毁了。这一点是与 ```return``` 相同的，是一个很重要的特性。

```catch()``` 括号里边可以填两种东西：

1. 具体的异常类型，比如 ```VectorIndexError```。
2. ```...```, 表示所有的异常类型。

## **Selecting a Handler**

当有多个 ```catch``` 的时候，程序会按顺序检查每个 ```catch``` 语句，直到找到一个匹配的异常类型为止。

异常类还可以继承其他的异常类，这样的话，子类的异常也可以被父类捕捉到。但要注意异常出现的顺序，子类的异常要放在父类的前面，否则会一直匹配到父类的异常，导致子类的异常捕捉不到。

```cpp
class MathErr {
public:
    MathErr() {}
    ~MathErr() {}
    virtual void diagnostic() {
        cerr << "Math error!" << endl;
    }
};

class OverflowErr : public MathErr { ... };
class UnderflowErr : public MathErr { ... };
class ZeroDivideErr : public MathErr { ... };

try {
    // math options
    throw UnderFlowErr();
} catch (ZeroDivideErr& e) {
    // handle zero divide case
} catch (UnderflowErr& e) {
    // handle underflow case
} catch (MathErr& e) {
    // handle all math errors
} catch ( ... ) {
    // any other exception
}
```

## **Exceptions and new**

```new``` 关键字会抛出一个异常 ```bad_alloc```，表示内存分配失败。

### **```noexcept``` specifier**

```noexcept``` 是一个 C++11 的关键字，标识在函数上边，表示我承诺这个函数不会抛出异常。这个函数如果抛出了异常，程序会调用 ```std::terminate()``` 函数，直接终止程序。

通常在构造函数，析构函数，移动构造函数，移动赋值运算符中使用 ```noexcept```。

### **Design Considerations**

异常应该用在发生错误的情况下，而不是用来控制程序的流程。异常应该是一个意外的情况，而不是一个正常的情况。

一个不好的例子：

```cpp
try {
    for(;;) {
        p = list.next()
        ...
    }
} catch (List::end_of_list) {
    // handle end of list
}
```

链表走到头了，应该退出循环，而不是抛出异常。异常是有开销的，不能随便使用。

## **More Exceptions**

- Exceptions and constructors
- Exceptions and destructors
- Design and usage with exceptions
- Handlers

### **Failure in constructors**

构造函数是没有返回值的，所以我们不能用返回值来表示构造函数是否成功。那么如果构造的过程中发生了错误，我们就需要抛出异常。

但是在这个过程中有可能会发生内存泄露，下面是一段模拟异常发生的代码：

```cpp
#include <iostream>

class A
{
private:
    int *vdata;

public:
    A() : vdata(new int[10]())
    {
        std::cout << "A::A()" << std::endl;
        if (true) // 模拟异常发生
        {
            throw -1;
        }
    }

    ~A()
    {
        std::cout << "A::~A()" << std::endl;
        delete[] vdata;
        std::cout << "deleting vdata ..." << std::endl;
    }
};

int main()
{
    try
    {
        A a;
    }
    catch (...)
    {
        std::cout << "catching exception" << std::endl;
    }
}
```

我们在构造函数中模拟了一个异常的发生，然后在 ```main``` 函数中捕捉这个异常。最终得到的输出如下：

```bash
A::A()
catching exception
```

发现并没有调用析构函数，但是 ```vdata``` 却被分配了内存，这就导致了内存泄露。

发生这个错误的原因是，在构造函数中抛出了异常，所以程序默认构造没有成功，自然就不会调用析构函数了。

一个解决办法是，把构造函数放在 ```init``` 函数中，在 ```init``` 函数中解决这个异常。但是这种办法不好，因为它违背了我们使用构造函数的初衷。

下边的代码中，析构函数会被调用：

```cpp
#include <iostream>

class T
{
public:
    T() { std::cout << "T::T()" << std::endl; }
    ~T() { std::cout << "T::~T()" << std::endl; }
};

void foo() 
{
    T t;
    if(true) // 模拟异常发生
    {
        throw -1;
    }
}

int main()
{
    try
    {
        foo();
    }
    catch (...)
    {
        std::cout << "catching exception" << std::endl;
    }
}
```

在这段代码中我们发现 ```T``` 的析构函数会被调用，这很容易理解，我们下边就要利用这一点来解决上边的问题。

我们可以把 ```T``` 作为一个成员变量，这样的话，当构造函数抛出异常的时候， ```T``` 的析构函数会被调用。然后把 ```T``` 修改为一个 ```Wrapper``` 类，在这个类中对 ```vdata``` 进行管理。这样的话，当 ```Wrapper``` 的析构函数被调用的时候， ```vdata``` 也会被释放掉。

```cpp
#include <iostream>

class Wrapper
{
private:
    int *vdata;

public:
    Wrapper(int *data) : vdata(data)
    {
        std::cout << "Wrapper::Wrapper()" << std::endl;
    }
    ~Wrapper()
    {
        delete[] vdata;
        std::cout << "Wrapper::~Wrapper(), vdata released!" << std::endl;
    };
};

class A
{
private:
    Wrapper w;

public:
    A() : w(new int[10]())
    {
        std::cout << "A::A()" << std::endl;
        if (true) // 模拟异常发生
        {
            throw -1;
        }
    }

    ~A()
    {
        std::cout << "A::~A()" << std::endl;
        std::cout << "deleting vdata ..." << std::endl;
    }
};

int main()
{
    try
    {
        A a;
    }
    catch (...)
    {
        std::cout << "catching exception" << std::endl;
    }
}
```

```bash
Wrapper::Wrapper()
A::A()
Wrapper::~Wrapper(), vdata released!
catching exception
```

我们直接把 ```A``` 中申请的内存放在了 ```Wrapper``` 中，这样的话，当 ```A``` 的构造函数抛出异常的时候， ```Wrapper``` 的析构函数会被调用，从而释放掉内存。

由于这个东西很常用，所以标准库中也有类似的东西，在 ```<memory>``` 头文件中有一个 ```std::unique_ptr```，它是一个智能指针，可以自动管理内存的释放。

如此我们就可以不用 ```Wrapper``` 了，直接使用 ```std::unique_ptr``` 来管理内存。

```cpp
#include <iostream>
#include <memory>

class A
{
private:
    std::unique_ptr<int[]> up;

public:
    A() : up(new int[10]())
    {
        std::cout << "A::A()" << std::endl;
        if (true) // 模拟异常发生
        {
            throw -1;
        }
    }

    ~A()
    {
        std::cout << "A::~A()" << std::endl;
        std::cout << "deleting vdata ..." << std::endl;
    }
};

int main()
{
    try
    {
        A a;
    }
    catch (...)
    {
        std::cout << "catching exception" << std::endl;
    }
}
```

### **Failure in destructors**

如果在 ```destructor``` 中抛出了异常，程序会调用 ```std::terminate()``` 函数，直接终止程序。
