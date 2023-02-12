---
title: 将阿拉伯数字转换成大写中文
categories: 技术研究
status: publish
date: 2021-12-30T22:10:00.000+08:00
tags:
  - 算法
cover: https://www.notion.so/images/page-cover/rijksmuseum_claesz_1628.jpg

---


今天同事分享了一个有意思的算法题，感觉挺有意思的。题目来自浙大PAT考试 **A1082 Read Number in Chinese**。以下是原题：

Given an integer with no more than 9 digits, you are supposed to read it in the traditional Chinese way. Output `Fu` first if it is negative. For example, -123456789 is read as `Fu yi Yi er Qian san Bai si Shi wu Wan liu Qian qi Bai ba Shi jiu`. Note: zero (`ling`) must be handled correctly according to the Chinese tradition. For example, 100800 is `yi Shi Wan ling ba Bai`

给定一个不超过9位的整数，按照汉语阅读的习惯，将其转换成对应的中文。比如输入**100800**，输出**一十万零八百**。

先试着来分析一下解题思路。首先，看到这个题目的第一反应是，我们需要提前枚举出对应的中文汉字。

```javascript
'零','一','二','三','四','五','六','七','八','九','十','百','千', '万', '亿'
```

虽然数字很大，但是上述的这些汉字已经足够覆盖所有9位数以内的场景了。从两位数的数字开始，数字对应的表达就是“个位数字”+”计数单位”的组合。比如80是八十，102是一百零二，8080是八千零八十，123456是一十二万三千四百五十六。

![](images/3b2ddbc284d3dddb.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221218T051951Z&X-Amz-Expires=3600&X-Amz-Signature=01ca81a35d5327345a8cd90e9f0b61bd84397418ef37b74a177316f6cb335f46&X-Amz-SignedHeaders=host&x-id=GetObject)

因此我们可以推测，这道题中应该与每四位一次的循环操作有关。

## 分割法

按照四位一轮转换的思路来尝试，先考虑第一种方法：从最后一位开始，每四位数字切隔一次，将数字分成小组，每个小组转换之后再反向合并起来。下面的例子实现的是加上“万”，“亿”，并不是完整代码。

```javascript
function transform(num) {
    num = num + '';

    let units = ['十', '百', '千', '万', '亿'];
    let group = [];
    
    // const transGroup = (g) => {...}

    for(let i = num.length - 1; i >= 0; i = i -4) { // 反向分割
        group.push(num.slice(Math.max(i-4, 0), i + 1));
    }

    return group.map((item, idx) => {
        // 转换每一组
        // transGroup(item);
        if (idx >= 1) { // 超过四位之后开始加上“万”、“亿”
            return item + units[idx + 2];
        }

        return item;
    }).reverse();
}

transform(4003);          => ['4003']
transform(403);           => ['403']
transform(4300);          => ['4300']
transform(103000);        => ['10万', '3000']
transform(100303000);     => ['1亿', '0030万', '3000']
transform(1303101000);    => ['13亿', '0310万', '1000']
```

到这一步其实题目已经解决一半了，接下来要做的事情就是实现四位数字的汉字转换，也就是代码中对应的`transGroup`方法。

```javascript
...
const trans = (str) => {
  let result = '';
  let len = str.length;

  for(let i = 0; i <= len - 1; i++) {
    result+= nums[str[i]]; // 数字转换
    
    if (i < len -1) {  // 最后一位是每一组的各位，之前的每一位都要加上对应的计数单位
      +result += units[len - i - 2] || '';
    }
  }
  
  return result;
}
...
```

补充了具体的函数实现后调试可以得出一下结果：

```javascript
transform(4003);          => ['四千零百零十三']
transform(403);           => ['四百零十三']
transform(4300);          => ['四千三百零十零']
transform(103000);        => ['一十零万', '三千零百零十零']
transform(100303000);     => ['一亿', '零千零百三十零万', '三千零百零十零']
transform(1303101000);    => ['一十三亿', '零千三百一十零万', '一千零百零十零']
```

可以看到，输出的结果与目标更加接近了。我们再将一些边界case处理好，就能实现数字对中文的转换。

```javascript
...
const trans = (str) => {
  let result = '';
  let len = str.length;
  let zeroFlag = false;

  for(let i = 0; i <= len - 1; i++) {
    if (parseInt(str[i], 10) === 0) { // 如果数字为0，标记0，进入下一轮循环
      zeroFlag = true;
    } else {
      if (zeroFlag) { // 如果本轮数字不为0，上轮标记为0，则转换数字，重置标记
        +result += nums[0];
        +zeroFlag = false;
      }

      result+= nums[str[i]]; // 数字转换
    
      if (i < len -1) {  // 最后一位是每一组的个位，之前的每一位都要加上对应的计数单位
        +result += units[len - i - 2] || '';
      }
    }
  }
  
  return result;
}
...
```

再看一下输出的结果

```javascript
transform(4003);          => ['四千零三']
transform(403);           => ['四百零三']
transform(4300);          => ['四千三百']
transform(103000);        => ['一十万', '三千']
transform(100303000);     => ['一亿', '零三十万', '三千']
transform(1303101000);    => ['一十三亿', '零三百一十万', '一千']
```

最后将数组输出为字符串即可。

## 双指针法

