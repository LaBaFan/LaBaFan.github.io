---
comments: true
---

# **Operator Overloading**

## **Restrictions**

- Only existing operators can be overloaded.
    - You can not create ```**``` for exponentiation.
- Overload operators must
    - Preserve number of operands(操作数的数量不能改变)
    - Perserve precedence(操作符的优先级不能改变)

## **Prototypes**

运算符重载的原型是一个函数声明，函数的参数表是确定的

- ```+, -, *, /, %, +=, -=, *=, /=, %=```, 算数运算符

```cpp
T operator X(const T& l, const T& r);
```

- ```!, &&, ||, <, <=, >, >=, ==, !=```, 关系运算符

```cpp
bool operator X(const T& l, const T& r);
```

- ```[]```, 下标访问

```cpp
E& T::operator[](int index);
```

### **Operators ```++``` and ```--```**

我们平常用的 ```++``` 有两种形式，一种是 ```i++```, 另一种是 ```++i```，它们的参数表完全一样，所以在进行重载的时候要加以区分。

```cpp
class Integer
{
public:
    ...
    Integer& operator++(); // prefix, ++i
    Integer operator++(int); // postfix, i++
    Integer& operator--(); // prefix, --i
    Integer operator--(int); // postfix, i--
    ...
}

Integer& Integer::operator++()
{
    // prefix
    this.i += 1;
    return *this;
}

Integer Integer::operator++(int)
{
    // postfix
    Integer temp = *this;
    ++(*this);
    return temp;
}
```

### **Relational Operators**

关系运算符很多都是成对出现的，比如 ```==``` 和 ```!=```，```<``` 和 ```>=```，```<=``` 和 ```>```。我们可以只重载其中一个，另一个可以通过重载的那个来实现。

```cpp
bool operator==(const Integer& l, const Integer& r)
{
    return l.i == r.i;
}

bool operator!=(const Integer& l, const Integer& r)
{
    return !(l == r);
}

bool operator<(const Integer& rhs)
{
    return i < rhs.i;
}

bool operator>(const Integer& rhs)
{
    return rhs < *this;
}

bool operator<=(const Integer& rhs)
{
    return !(rhs < *this);
}

bool operator>=(const Integer& rhs)
{
    return !(*this < rhs);
}
```

### **Operator ```[]```**

- Must be a member function
- Single argument
- Implies that the object acts like an array
    - should return a reference

### **Operator ```()```**

带有 ```()``` 重载的对象被叫做 ```functor```, 是一个函数对象。

```cpp
struct F
{
    void operator()(int i)
    {
        cout << "i = " << i << endl;
    }
}

F f;    // f is a functor
f(2);   // calls f.operator()
```

## **Conversion**

当用户自定义的类型和内置类型进行运算时，编译器会自动调用转换函数来进行转换。

- Single-argument constructors
- type conversion operators

### **Single-argument constructors**

```cpp
class PathName
{
    string name;
public:
    PathName(const string&);
    ~ PathName();
};

...

string abc("abc");
PathName xzy(abc); // OK
xzy = abc; // OK abc => PathName
```

我们可以在单参数的构造函数前加上 ```explicit``` 来禁止隐式转换。

### **Conversion operator**

```cpp
class Rational
{
public:
    operator double() const 
    {
        return numerator / (double)denominator;
    }
}

Rational r(1, 3);
double d = 1.3 * r; // r => double
```

这里的 ```operator double()``` 是一个转换函数，返回值是 ```double``` 类型，用来将 ```Rational``` 转换为 ```double``` 类型。

建议谨慎使用隐式转换，可以写一个转换函数来进行转换(```to_double()```)，这样可以避免隐式转换带来的错误。