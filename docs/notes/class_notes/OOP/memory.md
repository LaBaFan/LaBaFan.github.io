---
comments: true
---

# **Memory Model**

```cpp
#include <iostream>
#include <cstdlib>

using namespace std;

int globalx = 10;

int main()
{
    static int staticx = 3;
    int locax = 5;
    int *px = (int *)malloc(sizeof(int));

    cout << "&globalx = " << &globalx << endl;
    cout << "&staticx = " << &staticx << endl;
    cout << "&locax = " << &locax << endl;
    cout << "&px = " << &px << endl;
    cout << "px = " << px << endl;
}
```

得到如下的输出：

```
&globalx = 0x104440000
&staticx = 0x104440004
&locax = 0x16b9c701c
&px = 0x16b9c7010
px = 0x600002f9c030
```

我们发现全局变量和静态局部变量的地址是在一起的，而且地址比较低，叫做全局数据区；而局部变量是放在一起的，且地址比较高，放在栈(stack)上；而动态分配的内存是放在堆(heap)上的。

## **Variables**

### **Globalvars**

全局变量是放在全局数据区的，全局数据区是在程序运行时就分配好的，程序结束时才释放。全局变量的生命周期是从程序开始到程序结束。

全局变量的特性就是可以在多个编译单元共享，但需要用 ```extern``` 来声明，但是如果在不同的 C++ 文件中定义了同名的全局变量，那么会出现链接错误。

!!! Example

    === "main.cpp"
        ```cpp
        #include <iostream>

        using namespace std;

        extern int globalx;

        int main()
        {
            cout << "globalx = " << globalx << endl;
        }
        ```

    === "other.cpp"
        ```cpp
        int globalx = 10;
        ```
    
    然后我们使用如下的命令来编译：

    ```bash
    g++ main.cpp other.cpp -o main
    ```

    就可以生成一个可执行文件 ```main```，然后运行它，得到正确的输出。

同样的，函数也可以这样使用。

```cpp
#include <iostream>

using namespace std;

double pi();

int main()
{
    cout << "pi = " << pi() << endl;
}
```

然后在另一个文件中定义 ```pi``` 函数：

```cpp
double pi()
{
    return 3.1415926;
}
```

然后编译：

```bash
g++ main.cpp other.cpp -o main
```

就可以正确运行了。

### **Static**

```static``` 的作用就是告诉编译器，这个变量的作用域只在本编译单元内，不会被其他编译单元访问。

如果用 ```static``` 修饰全局变量，那么这个全局变量只能在本文件中访问，其他文件不能访问，如果作用在上边的例子中（```static int globalx;```, ```static double pi();```），那么就会出现链接错误。

#### **Static Localvars**

```cpp
#include <iostream>

using namespace std;

void access_count()
{
    static int count = 0;
    cout << "access count = " << ++count << endl;
}

int main()
{
    for (int i = 0 ; i < 10 ; ++i)
    {
        access_count();
    }
}
```

输出：

```
access count = 1
access count = 2
access count = 3
access count = 4
access count = 5
access count = 6
access count = 7
access count = 8
access count = 9
access count = 10
```

我们发现原本如果没有 ```static``` 修饰的话，每次调用 ```access_count``` 函数的时候，```count``` 都会被初始化为 0，而加上 ```static``` 修饰之后，```count``` 只会被初始化一次，然后每次调用 ```access_count``` 函数的时候，```count``` 都会加 1。

这是因为没有 ```static``` 修饰的局部变量是放在栈上的，而 ```static``` 修饰的局部变量是放在全局数据区的。

所以 ```static``` 有两个重要属性：

- 限制变量的作用域
- 存储持久性

### **Pointers to Objects**

指针存储的是另一个变量的地址，想要使用它有两种办法：

- 解引用：```*px```，得到的是指针指向的变量的值
- 箭头运算符：```px->```，得到的是指针指向的变量的成员

#### **Assignment**

```cpp
string *ps1, *ps2;
ps1 = ps2;
```

指针的赋值，相当于直接把地址赋给了另一个指针，两个指针指向的是同一个变量。

### **References**

引用是 C++ 的一个特性，它是一个变量的别名，引用的声明方式如下：

```cpp
char c; // c 是一个字符变量
char *p = &c; // p 是一个指向 c 的指针
char &r = c; // r 是 c 的引用
```

这里的 ```r``` 和 ```c``` 是同一个东西，```r``` 是 ```c``` 的别名，所以对 ```r``` 的操作就是对 ```c``` 的操作。

```cpp
int& y = x;

y = z;      // 把 z 的值赋给 y，也就是 x
```

如果想在函数参数表中传递引用，可以这样：

```cpp
void swap(int &a, int &b)
{
    int temp = a;
    a = b;
    b = temp;
}

int main()
{
    int x = 10, y = 20;
    swap(x, y);
}
```

正常来讲我们应该传递的是 ```x``` 和 ```y``` 的地址，但是这里我们传递的是 ```x``` 和 ```y``` 的引用，同样能达到交换两个变量的值的目的。

同时还要注意，函数引用传参的时候必须传递的是一个变量（左值），不能传递一个表达式（右值），因为表达式是没有地址的。

??? note "左值和右值"
    - 左值：可以取地址的表达式，也就是可以放在赋值号左边的表达式
    - 右值：不能取地址的表达式，也就是不能放在赋值号左边的表达式

#### **Type restrictions**

- No reference to a reference
- No pointers to references but references to pointers is OK

```cpp
int&* p; // illegal
void f(int*& p); // legal
```

- No arrays of references

## **Dynamic Memory Allocation**

C++ 中动态内存分配主要是两个句子：```new``` 和 ```delete```。

```new``` expression

