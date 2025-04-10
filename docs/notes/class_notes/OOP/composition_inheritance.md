---
comments: true
---

# **Composition and Inheritance**

## **Composition**

组合，类里边可以有其他类的对象，组合是“has-a”关系，初始化的时候用它们自己的构造函数初始化，但是都要放在初始化列表中进行。

## **Inheritance**

在类的关系上扩展，继承是“is-a”关系，子类可以使用父类的成员函数和成员变量，父类的构造函数在子类的构造函数中调用。

被继承的东西叫做**Base Class(基类)**，继承的叫做**Derived Class(派生类)**，派生类可以重载基类的成员函数。

```cpp
#include <iostream>

using namespace std;

struct A {
    int x, y;
}

struct B {
    A a; // 组合, B 拥有一个 A
};

struct C : public A { // 继承，C 是 A
};

int main() {
    B b;
    b.a.x = 1;

    C c;
    c.x = 2; // A 里面有的东西 C 里边都有
}
```

在基类中是 ```privete``` 的话，派生类是不能访问的，但是可以通过基类的成员函数 ```setdata``` 访问。

但是如果我们想让这个函数只能在基类和派生类中使用的话，就需要 ```protected``` 关键字。

```cpp
#include <iostream>

using namespace std;

struct Base
{
private:
    int data;

public:
    Base(int d) : data(d) { cout << "Base::Base()" << endl; }
    ~Base() { cout << "Base::~Base()" << endl; }
    void print() { cout << "Base::print() " << data << endl; }

protected:
    void setdata(int d) { data = d; }
};

struct Derived : public Base
{

    Derived() : Base(0) { cout << "Derived::Derived()" << endl; }

    void foo()
    {
        setdata(10); // 只能在基类和派生类中使用
        print();     // 也可以访问基类的成员函数
    }
};

int main()
{
    Derived d;
    d.foo();       // 访问派生类的成员函数
    d.setdata(20); // 会出错，因为是在外界访问
    d.print();     // 访问基类的成员函数
    return 0;
}
```

| specifiers | Within same class | in derived class | outside the class |
| :--------: | :---------------: | :--------------: | :---------------: |
|  private   |        Yes        |        No        |        No         |
| protected  |        Yes        |       Yes        |        No         |
|   public   |        Yes        |       Yes        |        Yes        |

在执行构造函数的时候，一定是先执行基类的构造函数，然后才是派生类的构造函数。

!!! NOTE "Name Hiding"
    如果在派生类中定义了一个和基类同名的成员函数，那么在派生类中调用这个函数的时候，调用的是派生类的函数，而不是基类的函数，如果想要调用基类的函数，可以用作用域解析运算符来调用。

### **Access Protection**

- ```struct``` 默认所有的东西都是 ```public```
- ```class``` 默认所有的都是 ```private```

!!! NOTE "friend"

    ```friend``` 可以打破前边的访问限制，可以把访问的控制权授权给别人。
    
    授权的对象可以是：
    
    - a free function(普通的函数)
    - a member function of another class(对象的成员函数)
    - an entire class(甚至可以是整个对象)
    
    ```cpp
    struct X {
        private :
            int i;
        public:
            void initialize();
            friend void g(X*, int); // Global friend
            friend void h();
            friend void Y::f(X*);   // Structure member friend
            friend struct Z;    // Entire struct
    };
    
    void X::initialize() {
        i = 0;
    }
    
    void g(X* x, int i) {
        x->i = i;
    }
    
    void h() {
        X x;
        x.i = 100;
    }
    
    void Y::f(X* x) {
        x->i = 47;
    }
    
    void Z::g(X* x) {
        x->i += j;
    }
    ```

一个比较容易的点是，类的 ```private``` 是针对谁而言的。

考虑如下的代码：

```cpp
#include <iostream>

using namespace std;

struct base
{
public:
	base(int i) : data(i) { cout << "base::base()" << endl; }
	~base() { cout << "base::~base()" << endl; }
	void print() { cout << "base::print()" << data << endl; }
	void foo(base *other) { cout << "base::foo(), other->data= " << other->data << endl; }

private:
	int data;

protected:
	void setdata(int i) { data = i; }
};

int main()
{
	base b1(11), b2(12);
	b1.foo(&b2);
}
```

我们会发现输出是

```cpp
base::base()
base::base()
base::foo(), other->data= 12
base::~base()
base::~base()
```

我们的 ```b1``` 可以通过 ```foo()``` 函数访问到 ```b2``` 的 ```data``` 私有成员变量。

