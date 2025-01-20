---
comments: true
---

## Aggregate Structures

A structure is a collection of named variables.

```cpp
struct Report {
    string date;
    size_t cases;
    size_t deaths;
};
```

Structures are similar to classes, but all members in a structure are public by default(```date,cases,deaths```).

You can access each member using the dot(.) operator.

```cpp
int main() {
    Report current;
    current.date = "2025-01-20";
    current.cases = 100;
    current.deaths = 10;
}
```

---

We have two special structs in C++ called ```pair``` and ```tuple```.

```std::pair``` has two members named ```first``` and ```second```.

```std::tuple``` has multiple members.

??? note 
    ```pair``` appears a lot in C++ standard library while ```tuple``` is rarely used.So don't talk much about ```tuple```.

    Any type of data can be given to ```pair``` and ```tuple```.But the name of the members are always ```first``` and ```second```.

```cpp
int main() {
    std::pair<bool,Report> query_result;
    query_result.first = true;
    Report current = query_result.second;

    std::turple<string,size_t,size_t> report;
}
```

---

std::array and std::vector are collections of homogeneous type.

```cpp
int main() {
    std::array<int,2> arr;
    arr[0] = 10;
    arr[1] = 2;
    cout << arr[-1] << endl;

    std::vector<int> vec;
    vec.push_back(1);
    vec.resize(3);
    vec[2] = 1;
    cout << vec[3] << endl;
}
```

A ```std::array``` has a fixed size 2 and fixed type ```int```.You can access the elements using the subscript operator ```[]```.

A ```std::vector``` has a dynamic size and you can add elements using ```push_back()```.

## Auto and Structured Binding

```auto``` keyword is used to deduce the type of a variable.

```cpp
auto a = 3;
auto b = 3.14;
auto c = 'X';
auto d = "Hello";
auto e = "Hello"s;
auto f = std::make_pair(3,"Hello");
auto g = {1,2,3};
auto h = [](int i) {return 3*i;};
```

!!! note "Answers"
    a = int
    b = double
    c = char
    d = char*
    e = std::string
    f = std::pair<int,char*>
    g = std::initializer_list<int>
    h = only konwn by compiler

### When and Why to Use Auto

#### When

- You don't care about the exact type(iterators).
- When its type is clear from context(templates).
- When you can't figure out the type(lambdas).
- Avoid using auto for return values(exception: generic programming).

#### Why
- Correctness: no implict conversions,uninitialized variables.
- Flexibility: code easily modifiable if type changes need to be made.
- Powerful: very important when we get to templates.
- Modern IDE's can infer a type simply by hovering your cursor over any auto, so readability is not an issue.

```cpp
auto p = std::make_pair(true,3);
auto [found, num] = p;

auto arr = std::make_tuple('x','y','z','w');
auto [a,b,c,d] = arr;
```

## Exercise: quadratic solver
Given three real numbers a,b,c, find the roots of the quadratic equation ax^2 + bx + c = 0.

```cpp
#include <iostream>

using namespace std;

std::pair<bool, std::pair<double,double> > quadratic(int a, int b, int c)
{
    double discriminant = b * b - 4 * a * c;
    std::pair<double, double> solutions;
    if (discriminant < 0)
    {
        return std::make_pair(false, solutions);
    }
    else
    {
        double x1 = (-b + sqrt(discriminant)) / (2 * a);
        double x2 = (-b - sqrt(discriminant)) / (2 * a);
        solutions = std::make_pair(x1, x2);
        return std::make_pair(true, solutions);
    }
}

int main()
{
    int a, b, c;
    std::cin >> a >> b >> c;

    auto [found, solutions] = quadratic(a, b, c);
    if (found)
    {
        auto [x1, x2] = solutions;
        std::cout << "Roots are " << x1 << " and " << x2 << std::endl;
    }
    else
    {
        std::cout << "No real roots" << std::endl;
    }
}
```