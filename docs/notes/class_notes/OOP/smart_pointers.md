# **Smart Pointers**

## **Standard smart pointers**

- `std::unique_ptr`
- `std::shared_ptr`
- `std::weak_ptr`
- `std::auto_ptr` (deprecated in c++11)

智能指针的目的是为了更好地管理动态内存，避免内存泄漏和悬空指针等问题。它们通过 RAII（资源获取即初始化）原则，确保在不再需要时自动释放内存。

在使用的时候需要引入 `<memory>` 头文件。

```cpp
#include <iostream>
#include <memory>

using namespace std;

struct Resource
{
    int data;
    Resource(int d) : data(d) {}
    ~Resource() { cout << "Resource with data " << data << " destroyed\n"; }
};

int main()
{
    {
        unique_ptr<Resource> p(new Resource(42));
    }
}
```

我们在大括号中创建了一个 `unique_ptr`，它会在离开作用域时自动释放资源。所以在运行程序之后我们可以看到 `Resource with data 42 destroyed` 的输出，表示资源被正确释放。

需要注意的是，智能指针的 `copy` 和 `assignment` 操作是被禁止的，因为它是 `unique_ptr`，代表这个资源的所有权是唯一的。

比如下边这段代码就是过不了编译的情况。

```cpp
#include <iostream>
#include <memory>

using namespace std;

struct Resource
{
    int data;
    Resource(int d) : data(d) {}
    ~Resource() { cout << "Resource with data " << data << " destroyed\n"; }
};

int main()
{
    {
        unique_ptr<Resource> p1(new Resource(42));
        unique_ptr<Resource> p2(new Resource(84));
        cout << "p1 data: " << p1->data << endl;

        p1 = p2;    // 编译错误，不能复制 unique_ptr
    }
}
```

但是我们可以做 `p1 = std::move(p2);`，这样就可以将 `p2` 的所有权转移给 `p1`，而 `p2` 将不再指向任何资源，同时 `p1` 原来指向的资源会被释放。

### **`unique_ptr`**

接下来我们可以试着自己实现一个 `unique_ptr` 的简化版本。

!!! note

    === "一般版本"
        ```cpp
        template <typename T>
        class u_ptr
        {
        public:
            // 加入 explicit 禁止隐式转换
            explicit u_ptr(T *ptr = nullptr) : p_(ptr) {}

            ~u_ptr()
            {
                delete p_;
            }

            // 禁止拷贝构造和赋值操作
            u_ptr(const u_ptr &) = delete;
            u_ptr &operator=(const u_ptr &) = delete;

            // 允许移动构造, && 是右值引用，了解即可
            u_ptr(u_ptr &&other) noexcept
                : p_(other.release()) {}
            u_ptr &operator=(u_ptr &&other) noexcept
            {
                reset(other.release());
                return *this;
            }

            T &operator*() const
            {
                return *p_;
            }

            T *operator->() const
            {
                return p_;
            }

            T *get() const
            {
                return p_;
            }

            T *release() // 释放管理权，返回原始指针，注意不是 delete
            {
                T *ptr = p_;
                p_ = nullptr;
                return ptr;
            }

            void reset(T *ptr = nullptr) // 重置指针，删除原有资源
            {
                delete p_;
                p_ = ptr;
            }

        private:
            T *p_;
        };
        ```
    
    === "数组版本"
        ```cpp
        template <typename T>
        class u_ptr<T[]>
        {
        public:
            // 加入 explicit 禁止隐式转换
            explicit u_ptr(T *ptr = nullptr) : p_(ptr) {}

            ~u_ptr()
            {
                delete[] p_;
            }

            // 禁止拷贝构造和赋值操作
            u_ptr(const u_ptr &) = delete;
            u_ptr &operator=(const u_ptr &) = delete;

            // 允许移动构造, && 是右值引用，了解即可
            u_ptr(u_ptr &&other) noexcept
                : p_(other.release()) {}
            u_ptr &operator=(u_ptr &&other) noexcept
            {
                reset(other.release());
                return *this;
            }

            T &operator[](size_t index) const
            {
                return p_[index];
            }

            T *get() const
            {
                return p_;
            }

            T *release() // 释放管理权，返回原始指针，注意不是 delete
            {
                T *ptr = p_;
                p_ = nullptr;
                return ptr;
            }

            void reset(T *ptr = nullptr) // 重置指针，删除原有资源
            {
                delete[] p_;
                p_ = ptr;
            }

        private:
            T *p_;
        };
        ```

