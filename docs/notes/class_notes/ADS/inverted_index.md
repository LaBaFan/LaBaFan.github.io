---
comments: true
---

# 倒排索引

| |Relevant|Irrelevant|
|---|---|---|
|Retrieved|R<sub>R</sub>|I<sub>R</sub>|
|Not Retrieved|R<sub>N</sub>|I<sub>N</sub>|

召回率(recall)：所有相关的数据中被检索到的比例
$$
recall=\frac{RR}{RR+RN}
$$

精确率(precision)：所有被检索到的中相关的数据占的比例
$$
precision = \frac{RR}{RR+IR}
$$ 