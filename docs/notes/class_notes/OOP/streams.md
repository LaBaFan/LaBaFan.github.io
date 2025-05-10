---
comments: true
---

# **Streams**

## **Stream naming convections**

|            |     Input     |    Output     |      Header       |
| :--------: | :-----------: | :-----------: | :---------------: |
|  Generic   |    istream    |    ostream    | ```<iostream>```  |
|    File    |   ifstream    |   ofstream    |  ```<fstream>```  |
|  C String  |  istrstream   |  ostrstream   | ```<strstream>``` |
| C++ String | istringstream | ostringstream |  ```<sstream>```  |

## **Defining a stream extractor**

```cpp
istream& operator>>(istream& is, T& obj)
{
    // specific code to read obj
    return is;
}
```

## **Defining a stream inserter**

```cpp
ostream& operator<<(ostream& os, const T& obj)
{
    // specific code to write obj
    return os;
}
```

这里传入的 ```obj``` 是 ```const``` 的，因为我们只需要读取它的值，而不需要修改它。

## **Other output operators**

- ```flush()```
    - Force output of stream contents
    - 把 stream 对象中缓存的内容都清空

## **Formatting using manipulators**

起状态控制的作用，需要 ```#include <iomanip>``` 头文件。

```cpp
int n;
cout << "Enter number in hexadecimal: " << endl;
cin >> hex >> n;
```

这里的 ```hex``` 是一个 manipulator，表示输入的数字是十六进制的。它会把输入的数字转换成十进制的整数。

!!! NOTE

    ```endl``` 也是一个 manipulator，它会在输出流中插入一个换行符，并 flush 。

### **Creating manipulators**

```cpp
ostream& manip(ostream& os)
{
    // specific code to manipulate os
    return os;
}

ostream& tab(ostream& os)
{
    return out << "\t";
}

cout << "Hello" << tab << "World!" << endl;
```