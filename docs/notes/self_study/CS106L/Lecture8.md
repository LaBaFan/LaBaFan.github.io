---
comments: true
---

## Algorithms

Algorithms we will explore:

1. ```std::sort```
2. ```std::nth_element```
3. ```std::stable_partition```
4. ```std::copy_if```
5. ```std::remove_if```

!!! example "Find the median course rating"

    If we want to calculate the median course rating, we have two ways to do it:
    
    === "$O(N \log{N}) \ \mathrm{sort}$"
    
        ```cpp
        struct Course {
            string code,
            double rating;
        };
    
        auto compRating = [](const auto& s1, const auto &s2) {
            return s1.rating < s2.rating;
        };
    
        size_t size = classes.size();
    
        // O(N log N) sort
        std::sort(classes.begin(), classes.end(), compRating);
    
        Course median = classes[size/2];
        ```
    
    === "$O(N) \ \mathrm{sort}$"
    
        ```cpp
        struct Course {
            string code,
            double rating;
        };
    
        auto compRating = [](const auto& s1, const auto &s2) {
            return s1.rating < s2.rating;
        };
    
        size_t size = classes.size();
    
        // O(N) sort, sorts so nth_element is in correct position
        // all elements smaller to left, larger to right
        Course median = *std::nth_element(classes.begin(), classes.end(), size/2, compRating);
        ```

### Stable Partition

Imagine we have a vector of strings, we can use ```std::stable_partition``` to partition the vector into two groups(for example cs courses and non-cs courses) without breaking their relative order.

| CS61A | CS106L | Math | Physics | English | CS61B |
| :---: | :----: | :--: | :-----: | :-----: | :---: |

After calling ```std::stable_partition```, we will get two groups:

| CS61A | CS106L | CS61B | Math | Physics | English |
| :---: | :----: | :---: | :--: | :-----: | :-----: |

And ```std::stable_partition``` will return an iterator pointing to the first element of the second group.

```cpp
string dep = "CS";
auto isDep = [dep](const auto& course) {
    return course.name.size() >= dep.size() && course.substr(0, dep.size()) == dep;
};

auto iter = std::stable_partition(courses.begin(), courses.end(), isDep);

courses.erase(iter, courses.end());
```

### Copy

What if we want to copy all the cs courses to another vector?

```cpp
string dep = "CS";
auto isDep = [dep](const auto& course) {
    return course.name.size() >= dep.size() && course.substr(0, dep.size()) == dep;
};

std::cpy_if(courses.begin(), courses.end(), csCourses, isDep);
```

Sometimes the code above doesn't work beacuse the space of the vector ```csCourses``` is not enough, we may write into unintialized memory.

So we need a special iiterator to solve this problem, ```std::back_inserter```.

It will expand the vector when needed.

```cpp
string dep = "CS";
auto isDep = [dep](const auto& course) {
    return course.name.size() >= dep.size() && course.substr(0, dep.size()) == dep;
};

std::cpy_if(courses.begin(), courses.end(), back_inserter(csCourses), isDep);
```

### Stream Iterators

Look at the code below:

```cpp
string dep = "CS";
auto isDep = [dep](const auto& course) {
    return course.name.size() >= dep.size() && course.substr(0, dep.size()) == dep;
};

std::copy_if(csCourses.begin(), csCourses.end(),
std::ostream_iterator<Course>(cout, "\n"), isDep);
```

We can use ```std::ostream_iterator``` to write the elements to the output stream.

### Remove

One thing to note that ```std::remove_if``` doesn't actually remove the elements, we can check it by the code below:

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main()
{
  auto isLessThan5 = [](int x) { return x < 5; };

  vector<int> v = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
  cout << "Before remove the size:" << v.size() << endl;
  for (auto i : v)
  {
    cout << i << " ";
  }
  cout << endl;
  remove_if(v.begin(), v.end(), isLessThan5);
  cout << "After remove the size:" << v.size() << endl;
  for (auto i : v)
  {
    cout << i << " ";
  }
}
```

We get the output:

```cpp
Before remove the size:10
1 2 3 4 5 6 7 8 9 10
After remove the size:10
5 6 7 8 9 10 7 8 9 10
```

We can clearly see that the size of the vector doesn't change and the elements are just moved forward.

So we need to use ```std::erase``` to remove the elements.

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main()
{
  auto isLessThan5 = [](int x) { return x < 5; };

  vector<int> v = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

  cout << "Before remove the size:" << v.size() << endl;
  for (auto i : v)
  {
    cout << i << " ";
  }
  cout << endl;

  v.erase(remove_if(v.begin(), v.end(), isLessThan5), v.end());

  cout << "After remove the size:" << v.size() << endl;
  for (auto i : v)
  {
    cout << i << " ";
  }
  cout << endl;
}
```

We get the output:

```cpp
Before remove the size:10
1 2 3 4 5 6 7 8 9 10
After remove the size:6
5 6 7 8 9 10
```

We have correctly removed the elements.

??? note "Why does ```std::remove_if``` not remove the elements?"

    Because the Algorithm ```remove_if``` is not a member of ```std::vector``` (or any other collection). So it doesn't have the ability to remove elements from the vector.

    Must be used in conjunction with ```std::erase``` to remove the elements.