```cpp
new int;
new stash;
new int[10];
```

```delete``` expression

```cpp
delete p;
delete[] p;
```

```new```,```delete``` 和 ```malloc```,```free``` 都是用来申请一块内存，然后释放这块内存的，但是 ```new``` 和 ```delete``` 可以保证 ```class``` 的构造函数和析构函数正确调用。

```cpp
#include <iostream>

using namespace std;

struct Student
{
    int id;
    Student() {     // 构造函数
        id = 10;
        cout << "Student::Student()" << endl;
    }

    ~Student() {    // 析构函数
        cout << "Student::~Student()" << endl;
    }
};

int main()
{
    Student *p1 = (Student *)malloc(sizeof(Student));
    cout << "p1->id = " << p1->id << endl;

    Student *p2 = new Student;
    cout << "p2->id = " << p2->id << endl;

    free(p1);
    delete p2;
}
```

得到输出：

``` 
p1->id = 0
Student::Student()
p2->id = 10
Student::~Student()
```

我们发现输出的```p1```附近是没有东西的，而```p2```的前边有构造函数的输出，后边有析构函数的输出，说明```new```和```delete```会自动调用构造函数和析构函数，而```malloc```和```free```不行。

```new``` 是申请一块内存空间，然后先调用构造函数，而 ```delete``` 会先调用析构函数，然后释放内存空间。

为了更直观地观察到这个过程，我们可以在构造函数和析构函数中加入一些输出：

```cpp
#include <iostream>

using namespace std;

struct Student
{
    int id;
    Student() {     // 构造函数
        id = 10;
        cout << "Student::Student(): id = " << id << endl;
    }

    ~Student() {    // 析构函数
        cout << "Student::~Student(): id = " << id << endl;
    }
};

int main()
{
    Student *p1 = (Student *)malloc(sizeof(Student));
    cout << "p1->id = " << p1->id << endl;

    Student *p2 = new Student;
    cout << "p2->id = " << p2->id << endl;

    free(p1);
    delete p2;

    Student *parr = new Student[5];
    for(int i = 0; i< 5; i++)
    {
        parr[i].id = i;
    }

    delete[] parr;
}
```

输出：

```
p1->id = 78937841
Student::Student(): id = 10
p2->id = 10
Student::~Student(): id = 10
Student::Student(): id = 10
Student::Student(): id = 10
Student::Student(): id = 10
Student::Student(): id = 10
Student::Student(): id = 10
Student::~Student(): id = 4
Student::~Student(): id = 3
Student::~Student(): id = 2
Student::~Student(): id = 1
Student::~Student(): id = 0
```

发现```p1```的输出是没有初始化的（编译器优化等级 -O2），而```p2```的输出是有初始化的，说明```new```会调用构造函数，而```delete```会调用析构函数。

然后观察数组输出，发现都是先调用构造函数，再进行赋值，所以构造函数的输出永远是 10，然后 ```delete``` 的时候调用析构函数，这时候数组都被赋值过了，所以输出的是赋值的值。同时注意我们赋值的时候顺序是```0,1,2,3,4```，但是析构函数的输出是```4,3,2,1,0```，说明构造的顺序和析构的顺序是相反的。

注意：```delete``` 不能重复释放内存，否则会出现错误。

```cpp
int *p = new int;
delete p;
delete p;
```

运行的时候就会报错。但是```delete nullptr```是安全的。

!!! note

    在 ```new``` 的时候程序除了给你你需要的内存空间之外，还会有一块额外的空间来记录一些信息，比如这块内存的大小等等。然后 ```delete``` 的时候就可以根据这张表来释放内存。

## **Constant**

作用域是一样的，只不过常量是不能被修改的。

在使用常量的时候，编译器倾向于不给它分配内存，而是在需要用到它的时候直接把它替换为常量的值。

```cpp
const int x = 10;
```

要用到常量的时候，编译器会直接把 ```x``` 替换为 ```10```。

但是有一种情况是不可以的：

```cpp
int x;
cin >> x;

const int y = x;
double array[y]; // error
```

这个```y``` 的值是在程序运行时才能确定的，所以数组的大小也是在程序运行时才能确定的，所以这里会报错。

### **Pointers with const**

```cpp
int a[] = {1, 2, 3, 4, 5};

int * const p = a;  // p is const, 所以指针本身不能改
*p = 20;        // OK, 指针指向的对象可以改
p++;            // Error, 因为这是对 p 本身对操作

const int *p = a;   // (*p) is const, 指针指向的东西不能改
*p = 20;        // Error, 指针指向的对象不能改
p++;            // OK, 指针本身可以改
```

!!! note

    ```cpp
    int i = 10;
    const int ci = 20;

    int* ip;
    const int* cip;

    ip = &i;    // OK, 变量指针绑定变量
    ip = &ci;   // Error, 变量指针绑定常量
    cip = &i;   // OK, 常量指针绑定变量
    cip = &ci;  // OK, 常量指针绑定常量

    *ip = 30;   // always OK
    *cip = 30;  // always Error
    ```

## **Passing**

如果想给一个函数传递参数，最好的办法是指针或者引用，因为这样可以避免复制。

```cpp
struct Student
{
    int id;
    char address[1000];
};

void foo(Student s)
{
    cout << "foo: " << s.id << endl;
}

void bar(const student *s)
{
    cout << "bar: " << s->id << endl;
}

void baz(const Student &s)
{
    cout << "baz: " << s.id << endl;
}
```

以上三个函数都可以达到相同的效果，但是 ```foo``` 函数显然代价太大了，因为它会复制一个 ```Student``` 类型的变量，而 ```bar``` 和 ```baz``` 函数只是传递了一个指针或者引用，所以开销很小。