比较推荐的解法是双指针解法，网上C语言版本的实现比较多。具体实现如下：

```c
#include<iostream>
#include<string> 
#include<algorithm>
using namespace std;
/* 题意：将一个整数按照中文读法，输出其拼音 如： 输入 -123456789 输出 Fu yi Yi er Qian san Bai si Shi wu Wan liu Qian qi Bai ba Shi jiu 刚开始看是真的没思路，不晓得咋么去模拟，后面看算法笔记才晓得每个整数可以 从低位开始每四个一组（每组称为节，即个节，万节，亿节），大单位分别是"个（实际不说出来）"、 “万”、“亿”，每组内的数字又有小单位“千”、“百”、“十”、“个（实际不说出来）”。 明确了输出的规则如下： 1、如果数字的某节（例如个节，万节，亿节） 中，某个非零位（千位除外）的高位是零，那么在 需要在该非零位的发音前额外输出一个零。例如8080（ba qian ling ba shi）、8008（ba qian ling ba） 、10808（yi wan ling ba bai ling ba） 2、每节的末尾需要输出万或者亿（个节除外） 注意： 需要注意特判输入是0的时候直接输出ling */
string num[10]={"ling", "yi", "er", "san", "si", "wu", "liu", "qi", "ba", "jiu"};
string wei[3]={"Shi","Bai","Qian"};
string jie[2]={"Wan","Yi"}; 
int main(){
	string str;
	cin>>str;
	int len=str.size();
	int left=0,right=len-1;
	if(str[left]=='-'){
		printf("Fu");
		left++;	
	}
	//前导零 
	while(str[left]=='0'&&left<len){
		left++;
	} 
	//特判输入是0的情况 
	if(left==len){
		cout<<"ling"<<endl;
		return 0;	
	}
	while(left+4<=right){//将left和right分别指向第一节的最高位和最低位 
		right-=4;
	}
	
	while(left<len){//依次判断每一节中（四位或者小于四位）
		bool isZero=false,isPrint=false;//isZero==false表示没有零 ，isPrint表示该节没有输出过其他的位（则相应不需要输出Wan或者Yi） 
		while(left<=right){//遍历每一节中的每一位 
			if(str[left]=='0') isZero=true;
			else{//当前位不为0 
				if(isZero){//高位存在0 
				cout<<" ling";
				isZero=false;
			} 
			if(left>0)cout<<" ";//只要不是首位，后面每一位输出之前都要输出空格
			cout<<num[str[left]-'0'];//输出当前位的数字
			isPrint=true;//说明本节至少输出过一位 
			if(left!=right){
				//除本节的个位以外，都需要输出十百千 
				cout<<" "<<wei[right-left-1]; 
			}	 
			}
			left++;
		}
		if(isPrint&&right!=len-1){//只要不是个节，则相应输出Wan或者Yi 
			cout<<" "<<jie[(len-1-right)/4-1]; 
		} 
		right+=4;//输出下一节 
	} 

	return 0;
}
```

按照这个思路，我用JavaScript也实现了一遍。

```javascript
function transform(num) {
    let nums = ['零','一','二','三','四','五','六','七','八','九']
    let units = ['十','百','千', '万', '亿'];
    let result = '';

    num = (num + '');
    let len = num.length;
    let left = 0;
    let right = len - 1;

    if (num[0] === '-1') {
        result += '负';
        left++;
    }
    while (left + 4 <= right) {
        right -= 4;
    }

    while (left < len) {
        let zeroFlag = false;
        let isPrint = false;

        while(left <= right) {
            if (left > 0 && num[left] == 0) { // 遇到0时，设置zeroFlag 为true，指针往后移动一位
                zeroFlag = true;
            } else {
                if (zeroFlag) {
                    result += nums[0]; //补零
                    zeroFlag = false;
                }

                result += nums[num[left]];

                isPrint = true; // 每一组中存在至少一个不为0的数字

                if (left !== right) { // 补充每一位的单位
                    result += units[right - left - 1];
                }
            }

            left++;
        }

        // 一轮结束时，如果存在至少一个不为0的数字 添加单位
        if (isPrint && right !== len -1) {
            result += units[(len - 1 - right) / 4 + 2]; 
        }

        right += 4;
    }

    console.log('result: ', result);
    return 0;
}

// 4003 四千零三
// 403 四百零三
// 4300 四千三百
// 103000 十万零三千
// 100303000 一亿零三十万三千
// 1303101000 十三亿零三百一十万一千

transform(4003);
transform(403);
transform(4300);
transform(103000);
transform(100303000);
transform(1303101000);
```

## 一行实现

同事何米酥甚至用一行代码就搞定了

```javascript
const trans = (str) => String(str).split(/(?=(?:\d{4})+(?!\d))/g).map((chunk, i, chunkArr) => chunk.split('').reduce(([flag, isPrint, print], c, ii, singleArr) => [!!i && (c === '0'), !!(isPrint || (c - '0')), c === '0' ? print : print + (flag ? '零' : '') + ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'][c] + ['', '十', '百', '千'][singleArr.length - 1 - ii]], [false, false, ''])[2] + (i !== chunkArr.length - 1 ? ['千', '万', '亿'][chunkArr.length - 1 - i] : '')).join('')
```

## 结束语

这个题目的关键在于找到数字转换的规律，按照四位一组的方式处理。
