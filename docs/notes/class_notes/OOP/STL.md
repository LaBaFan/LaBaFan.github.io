---
comments: true
---

# **Three Parts of STL**

- Containers(容器)
    - class templates, common data structures
- Algorithms(算法)
    - Functions that operate on range of elements
- Iterators(迭代器)
    - Generlization of pointers, access elements in a uniform manner

## **Containers**

- Sequence Containers
    - array(static), vector(dynamic)
    - deque(double-ended queue)
    - forward_list(singly-linked), list(doubly-linked)
- Associative
    - set(collection of unique keys)
    - map(collection of key-value pairs)
    - multiset, multimap
- Unordered Associative
    - hashed by keys
    - unordered_set, unordered_map
    - unordered_multiset, unordered_multimap
- Adaptors
    - stack, queue, priority_queue

### **Using the vector**

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main()
{
    vector<int> evens{2,4,6,8,10};
    evens.push_back(20);    //在尾端加一个元素
    evens.push_back(22);
    evens.insert(evens.begin()+4, 5, 10);    //在第4个元素前插入5个10

    for(int i = 0; i < evens.size(); i++)
    {
        cout << evens[i] << " ";
    }
    cout << endl;
}
```

得到如下输出：

```
2 4 6 8 10 10 10 10 10 20 22 
```

对于 ```vector``` 的遍历，我们还可以用每个容器自带的迭代器来实现：

```cpp
for(vector<int>::iterator it = evens.begin(); it < evens.end(); ++it)
{
    cout << *it << " "; // 迭代器需要解引用
}
cout << endl;
```

每个容器的迭代器都遵循上边的接口，从 ```begin()``` 到 ```end()```，只是在不同的容器中，迭代器的实现方式不同。

!!! Question "迭代器有什么用"

    你可能想说，对于遍历一个容器来说，我直接用下标不是更方便吗？为什么要用迭代器呢？

    确实，但是迭代器的存在是为了让算法实现的时候比较通用，并且支持我们写一些语法糖。

#### **Basic operations for vector**

- Constructor and destructor
- Element access
    - ```at()```, ```operator[]```, ```front()```, ```back()```
- Iterators
    - ```begin()```, ```end()```, ```cbegin()```, ```cend()```
- Capacity
    - ```size()```, ```empty()```, ```reserve()```, ```capacity()```
- Modifiers
    - ```push_back()```, ```pop_back()```, ```insert()```, ```erase()```, ```swap()```, ```clear()```

### **Using the list**

```cpp
#include <iostream>
#include <string>
#include <list>

using namespace std;

int main()
{
    list<string> s;
    s.push_back("hello");
    s.push_back("world");
    s.push_front("goodbye ");

    list<string>::iterator p;
    for(p = s.begin(); p != s.end(); p++)
    {
        cout << *p << " ";
    }
    cout << endl;
}
```

得到如下输出：

```
goodbye hello world 
```

注意：这里使用迭代器遍历的时候，我们的终止条件是 ```p != s.end()```，而不是 ```p < s.end()```，因为 ```list``` 的迭代器不支持比较大小，只支持比较是否相等。

具体原因是 ```vector``` 的迭代器能力更强，它是支持 ```random access``` 即随机访问的，它的底层是一个数组，访问某个位置的元素只需要 ```O(1)``` 的时间复杂度。而 ```list``` 访问某个位置需要从头一个个遍历，时间复杂度是 ```O(n)```，所以 ```list``` 的迭代器只支持 ```==``` 和 ```!=``` 操作。

所以为了统一，我们在遍历的时候都用 ```!=``` 来判断是否到达了容器的末尾。

### **Using the map**

底层是红黑树，关联式容器。

- Look up by ```key``` , and retrieve a ```value```.
- Example: for a phone book, ```map<string, string>```

```cpp
#include <iostream>
#include <map>
#include <string>

using namespace std;

int main()
{
    map<string, float> price;
    price["apple"] = 1.99;
    price["banana"] = 0.99;

    for( const auto& pair : price)
    {
        cout << pair.first << " : " << pair.second << " ";
    }
    cout << endl;

    string item;
    double total = 0;
    while(cin >> item)
        total += price[item];

    cout << "Total: " << total << endl;
}
```

我们可以通过 ```pair.first``` 和 ```pair.second``` 来访问 ```map``` 中的 ```key``` 和 ```value```。

随后我们输入

```
apple
banana
apple
ctrl+d
```

得到如下输出：

```
apple : 1.99 banana : 0.99
Total: 3.97
```

但是我们的程序有个问题：如果我们在终端中输入一个不存在的 ```key```，比如 ```orange```，那么程序自动在 ```map``` 中插入了一个 ```key``` 为 ```orange``` 的 ```value``` 为 ```0``` 的元素。

我们可以试一试：

```cpp
#include <iostream>
#include <map>
#include <string>

using namespace std;