这就表示 ```private``` 是针对整个类而说的，而不是某个对象，所以类的成员函数可以自由的访问其他对象的 ```private``` 成员变量。

还有一件关于对象需要了解的事情：

```cpp
#include <iostream>

using namespace std;

struct Base
{
	public:
		int data;
		Base() : data(10) {}
};

struct derived : public Base {

};

int main()
{
	Base b;
	derived d;
	cout << b.data << "," << d.data << endl;
	cout <<sizeof(b) << "," << sizeof(d) << endl;

    int * p = (int *)&b;
    cout << p << ", " << *p << endl;

    p = (int *)&d;
    cout << p << ", " << *p << endl;
}
```

得到输出：

```shell
10,10
4,4
0x16fd62ebc, 10
0x16fd62eb8, 10
```

能看到两个对象的大小，数据都是一样的，地址相邻。

如果我们在后边加几行代码：

```cpp
*p = 200;
cout << d.data << endl;
cout << b.data << endl;
```

我们发现 ```d.data``` 变成了 200， ```b.data``` 还是 10。

如果我们在派生类 ```Derived``` 中增加一个字段

```cpp
struct derived : public Base
{
	private :
		int i;
	public:
        derived() : i(30) {}
        void printi() {
            cout << "Derived :: i = " << i << endl;
        }
};
```

然后输出，我们可以发现 ``` i = 30```, 同时 ```d``` 的大小变成 8 了，因为多了一个 ```int```。

如果我们做 ```p++```, ```p``` 会指到 ``` i ``` 的地址上，然后我们进行一些操作：

```cpp
p++;
cout << p << ", " << *p << endl;

*p = 50;
p.printi();
```

发现 ```i``` 的值被改成了 50。但是 ```i``` 是 ```private``` 的，我们却在类的外部修改了它，这个东西在 ```C/C++``` 中是<font color = red>管不住</font>的，只要有指针就可以对它修改。

同时我们在继承的时候是可以在基类前加关键字的：

```cpp
class derived1 : private Base {}
class derived2 : protected Base {}
class derived3 : public Base {}
```

这三个点效果是不同的：

|        inheritance type        |           public members in A            |          protected members in A          |           private members in A           |
| :----------------------------: | :--------------------------------------: | :--------------------------------------: | :--------------------------------------: |
|  ```class B : private A {}```  | <font color = purple>private in B</font> | <font color = purple>private in B</font> | <font color = red> not accessible</font> |
| ```class B : protected A {}``` | <font color = blue>protected in B</font> | <font color = blue>protected in B</font> | <font color = red>not accessible</font>  |
|  ```class B : public A {}```   |  <font color = green>public in B</font>  | <font color = blue>protected in B</font> | <font color = red>not accessible</font>  |

其中最常用的是 ```public``` 继承。```public``` 在语义上是 ```is-a``` 关系，如果 ```B``` is a ```A```，那么就可以用 ```public``` 继承。

### **Upcasting**

向上转型：假如有一个 ```student```，他是一个 ```human_begin```，那么我们就可以把他向上转型成 ```human_begin```。

```cpp
Manager pete("Pete", "444-55-6666", "Bakery");
Employee * ep = &pete; // Upcasting
Employee & er = pete; // Upcasting
```

我们有两种方法实现向上转型，一种是通过指针，拿到 ```pete``` 的地址，赋给一个 ```Employee``` 的指针，另一种是通过引用，直接赋给一个 ```Employee``` 的引用。

如果此时调用 ```ep``` 的成员函数，调用的是 ```Employee``` 的成员函数，而不是 ```Manager``` 的成员函数。

```cpp
#include <iostream>

using namespace std;

class Manager {
public:
	Manager () {
		cout << "Manager::Manager()" << endl;
	}
	~Manager () {
		cout << "Manager::~Manager()" << endl;
	}
	void print() {
		cout << "Manager::print()" << endl;
	}
};

class Employee {
public:
	Employee () {
		cout << "Employee::Employee()" << endl;
	}
	~Employee () {
		cout << "Employee::~Employee()" << endl;
	}
	void print() {
		cout << "Employee::print()" << endl;
	}
};

int main()
{
	Manager m;
	//Upcasting
	Employee *e = (Employee *)&m; // Upcasting
	e->print(); // Calls Employee::print()
}
```

我们会发现程序输出的是 ```Employee::print()```，而不是 ```Manager::print()```。

如果我们希望调用的是实际的对象的成员函数，而不是指针类型的成员函数，这就要说到```多态```了。