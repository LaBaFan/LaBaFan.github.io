---
comments: true
---

## Streams
A stream is an abstraction for input/output.

You can think of it as a source(input) or destination(output) of characters of indefinite length.

## The Idea Behind Streams

How does the stream work?

- Input from user is in text form(string).
- Output to user is in text form(string).
- Intermediate computation needs to be done in object form.

## Types of Streams
### Output Streams
Can only **receive** data.

- The ```std::cout``` stream is an example of an output stream.
- All output streams are of type ```std::ostream```.

We can use a ```std::ostream``` for more than just printing to a console.

We can send the data to a file using a ```std::ofstream```,which is a special type of ```std::ostream```.

### Input Streams
Can only **give** data.

- The ```std::cin``` stream is an example of an output stream.
- All output streams are of type ```std::istream```.

We can use a ```std::istream``` for more than just printing to a console.

We can read the data from a file using a ```std::ifstream```,which is a special type of ```std::istream```.

Think that when we use ```>>``` to read data from the shell,we will only get a **single word**,not the whole line.

So if we want to read a whole line,we can use ```std::getline()``` function.

## Stream Internals
We know that writing to a console/file is a slow operation.
If the program had to write each character immediately,it would be very slow.

So what we do is to write to a buffer.

- Accumulate characters in a buffer.
- When buffer is full,write out all contents of the buffer to the output device at once.

## State Bits
Stream have four bits to indicate their state.
- **G(Good bit)**:ready for read/write.
- **F(Fail bit)**:previous operation failed,all future operations frozen.
- **E(EOF bit)**:previous operation reached the end of buffer content.
- **B(Bad bit)**:external error,likely irrecoverable.

When we read the data,we have the following 4 steps:

1. Read data.
2. Check if data is vaild,if not break.
3. Use data.
4. Go back to step 1.

```cpp
while(true) {
    stream >> temp;
    if(stream.fail()) break;
    do_something(temp);
}
```

If we convert streams to bool,we get the following:

```cpp
while(true) {
    stream >> temp;
    if(!stream) break;
    do_something(temp);
}
```

We konw that ```stream >> temp``` returns the stream itself,so we can use it as a condition.

```cpp
while(true) {
    if(!(stream >> temp)) break;
    do_something(temp);
}
```

One more step,we can simplify the logic:

```cpp
while(stream >> temp) {
    do_something(temp);
}
```

## Stream Manipulators
There are some special functions that can be used to modify the behavior of the stream.

What we are familiar with is ```std::endl```,which is used to end the line.

!!! note "Stream Manipulators"

    === "Common"

        - **endl** : insert a newline and flushed the stream.
        - **ws** : skips all whitespace until it finds another char.
        - **boolalpha** : print ```true``` or ```false``` for bools.

    === "Numeric"

        - **boolalpha** : print ```true``` or ```false``` for bools.
        - **hex** : print numbers in hex.
        - **setprecision** : adjust the precision numbers print with.

    === "Padding"

        - **setw** : set the width of the next output.
        - **setfill** : set the fill character for padding.
  
For example:

!!! example

    === "example1"

        === "code"

            ```cpp
            std::cout << "[" << std::setw(10) << "Hi" << "]" << std::endl;
            ```

        === "Output"

            ```cpp
            [        Hi]
            ```

    === "example2"

        === "code"

            ```cpp
            std::cout << "[" << std::left << std::setw(10) << "Hi" << "]" << std::endl;
            ```

        === "Output"

            ```cpp
            [Hi        ]
            ```

    === "example3"

        === "code"

            ```cpp
            std::cout << "[" << std::left << std::setfill('-') << std::setw(10) << "Hi" << "]" << std::endl;
            ```

        === "Output"

            ```cpp
            [Hi--------]
            ```

    === "example4"
    
        === "code"

            ```cpp
            std::cout << std::hex << 10;
            std::cout << std::oct << 10;
            std::cout << std::dec << 10;
            ```

        === "Output"

            ```cpp
            a
            12
            10
            ```

If you are interested in the details of the manipulators,you can refer to the [manipulators](http://www.cplusplus.com/reference/library/manipulators/).

## Std::stringstream

We can use ```std::stringstream``` to convert between strings and other types.

```cpp
#include <sstream>

int main() 
{
    std::string line = "137 2.718 Hello";
    std::stringstream stream(line);

    int myInt;
    double myDouble;
    std::string myString;
    stream >> myInt >> myDouble >> myString;

    std::cout << myInt << std::endl;
    std::cout << myDouble << std::endl;
    std::cout << myString << std::endl;
}
```

!!! note "When to use stringstream"

    - If you need error checking for user input,best practice is to:
        - use getline to retrieve a line from cin.
        - create a stringstream with the line.
        - parse the line using a stringstream,usually with >>.
    - Use state bits to control streams and perform error-checking.
        - fail bit can check type mismatches.
        - eof bit can check if you consumed all input.