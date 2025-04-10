---
comments: true
---

# **Polymorphism**

## **Virtual**

```cpp
#include <iostream>
#include <vector>
using namespace std;

class Shape {
	public:
	~Shape() {}
	void move () {
		cout << "Shape::move()" << endl;
	}
	void render() {
		cout << "Shape::render()" << endl;
	}
};

class Ellipse : public Shape {
	public:
	~Ellipse() {
		cout << "Ellipse::~Ellipse()" << endl;
	}
	void render() {
		cout << "Ellipse::render()" << endl;
	}
};

class Circle : public Ellipse {
	public:
	~Circle() {
		cout << "Circle::~Circle()" << endl;
	}
	void render() {
		cout << "Circle::render()" << endl;
	}
};

void foo(Shape *s) {
	s->move();
	s->render();
}

int main()
{
	vector<Shape*> shapes;
	shapes.push_back(new Ellipse());
	shapes.push_back(new Circle());

	foo(shapes[0]);
	foo(shapes[1]);
	
	delete shapes[0];
	delete shapes[1];
}
```

得到输出

```
Shape::move()
Shape::render()
Shape::move()
Shape::render()
Shape::~Shape()
Shape::~Shape()
```

我们会发现两个 ```foo``` 函数都调用的是 ```Shape``` 类的
```move``` 和 ```render``` 方法，这是很自然的，因为不管是 ```Ellipse``` 还是 ```Circle```，都是从 
```Shape``` 继承而来的，本质上都是一个 ```Shape``` 对象。

如果我们想实现派生类调用自己的
```render``` 方法，而不是基类的 ```render``` 方法，我们可以在基类的 ```render``` 前加上 ```virtual``` 关键字。

然后派生类的同名方法就会覆盖基类的同名方法，这就是多态的实现。

但是我们发现一个问题，我们在 ```delete``` 的时候，```Ellipse, Circle``` 的析构函数并没有被调用，而是调用的基类 ```Shape``` 的析构函数。

但是如果我们在 ```Shape``` 的析构函数前加上 ```virtual``` 关键字，就可以解决这个问题。同时 ```Circle``` 继承自 ```Ellipse```，所以在 ```delete Circle``` 的时候，会先调用
```Circle``` 的析构函数，然后调用 ```Ellipse``` 的析构函数，最后调用 ```Shape``` 的析构函数。

### **虚函数的机制**

```cpp
#include <iostream>

using namespace std;

class Base {
public:
	Base() : data(10) { cout << "Base::Base()" << endl; }
	void foo() { cout << "Base::foo(), data = " << data << endl; }

private:
	int data;
};

int main()
{
	Base b;
	b.foo();

	cout << "size of b is " << sizeof(b) << endl;
}
```

得到输出

```
Base::Base()
Base::foo(), data = 10
size of b is 4
```

然后我们在基类上加一个虚函数```bar()```

```cpp
virtual void bar() { cout << "Base::bar()" << endl; }
```

调用```b.bar()```，得到输出

```
Base::Base()
Base::foo(), data = 10
Base::bar()
size of b is 16
```

发现```b``` 的大小变成 16 个字节了，我们想用指针来探测一下类的内部有什么。

```cpp
int *p = (int *)&b;
cout << *p << endl;

p++;
cout << *p << endl;

p++;
cout << *p << endl;
```

得到输出

```
Base::Base()
Base::foo(), data = 10
Base::bar()
size of b is 16
11387080
1
10
```

说明 ```data``` 上边有 8 个字节存的有别的东西，这里实际上存了一个指针，指向了外边的一个东西。

它指向的实际上是代码段的一个表格，每个基类和派生类同名的方法都在这个表格里有一个条目，使用的时候根据指针指向的地址来找到该调用哪个函数。

所以多态的实现实际上是当 ```p``` 调用 ```bar()``` 函数的时候，```p``` 会先找到它指向的 ```vptr```，然后 ```vptr``` 又会指向另外一个地址，根据这个地址来找到应该调用哪个函数。

### **Override**

```Override``` 关键词可以让语义更清晰，在派生类的方法后加上 ```override``` 关键字，用来强调这里存在多态。