### **`shared_ptr`**

`shared_ptr` 是一个引用计数的智能指针，它允许多个 `shared_ptr` 实例共享同一个资源。当最后一个 `shared_ptr` 被销毁时，资源才会被释放。

```cpp
#include <iostream>
#include <memory>

using namespace std;

struct Resource
{
    int data;
    Resource(int d) : data(d) {}
    ~Resource() { cout << "Resource with data " << data << " destroyed\n"; }
};

int main()
{
    shared_ptr<Resource> p2(new Resource(7));
    {
        shared_ptr<Resource> p1(new Resource(10));
        cout << "p1 = " << p1.get() << endl;
        cout << "p1->data = " << p1->data << endl;

        p2 = p1;
        cout << "--- After Copy ---\n";
        cout << "p2 = " << p2.get() << endl;
        cout << "p2->data = " << p2->data << endl;
    }
    cout << "Before exit main" << endl;
}
```

程序输出为：

```bash
p1 = 0x153e060c0
p1->data = 10
Resource with data 7 destroyed
--- After Copy ---
p2 = 0x153e060c0
p2->data = 10
Before exit main
Resource with data 10 destroyed
```

从上面的代码可以看到，`shared_ptr` 是可以通过拷贝构造函数来实现共享所有权的。当一个 `shared_ptr` 被拷贝时，引用计数会增加，直到最后一个 `shared_ptr` 被销毁时，资源才会被释放。

所以在执行 `p2 = p1;` 之后，`p2` 指向的对象被销毁了，而此时 `p2` 与 `p1` 指向同一个资源，在退出它们的作用域（`p2` 为整个 `main`，`p1` 为大括号内）时，资源会被正确释放。

下面同样做一个简单的 `shared_ptr` 的实现。

```cpp
template <typename T>
class s_ptr
{
private:
    // 使用 ControlBlock 来管理资源和引用计数，指针和计数一一对应
    struct ControlBlock
    {
        T *p_;
        size_t ref_count_;

        ControlBlock(T *ptr) : p_(ptr), ref_count_(1) {}
        ~ControlBlock()
        {
            delete p_;
        }
    };

    ControlBlock *cb_;

    void add_shared() // 加一个管理者
    {
        if (cb_)
        {
            cb_->ref_count_++;
        }
    }

    void release_shared() // 减一个管理者
    {
        if (cb_)
        {
            cb_->ref_count_--;
            if (cb_->ref_count_ == 0)
            {
                delete cb_;
            }
        }
    }

public:
    explicit s_ptr(T *ptr = nullptr)
    {
        if (ptr)
            cb_ = new ControlBlock(ptr);
        else
            cb_ = nullptr;
    }

    ~s_ptr()
    {
        release_shared();
    }

    s_ptr(const s_ptr &other) : cb_(other.cb_)
    {
        add_shared();
    }

    s_ptr &operator=(const s_ptr &other)
    {
        if (this != &other)
        {
            release_shared(); // 释放当前的资源
            cb_ = other.cb_;  // 共享新的资源
            add_shared();     // 增加引用计数
        }
        return *this;
    }

    T &operator*() const
    {
        return *(cb_->p_);
    }

    T *operator->() const
    {
        return cb_->p_;
    }

    T *get() const
    {
        return cb_ ? cb_->p_ : nullptr;
    }

    size_t use_count() const
    {
        return cb_ ? cb_->ref_count_ : 0;
    }
};
```