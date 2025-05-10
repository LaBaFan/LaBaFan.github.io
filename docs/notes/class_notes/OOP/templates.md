---
comments: true
---

# **Templates**

## **Default arguments**

在函数声明的时候，我们可以在某些参数后面加一个默认的值。

```cpp
int harpo(int n, int m = 4, int j = 5);

beeps = harpo(2);   // calls harpo(2, 4, 5)
beeps = harpo(2, 3); // calls harpo(2, 3, 5)
beeps = harpo(2, 3, 6); // calls harpo(2, 3, 6)
```

默认值有一些约束，比如下面的情况是不可以的。

```cpp
int chico (int n, int m = 4, int j); // error: default argument missing
```

因为 cpp 规定默认值必须是从右往左给的，上边的例子中，```j``` 没有默认值，但是 ```m``` 有默认值，所以会报错。

## **Templates**

主要包括两类：

- Function template
    - Example: ```sort``` function
- Class template
    - Example: containers -- ```stack```, ```list```, ```queue```, ...
    - template member functions

### **Function Templates**

之前我们见过 ```swap``` 函数，用来交换两个整数。

```cpp
void swap(int& x, int& y)
{
    int tmp = x;
    x = y;
    y = tmp;
}
```

如果想交换 ```float```, ```string```, ```double``` 等类型的变量呢？

我们可以使用函数模板来实现。

```cpp
template <typename T>
void swap(T& x, T& y)
{
    T tmp = x;
    x = y;
    y = tmp;
}
```

这里的 ```T``` 可以指代任何类型，包括 ```built-in``` 类型和用户自定义类型。

#### **Template Instantiation**

我们上边写的还只是一个模板，想要调用这么模板还需要经过一个**实例化**的过程。

```cpp
int x = 2, y = 3;
swap(x, y); // instantiate swap<int>(int&, int&)

float a = 2.0, b = 3.0;
swap(a, b); // instantiate swap<float>(float&, float&)

std::string s("Hello");
std::string t("World");
swap(s, t); // instantiate swap<std::string>(std::string&, std::string&)
```

#### **Template Arguments Deduction**

在实例化模板的时候，编译器会根据传入的参数来推导出 ```T``` 的类型。

```cpp
swap(int, int); // OK
swap(float, float); // OK
swap(int, double); // error, don't know what T is
```

如果我们在调用的时候加上一些类型信息，编译器就会知道 ```T``` 是什么类型，那么上边第三种情况就可以了。

```cpp
swap<int>(2, 2.5); // OK
```

模版函数可以和普通函数共存。

```cpp
template <typename T>
void print(T a, T b)
{
    std::cout << a << " " << b << std::endl;
}

void print(int a, int b)
{
    std::cout << "print(int, int)" << std::endl;
    std::cout << a << " " << b << std::endl;
}
```

这种做法是合法的，编译器会根据参数的类型来选择调用哪个函数。编译器会优先选择普通函数，如果没有找到合适的普通函数，就会去找模板函数。

!!! NOTE "Overloading Rules"

    1. First, exact regular-function match. 先找普通函数
    2. Then, check for exact function-template match. 其次找函数模板
    3. Last, implicit conversions for regular functions. 最后找隐式转换的普通函数

有时候我们会遇见模板不需要参数的情况，这时候就需要我们手动指定类型了。

```cpp
template <typename T>
void foo()
{
}

foo<int>(); // type T is int
foo<double>(); // type T is double
```

### **Class Templates**

!!! EXAMPLE "Vector"

    ```cpp
    template <class T>
    class Vector
    {
    public:
        Vector(int);
        ~Vector();
        Vector(const Vector&);
        Vector& operator=(const Vector&);
        T& operator[](int);
    private:
        T* m_elements;
        int m_size;
    }
    ```

    然后我们就可以用 built-in 类型或者者用户自定义类型来实例化这个类了。

    注意如果要把 ```member function``` 写在类的外边的话，需要写成下边的形式(写成函数模板的形式)。

    ```cpp
    template <class T>
    Vector<T>::Vector(int size)
    {
        m_size = size;
        m_elements = new T[m_size];
    }

    template <class T>
    T& Vector<T>::operator[](int index)
    {
        return m_elements[index];
    }
    ```

写好之后我们就可以配合算法来使用了。比如可以有一个 ```sort``` 函数

```cpp
template <class T>
void sort(Vector<T>& arr)
{
    const size_t last = arr.size() - 1;
    for( int i = 0; i < last; i++)
    {
        for( int j = last; j > i; j--)
        {
            if(arr[j] < arr[j - 1])
            {
                swap(arr[j], arr[j - 1]);
            }
        }
    }
}
```

模版可以有两个参数

```cpp
template <class Key, class Value>
class HashTable
{
    const Value& lookup ( const Key&) const;
    void insert ( const Key&, const Value&);
    ...
}
```

### **Expression parameters**

模版参数还可以是常数

```cpp
template <class T, int bounds = 100>
class FixedVector
{
public:
    FixedVector();
    ~FixedVector();
    T& operator[](int);
private:
    T elements[bounds];
}
```

### **Member Templates**

```cpp
#include <iostream>

using namespace std;

template <typename T>
struct complex
{
    T real;
    T imag;
    complex(T real, T imag) : real(real), imag(imag) {}
};

template <typename T>
ostream &operator<<(ostream &out, const complex<T> &c)
{
    return out << "(" << c.real << ", " << c.imag << ")";
}

int main()
{
    complex<double> a(3.14, -1.57);
    cout << a << endl;
}
```

我们定义了一个 ```complex``` 模版，表示一个复数。上述代码中我们对其进行了实例化，创建了一个 ```complex<double>``` 类型的变量 ```a```，并输出了它的值。

如果我们做了 ```complex<int> b = a;```, 编译器就会报错。我们就可以用 ```member template``` 来解决这个问题。

在 ```complex``` 类中加一个 ```member template``` 

```cpp
template<typename U>
complex(const complex<U>& other) : real(other.real), imag(other.imag) {}
```

这样我们执行 ```complex<int> b = a;``` 就不会报错了，只是类型转换的过程中会丢失精度。

## **Templates and Inheritance**

```cpp
template <class A>
class Derived : public Base{ ... }
```

定义了一个类模版，```Derived``` 可以从普通的类 ```Base``` 继承，来定义一个新的类模版。

还有一个情况，就是模版类继承模版类。

```cpp
template<class A>
class Derived : public Base<A>{ ... }
```

这里的 ```Base``` 也是一个模版类，```Derived``` 继承了 ```Base```。

## **CRTP**

CRTP 是 Curiously Recurring Template Pattern 的缩写，叫做**奇异重现模板模式**。

```cpp
template <class T>
class Base
{
    ...
}

class Derived : public Base<Derived>
{
    ...
}
```

## **Morality**

1. 对于模版来说，我们需要把所有的实现都放在头文件中，因为编译器需要在实例化的时候知道模版的实现。