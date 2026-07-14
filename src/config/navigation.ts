export type NavItem = {
  title: string;
  href: string;
  children?: readonly NavItem[];
};

const note = (path = '') => `/notes${path ? `/${path}` : ''}/`;

export const NAVIGATION = [
  {
    title: '笔记',
    href: note(),
    children: [
      {
        title: '课程笔记',
        href: note('class_notes'),
        children: [
          {
            title: '计算机组成与设计', href: note('class_notes/CO'), children: [
              { title: '概述', href: note('class_notes/CO') },
              ...[1, 2, 3, 4, 5, 6].map((chapter) => ({ title: `Chapter ${chapter}`, href: note(`class_notes/CO/chapter${chapter}`) })),
            ],
          },
          {
            title: '高级数据结构与算法设计', href: note('class_notes/ADS'), children: [
              { title: '概述', href: note('class_notes/ADS') },
              {
                title: '数据结构', href: note('class_notes/ADS'), children: [
                  ['AVL Tree 与 Splay Tree', 'AVL_tree&splay_tree'], ['红黑树', 'red_black_tree'], ['B+ 树', 'b_plus_tree'], ['左式堆', 'Leftist_heap'], ['斜堆', 'Skew_heap'], ['倒排索引', 'inverted_index'], ['二项队列', 'binomial_queue'],
                ].map(([title, slug]) => ({ title, href: note(`class_notes/ADS/${slug}`) })),
              },
              {
                title: '算法设计', href: note('class_notes/ADS'), children: [
                  ['Backtracking', 'backtracking'], ['Divide and Conquer', 'divide_and_conquer'], ['Dynamic Programming', 'dynamic_programming'], ['Greedy', 'Greedy'], ['NP-Complete', 'np_complete'], ['Approximation', 'Approximation'], ['Local Search', 'Local_search'], ['Randomized Algorithm', 'Randomized_Algorithm'], ['Parallel Algorithm', 'Parallel_Algorithm'], ['External Sort', 'External_Sort'],
                ].map(([title, slug]) => ({ title, href: note(`class_notes/ADS/${slug}`) })),
              },
            ],
          },
          {
            title: '普通物理学Ⅱ', href: note('class_notes/general_physics_2'), children: [
              { title: '概述', href: note('class_notes/general_physics_2') },
              ...[["麦克斯韦方程组", "Maxwell's_Equations"], ['电磁波与光波', '电磁波与光波'], ['光学', '光学'], ['量子', '量子']].map(([title, slug]) => ({ title, href: note(`class_notes/general_physics_2/${slug}`) })),
            ],
          },
          {
            title: '数据库系统（DB）', href: note('class_notes/DB'), children: [
              { title: '概述', href: note('class_notes/DB') },
              ...[1, 2, 3, 4, 5, 6, 7, 12, 13, 14, 15, 16, 17, 18].map((chapter) => ({ title: `Chapter ${chapter}`, href: note(`class_notes/DB/ch${chapter}`) })),
            ],
          },
          {
            title: '计算机体系结构（CA）', href: note('class_notes/CA'), children: [
              { title: '概述', href: note('class_notes/CA') },
              ...[1, 2, 3].map((chapter) => ({ title: `Chapter ${chapter}`, href: note(`class_notes/CA/ch${chapter}`) })),
            ],
          },
          {
            title: '面向对象程序设计（OOP）', href: note('class_notes/OOP'), children: [
              { title: '概述', href: note('class_notes/OOP') },
              ...[['STL', 'STL'], ['Memory Model', 'memory'], ['Class', 'class'], ['Ctor/Dtor', 'ctor_dtor'], ['Composition & Inheritance', 'composition_inheritance'], ['Polymorphism', 'Polymorphism'], ['Design', 'design'], ['Copy Constructor', 'copy_constructor'], ['Operator Overloading', 'operator_overload'], ['Streams', 'streams'], ['Templates', 'templates'], ['Iterators', 'iterators'], ['Exceptions', 'exceptions'], ['Smart Pointers', 'smart_pointers'], ['Miscellaneous Topics', 'miscellaneous_topics']].map(([title, slug]) => ({ title, href: note(`class_notes/OOP/${slug}`) })),
            ],
          },
        ],
      },
    ],
  },
] as const satisfies readonly NavItem[];
