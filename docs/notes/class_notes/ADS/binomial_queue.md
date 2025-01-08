---
comments: true
---

# Binomial Queue

- 每棵树都是最小堆
- 高度为$K$的二项树恰好有$2^K$个结点,且在深度$d$处的结点数恰好就是二项系数$\tbinom{K}{d}$

插入时间复杂度最坏是$O(\log{n})$,但是从空开始建堆的时间复杂度是$O(1)$;

其他操作时间复杂度是$O(\log{n})$

## 代码分析

```c
BinQueue  Merge( BinQueue H1, BinQueue H2 )
{	BinTree T1, T2, Carry = NULL; 	
	int i, j;
	if ( H1->CurrentSize + H2-> CurrentSize > Capacity ) ErrorMessage();
	H1->CurrentSize += H2-> CurrentSize;
	for ( i=0, j=1; j<= H1->CurrentSize; i++, j*=2 ) {
	    T1 = H1->TheTrees[i]; T2 = H2->TheTrees[i]; /*current trees */
	    switch( 4*!!Carry + 2*!!T2 + !!T1 ) { 
		case 0: /* 000 */
	 	case 1: /* 001 */  break;	
		case 2: /* 010 */  H1->TheTrees[i] = T2; H2->TheTrees[i] = NULL; break;
		case 4: /* 100 */  H1->TheTrees[i] = Carry; Carry = NULL; break;
		case 3: /* 011 */  Carry = CombineTrees( T1, T2 );
			            H1->TheTrees[i] = H2->TheTrees[i] = NULL; break;
		case 5: /* 101 */  Carry = CombineTrees( T1, Carry );
			            H1->TheTrees[i] = NULL; break;
		case 6: /* 110 */  Carry = CombineTrees( T2, Carry );
			            H2->TheTrees[i] = NULL; break;
		case 7: /* 111 */  H1->TheTrees[i] = Carry; 
			            Carry = CombineTrees( T1, T2 ); 
			            H2->TheTrees[i] = NULL; break;
	    } /* end switch */
	} /* end for-loop */
	return H1;
}
```

首先注意```switch```语句中的条件```4*!!carry + 2*!!T2 + !!T1```,实际上就是为了把不是0或1的数字bool化.例如如果$T_1$存在（即第一个堆对应高度为$i$的二项树存在,则$ !!T_1$ 做了两次取非操作后就变成1,否则就是0,$T_2$和进位$carry$也是同理.

那么我们可以理解```4*!!carry + 2*!!T2 + !!T1```的含义了,实际上这就是一个三位二进制数,最高位表示是否有$carry$,即之前的合并是否带来了进位(合并出新的更高的二项树),第二位代表第二个堆$H_2$是否有高度为$i$的二项树,最后一位代表是否有高度为$i$的二项树.于是就可以与$case$一一对应了.

1. 000:什么都不做,只要循环结束后结束合并就可以了;
2. 001:同上;
3. 010:因为我们最重要返回$H_1$(即$H_1$是合并后的结果),清空$H_2$,因此此时我们只要把$H_2$的树转移到$H_1$,然后把$H_2$对应位置改为NULL,最后等待循环结束后结束合并即可;
4. 011:从加法操作来看此时没有进位,但会产生进位,当前位需要置0,对应于堆操作就是$H_1$和$H_2$当前位变为NULL,进位等于两个堆该高度的二项树合并后的结果;
5. 100:类似于010的情况,但此时是把$carry$接到$H_1$上,然后等待循环结束后结束合并即可;
6. 101:从加法操作来看此时会产生进位,当前位需要置0,因此堆操作就是$H_1$当前位变为NULL,新的$carry$等于$T_1$和当前的$carry$合并的结果;
7. 110:与101类似,只是$H_2$当前位变成NULL,新的$cary$等于$T_2$和当前的$carry$合并的结果;
8. 111:此时是$1 + 1$还要加上进位$1$,因此求和后有新的进位,当前位也是1,因此让$H_1$当前位变成$carry$,新的$carry$等于$T_1$和$T_2$合并的结果,最后给$H_2$当前位变为NULL即可