int main()
{
    map<string, float> price;
    price["apple"] = 1.99;
    price["banana"] = 0.99;

    for( const auto& pair : price)
    {
        cout << "{" << pair.first << " : " << pair.second << "}" << " ";
    }
    cout << endl;

    string item;
    double total = 0;
    while(cin >> item)
        total += price[item];

    cout << "Total: " << total << endl;

    for( const auto& pair : price)
    {
        cout << "{" << pair.first << " : " << pair.second << "}" << " ";
    }
    cout << endl;
}
```

然后输入

```
Tom
Jerry
```

得到如下输出：

```
{apple : 1.99} {banana : 0.99}
Total: 0
{Jerry,0}{Tom,0}{apple,1.99}{banana,0.99}
```

所以我们需要在使用 ```map``` 的时候，先判断 ```key``` 是否存在，再进行操作。

```cpp
while(cin >> item)
{
    if(price.contains(item))
        total += price[item];
    else
        cout << "Item not found!" << endl;
}
```

这样就不会出现上述问题了。

!!! Question

    这个功能存在的意义是什么呢？为什么要自动添加一个元素呢？

    考虑如下代码：

    ```cpp
    #include <iostream>
    #include <map>
    #include <string>

    using namespace std;

    int main()
    {
        map<string, int> word_map;
        for(const auto& word : {"we", "are", "not", "humans", "we", "are", "robots", "!!"})
        {
            word_map[word]++;
        }

        for(const auto& word : word_map)
        {
            cout << "{" << word.first << " : " << word.second << "}" << " ";
        }
    }
    ```

    如上是一个统计词频的功能，我们不需要先把单词加入 ```map```, 程序可以自动统计单词的出现次数，简化工作量。

### **Using the stack**

```cpp
#include <iostream>
#include <stack>
#include <string>

using namespace std;

bool is_balanced(const string & test)
{
	stack<char> st;

	for(char c : test)
	{
		if (c == '(' || c == '{' || c == '[')   //  先push左半边括号
		{
			st.push(c);
		}
		else if (c == ')' || c == '}' || c == ']')  // 如果是右半边，就pop栈顶的元素，检查是否匹配
		{
			if(st.empty()) 
				return false;
			char top = st.top();
			st.pop();

			if ((c == '}' && top != '{' ) || (c == ')' && top != '(') || (c == ']' && top != '['))
				return false;
		}
	}

	return st.empty();  // 如果最后栈为空，说明所有括号都匹配
}

int main()
{
	string test1 = "a(b{c[d]e}f)g";
	string test2 = "x(y{z[)})";

	cout << "Test 1:" << (is_balanced(test1) ? "Balanced" : "Unbalanced") << endl;
	cout << "Test 2:" << (is_balanced(test2) ? "Balanced" : "Unbalanced") << endl;
}
```

如上是我们使用 ```stack``` 来判断一个字符串中的括号是否匹配。

!!! Important "自己实现一个栈"

    ```cpp
    template <typename T>
    class Stack
    {
    public:
        virtual ~Stack() = default; // 虚析构函数
        virtual T& top();
        virtual bool empty() const = 0;
        virtual size_t size() const = 0;
        virtual void push(const T& value) = 0;
        virtual void pop() = 0;
    };

    template <typename T， typename Container = deque<T>>
    class c_stack : public Stack<T>
    {
    public:
        T& top() override
        {
            return c.back();
        }

        bool empty() const override
        {
            return c.empty();
        }

        size_t size() const override
        {
            return c.size();
        }

        void push(const T& value) override
        {
            c.push_back(value);
        }

        void pop() override
        {
            c.pop_back();
        }
    private:
        Container<T> c;
    }
    ```

    然后我们就可以用 ```c_stack``` 来实现作为一个栈的功能。

    在我们有线性表的情况下，实现一个栈是很容易的。

这个就叫 ```Adaptor```，它是一个适配器，用来适配不同的容器，使得它们有相同的接口。

!!! Note

    在标准库中，```stack``` 默认使用 ```deque``` 作为底层容器，但是我们可以通过模板参数来指定底层容器。

## **Algorithms**

- ```for_each```, ```find```, ```count```
- ```copy```, ```fill```, ```transform```, ```replace```, ```rotate```
- ```sort```, ```partial_sort```, ```nth_element```
- ```set_difference```, ```set_union```, ```set_intersection```
- ```min_element```, ```max_element```, ```accumulate```, ```partial_sum```

```cpp
#include <iostream>
#include <vector>
#include <iterator>

using namespace std;

int main()
{
    vector<int> v={1, 2, 3, 5};
    vector<int> u;

    reverse(v.begin(), v.end());    // 反转
    copy(v.begin(), v.end(), back_inserter(u));   // 复制到另一个容器
    copy(u.begin(), u.end(), ostream_iterator<int>(cout, ", "));    // 复制到标准输出流
    cout << endl;
}
```

得到如下输出：

```
5, 3, 2, 1, 
```

但是这样输出并不是很美观，我们只想要逗号在中间输出，我们可以自定义一个输出迭代器，这个在日后会涉及。

## **Iterators**

- connect containers and algorithms
- Talk about it later
    - after templates and operator overloading

### **Typedefs**

我们在平时编程的时候可能会遇到如 ```map<Name, list<PhoneNum>> phonebook``` 等名字很长的情况，这时候我们可以直接用 ```typedef``` 来简化：

```cpp
typedef map<Name, list<PhoneNum>> PB;

PB phonebook;
```

在 ```c++11``` 中我们可以用 ```auto```, ```using``` 来代替 ```typedef```：

```cpp
using PB = map<Name, list<PhoneNum>>;
```