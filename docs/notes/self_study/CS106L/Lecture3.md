---
comments: true
---

## Challenge Quiz

1. auto makes your program slower,so you should use it sparingly.
: FALSE.Auto is resolved at compile-time, but your program at run-time is the same speed.
2. In "auto[i,s] = make_pair(3,"hi")",the compile will deduce that s is a std::string.
: FALSE.A string literal is a C-string (const char*),and auto will deduce s is a C-string.
3. A (Stanford) vertor behaves like a tuple where all the members have the same type.
: FALSE.A vector is a dynamic array, but a tuple has a fixed size.
4. Structured binding unpacks the members of a struct in the order the members were declared in the struct declaration.
: TRUE.
5. Structured binding can unpack individual elements of a Stanford Vector(or std::vector).
: FALSE.Related to question-3.You can only know the number of elements of a vector at run-time.
6. The libe "auto i;" compiles.
: FALSE.Auto does not allow uninitialized variables.

## Size_t

```cpp
string str = "hello World!";
for (int i = 0;i < str.size(); ++i) {
    cout << str[i] << endl;
}
```

When we run this code, we probably get the following warning:

```comparison of integer expressions of different signedness: 'int' and 'std::basic_string<char>::size_type' {aka 'unsigned long'}
```

The warning is because `str.size()` returns a `size_t` which is an unsigned integer type while `i` is a signed integer type.We cannot compare signed and unsigned integers directly.

So what we should do is to change the type of `i` to `size_t`:

```cpp
string str = "hello World!";
for (size_t i = 0;i < str.size(); ++i) {
    cout << str[i] << endl;
}
```

## Topic 1:uniform initialization
