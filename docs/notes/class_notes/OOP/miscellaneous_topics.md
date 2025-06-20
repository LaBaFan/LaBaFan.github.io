# **Miscellaneous Topics**

## **Name Casts**

如果你需要使用类型转换，使用 named cast.

- `static_cast`: 一般用于类型转换，如从 `double` 到 `int`。
- `dynamic_cast`
- `const_cast`
- `reinterpret_cast`

!!! EXAMPLE

    === "Exp 1"
        ```cpp
        double d;
        int a;

        a = d; // implicit
        a = (int) d; // explicit
        a = static_cast<int>(d); // named cast, exact meaning
        ```

    === "Exp 2"    
        ```cpp
        const int c = 2;
        int *q;

        q = &c; // error, cannot convert const to non-const
        q = (int *) &c; // explicit cast, but not safe(*q = 2 is not safe)
        q = static_cast<int *>(&c); // error
        q = const_cast<int *>(&c); // Yes
        ```
    
    === "Exp 3"
        ```cpp
        struct A {
            int a;
        };
        struct B : public A {};
        struct C : public A {};

        int main()
        {
            A *pa = new B;

            // 父类指针 downcast 到子类指针时，需要类型转换
            C *pc = static_cast<C *>(pa); // OK, but *pa is B

            // dynamic_cast 会先看类型是否匹配，如果不匹配则返回 nullptr，一定要有虚函数存在，才能使用 dynamic_cast
            C *pc = dynamic_cast<C *>(pa); // return nullptr
        }
        ```

## **Multiple Inheritance**

父类可以是一个列表，不一定是单一的父类。

```cpp
class Consultant :
    public Employee, // Employee 是 Consultant 的父类
    public Advisor // Advisor 也是 Consultant 的父类
{
    // ...
};
```

我们标准库中的 `iostream` 就是同时继承了 `istream` 和 `ostream`。

## **Avoiding name clashes**

考虑下面这种情况

```cpp
//old1.h
void f();
void g();

//old2.h
void f();
void g();
```

引入了两个不一样的头文件，它们都实现了 `f()` 和 `g()` 函数。编译器会报错，因为它不知道使用哪个版本的 `f()` 和 `g()`。

这时候我们就可以使用命名空间来避免这种冲突。

```cpp
//old1.h
namespace old1 {
    void f();
    void g();
}

//old2.h
namespace old2 {
    void f();
    void g();
}
```