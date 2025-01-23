---
comments: true
---

## Template Functions
If we want to compare two numbers,we may have a ```my_min``` function:

```cpp
int my_min(int a, int b) {
    return a < b ? a : b;
}
```

But what if we want to compare two strings?We may write another function ```my_min_string```.But what if comapring two ```double```s?We don't want to write a ```my_min_double``` function again.That bothers.

So oen way is to use overloaded functions:

```cpp
int my_min(int a, int b) {
    return a < b ? a : b;
}

string my_min(string a, string b) {
    return a < b ? a : b;
}
```

But this way also has a problem: how do you handle user defined types?

We now have a generic function!

```cpp
template <typename T>
T my_min(const T& a, const T& b) {
    return a < b ? a : b;
}
```

!!! note "Declaration"

    ```template``` declares the next declaration is a template.

    ```<typename T>``` specifies T is some arbitrary type.

When you call a template function,either:

- for explicit instantiation,compiler finds the relevant templates and creates that function in the executable.
- for implicit instantiation,compiler looks at all possilbe overloads (template and non-template),picks the best one,deduces the template parameters,and creates the function in the executable.
- After instantiation,compiler looks as if you had written the instantiated version of the function yourself.

!!! important "Template functions are note functions"
    It's a recipe for generating functions via instantiation.

    Distinction is important for separate compilation.

## Variadic Templates
In the above example,we can only compare two numbers.But what if we want to compare more than two numbers?

We can write a recursive version of the function which accepts a vector.

```cpp
template <typename T>
T my_min(vector<T>& nums) {
    T elem = nums[0];
    if(nums,size() == 1) return elem;
    auto min = my_min(nums.subList(1));
    if(elem < min) min = elem;
    return min;
}
```

But a more elegant way is to use variadic templates.

??? info "可变参数模版"
    一个可变参数模版就是一个接受可变数目参数的模版函数或模版类.可变数目的参数被称为参数包(parameter packet).存在两种参数包:模版参数包(template parameter packet),表示零个或多个模版参数;函数参数包(function parameter packet),表示零个或多个函数参数.

    - C++ Primer 中文 第5版 第618页

```cpp
template <typename T, typename ... Ts>
T my_min(T num, Ts ... args) {
    auto min = my_min(args...);
    if(num < min) min = num;
    return min;
}
```

- Args 是一个模版参数包;rest是一个函数参数包
- Args 表示零个或多个模版类型参数
- rest 表示零个或多个函数参数

```cpp
template <typename T, typename... Args>
void foo(const T &t, const Args& ... rest);
```

上边的代码声明了```foo```是一个可变参数函数模版,它有一个名为```T```的类型参数,和一个名为```Args```的模版参数包.这个包表示零个或多个额外的类型参数.```foo```的函数参数列表包含一个```const &```类型的参数,指向```T```的类型,还包含一个名为```rest```的函数参数包,此包表示零个或多个函数参数.

编译器从函数的实参推断模版参数类型.对于一个可变参数模版,编译器还会推断包中参数的数目.如,给定下边调用:

```cpp
int i = 0; double d = 3.14; string s = "how now brown cow";
foo(i, s, 42, d);
foo(s, 42, "hi");
foo(d, s);
foo("hi");
```

编译器会实例化出四个不同版本

```cpp
void foo(const int&, const string&, const int&, const double&);
void foo(const string&, const int&, const char[3]&);
void foo(const double&, const string&);
void foo(const char[3]&);
```

!!! note

    ```cpp
    f(h(args...) + args...);
    ```

    equal to ```f(f(E1,E2,E3) + E1, h(E1,E2,E3) + E2, h(E1,E2,E3) + E3);```

The type do not have to be homogenous.For example:

```cpp
template <typename T, typename... Ts>
void printf(string format, T value, Ts... args) {
    // ...
}
```

## Concept Lifting
A predicate is a function which takes in some number of arguments and returns a boolean.

```cpp
// Unary predicate (one argument)
bool is_equal_to_3(int x) {
    return x == 3;
}

// Binary predicate (two arguments)
bool is_less_than(int x, int y) {
    return x < y;
}
```

Then we can call this function with a predicate.

```cpp
bool is_less_than_5(int x) {
    return x < 5;
}

int main() {
    vector<int> vec{1, 3, 5, 7, 9};
    count_occurences(vec.begin(), vec.end(), is_less_than_5);
}
```

??? question "What if we want to change the limit?"
    
    Here out function only compares with 5,what if we want to compare with other numbers?

    One direct way is to write a new function for each number.But that's not a good idea.

So lambda functions are introduced.

### Lambda Functions

Old approach:function pointers

```cpp
bool is_less_than_limit(int val) [
    return val < limit;
]

int main() {
    vector<int> vec{1, 3, 5, 7, 9};
    int limit = 5;

    count_occurences(vec.begin(), vec.end(), is_less_than_limit);
    return 0;
}
```

New approach:lambda functions

```cpp
int main() {
    vector<int> vec{1, 3, 5, 7, 9};
    int limit = 5;

    auto  is_less_than_limit = [limit](auto val) {
        return val < limit;
    }

    count_occurences(vec.begin(), vec.end(), is_less_than_limit);
    return 0;
}
```

!!! note "Lambda Functions"

    ```
    auto  is_less_than_limit = [limit](auto val) -> bool {
        return val < limit;
    }
    ```

    - ```auto``` because we don't know the type
    - ```[limit]``` is capture clause,giving access to outside variables
    - ```(auto val)``` is the parameter list
    - ```-> bool``` is the return type,optional
    - Accessible variables inside lambda limited to capture clause and parameter list.

!!! note 
    We can ignore the parameter list and return type if they are not needed.

    ```cpp
    auto f = [] { return 42; };
    ```

You can also capture by reference.

```cpp
set<string> teas{"black", "green", "oolong"};
string banned = "boba";
auto liked_by_Avery = [&teas, banned](auto type) {
    return teas.count(type) && type != banned;
};
```

You can also capture everything by value or reference.

```cpp
//capture all by value,except teas is by reference
auto fun1 = [=, &teas](parameters) -> return_value {
    // ...
};

//capture all by reference,except banned is by value
auto fun2 = [&, banned](parameters) -> return_value {
    // ...
};
```

??? info "显式捕获与隐式捕获"

    以下内容来自C++ Primer 中文 第5版 第351页

    === "显式捕获"
        显式捕获顾名思义,直接在方括号中指定要捕获的变量,并且可以指定捕获方式(引用或值).

        ```cpp
        auto is_less_than_limit = [limit](auto val) {
            return val < limit;
        };


    === "隐式捕获"
        除了显式捕获之外,还可以让编译器根据lambda体中的代码来推断我们需要使用哪些变量.为了指示编译器推断捕获列表,应在捕获列表中写一个```&```或```=```.```&```告诉编译器采用捕获引用方式,```=```则表示采用值捕获方式.

        显式捕获和隐式捕获可以混合使用,```&```和```=```之间也可以混合使用.

        ```cpp
        //隐式捕获,值捕获
        auto is_less_than_limit = [=](auto val) {
            return val < limit;
        };
        ```

        ```cpp
        //隐式捕获,引用捕获
        auto is_less_than_limit = [&](auto val) {
            return val < limit;
        };
        ```

## Implicit Interfaces

```cpp
template <typename InputIt, typename DataType>
int count_occurences(InputIt begin, InputIt end, DataType val) {
    int count = 0;
    for(auto iter = begin; iter != end; ++iter) {
        if(*iter == val) {
            ++count;
        }
    }
    return count;
}
```

Each template parameter must have the operations the function assumes it has.

- InputIt must support
  - copy assignment (```iter = begin```)
  - prefix operator (```++iter```)
  - comparable to end (```begin != end```)
  - dereference (```*iter```)
- DataType must support
  - comparable to ```*iter```

Associative containers have an implicit interface:the type must support the ```<``` operator.

```cpp
std::set<std::pair<int, int>> set1; // OK - comparable
std::set<std::ifstream> set2;       // Error - not comparable

std::map<std::set<int>,int> map1;   // OK - comparable
std::map<std::function,int> map2;   // Error - not comparable
```

## Overload resolution

> What if there are multiple potential templates functions?

1. From all functions within scope,look up all functions that match the <font color = orange>name of function call</font>.Iif template is found,<font color = orange>deduce</font> the type.
2. From all candidate functions,check the number and types of the parameters.For template instantiations,try substituting and see if implicit interface satisfied.If fails,<font color = red>remove these instantiations</font>.
3. From all viable functions,<font color = green>rank</font> the viable functions based on the <font color = green>type conversions necessary</font> and the priority of various template types.Choose the <font color = green>best function</font>.

!!! note "Summary"
    查找匹配的函数,然后检查函数的参数数量以及类型,再对所有符合条件的函数排序,选择最佳函数.

!!! important "SFINAE'

    - **S**ubstitution **F**ailure **I**s **N**ot **A**n **E**rror
    - When substituting the deduced types fails(in the immdeiate context) because the type doesn't satisfy implicit interfaces,this does not result in a compile error.
    - Instead,the template is removed from the list of viable functions.

Here are some SFINAE examples:

!!! example

    === "```a.size()```"

        ```cpp
        template <typename T>
        auto print_size(const T& a) -> decltype((void) a.size(), size_t()) {
            cout << "Printing with size member function: ";
            cout << a.size() << endl;

            return a.size();
        }

        // T = int (fail)
        // T = vector<int> (success)
        // T = vector<int>* (fail)
        ```
    
    === "```-a```"

        ```cpp
        template <typename T>
        auto print_size(const T& a) -> decltype((void) -a, size_t()) {
            cout << "Printing with unary minus operator: ";
            cout << -a << endl;

            return -a;
        }

        // T = int (success)
        // T = vector<int> (fail)
        // T = vector<int>* (fail)
        ```

    === "```a->size()```"

        ```cpp
        template <typename T>
        auto print_size(const T& a) -> decltype((void) a->size(), size_t()) {
            cout << "Printing with arrow member function: ";
            cout << a->size() << endl;

            return a->size();
        }

        // T = int (fail)
        // T = vector<int> (fail)
        // T = vector<int>* (success)
        ```

So from the above examples we can see that,SFNIAE removes the overloads which do not compile,allowing you to call printSize on different types.