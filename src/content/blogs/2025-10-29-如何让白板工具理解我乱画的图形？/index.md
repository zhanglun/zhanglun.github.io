---
title: 如何让白板工具理解我乱画的图形？
categories:
  - 技术研究
date: 2025-10-29T16:00:00.000+08:00
tags:
  - JavaScrtipt
  - 笔记
  - 算法
draft: false
---

最近我在做一个白板工具，其中要增加那个"智能画笔"功能：用户随便画个歪歪扭扭的图形，工具会自动把它变成标准的形状。现在有阶段性成果了，想记录下这个功能背后的实现原理和我的思考，希望能给有兴趣的朋友一些启发。


## 如何"理解"用户的意图？


首先，我们得明白一个核心问题：**怎么知道用户想画什么？**


想象一下，你看到一个朋友在纸上画了一个歪歪扭扭的圆圈，你为什么能认出那是一个圆圈？因为你大脑里已经对圆圈有了一个概念：闭合的、大致 round 的形状。同样，我们要让程序具备类似的"概念"。


所以，我的思路是：

1. **记录**用户画图的轨迹
2. **分析**这些轨迹的特征
3. **匹配**到已知的形状概念
4. **生成**一个完美的标准形状

下面，我就一步步拆解这个流程。


## 记录轨迹：不只是记录，还要聪明地记录


当用户按下鼠标开始画图，我们会收到大量的鼠标移动事件。如果每个点都记录，数据量会很大，而且很多点都是多余的。比如，你画一条直线，其实只需要起点和终点就够了。


所以，我设计了一个"采样"机制：只记录关键点。


```javascript
class PointCollector {
    constructor() {
        this.points = [];
        this.samplingRate = 5; // 每5个像素记录一个点
    }

    addPoint(x, y) {
        // 如果是第一个点，或者距离上一个点足够远，才记录
        if (this.points.length === 0 || this.isFarEnough(x, y)) {
            this.points.push({x, y});
        }
    }

    isFarEnough(x, y) {
        const lastPoint = this.points[this.points.length - 1];
        const dx = x - lastPoint.x;
        const dy = y - lastPoint.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        return distance >= this.samplingRate;
    }
}
```


这样做的好处是：

- 减少数据量，提高性能
- 避免记录太多密集点导致形状识别困难
- 同时保留足够的信息来还原图形

## 数据预处理：从原始点到特征点


### 均匀采样（基础方法）


上面提到的按距离采样是最简单直接的方法，适合实时处理。


### Douglas-Peucker 算法（高级方法）


对于更精细的图形处理，我们可以使用 Douglas-Peucker 算法。这个算法能够智能地保留形状的关键特征点，而不是简单地按距离采样。


```javascript
function douglasPeucker(points, epsilon) {
    if (points.length <= 2) {
        return points;
    }

    // 找到离起点和终点连线最远的点
    let maxDistance = 0;
    let maxIndex = 0;
    const start = points[0];
    const end = points[points.length - 1];

    for (let i = 1; i < points.length - 1; i++) {
        const distance = perpendicularDistance(points[i], start, end);
        if (distance > maxDistance) {
            maxDistance = distance;
            maxIndex = i;
        }
    }

    // 如果最远点的距离大于阈值，递归处理
    if (maxDistance > epsilon) {
        const leftSegment = douglasPeucker(points.slice(0, maxIndex + 1), epsilon);
        const rightSegment = douglasPeucker(points.slice(maxIndex), epsilon);

        // 合并结果，注意去掉重复的中间点
        return leftSegment.slice(0, -1).concat(rightSegment);
    } else {
        // 否则只保留起点和终点
        return [start, end];
    }
}

function perpendicularDistance(point, lineStart, lineEnd) {
    // 计算点到直线的垂直距离
    const area = Math.abs(
        (lineEnd.x - lineStart.x) * (point.y - lineStart.y) -
        (point.x - lineStart.x) * (lineEnd.y - lineStart.y)
    );
    const lineLength = Math.sqrt(
        (lineEnd.x - lineStart.x) ** 2 + (lineEnd.y - lineStart.y) ** 2
    );
    return area / lineLength;
}
```


**两种方法的对比：**

- **均匀采样**：实时性好，实现简单，适合绘制过程中的初步处理
- **Douglas-Peucker**：结果更精确，能保留关键特征点，适合绘制结束后的精细处理

在实践中，我结合了两种方法：实时绘制时用均匀采样，绘制结束后再用 Douglas-Peucker 进行精细简化。


## 清洗数据：让图形更"光滑"


即使用户想画直线，手抖也会导致线条不直。所以我们需要对采集到的点进行平滑处理。


我使用了一个简单但有效的方法：移动平均滤波。就像Photoshop里的模糊滤镜，让线条更平滑。


```javascript
function smoothPoints(points, windowSize = 3) {
    const smoothed = [];
    for (let i = 0; i < points.length; i++) {
        let sumX = 0, sumY = 0;
        let count = 0;
        // 取当前点前后各windowSize个点，计算平均值
        for (let j = i - windowSize; j <= i + windowSize; j++) {
            if (j >= 0 && j < points.length) {
                sumX += points[j].x;
                sumY += points[j].y;
                count++;
            }
        }
        smoothed.push({ x: sumX / count, y: sumY / count });
    }
    return smoothed;
}
```


## 提取特征：图形的"DNA"


现在进入最有趣的部分：电脑怎么"猜"我想画什么？这是整个系统最核心也最有趣的地方。我们有了干净的点数据，接下来就是提取特征。这些特征就像图形的DNA，能告诉电脑这个图形是什么形状。


我提取了以下几类特征：


### 1. 基础几何特征

- **边界框**：能包围这个图形的最小矩形
- **面积**：图形的大小
- **周长**：图形边界的总长度

### 2. 形状特征

- **圆形度**：衡量图形接近圆形的程度
- **矩形度**：衡量图形接近矩形的程度
- **线性度**：衡量图形接近直线的程度

### 3. 结构特征

- **角点数量**：图形有多少个明显的拐角

这里我重点讲一下圆形度和矩形度的计算，因为这两个特征非常关键。


**圆形度**的计算公式是：`4π * 面积 / 周长²`。为什么这样算？因为对于圆形，这个值等于1；其他形状都小于1。所以，这个值越接近1，图形就越圆。


```javascript
function getCircularity(area, perimeter) {
    if (perimeter === 0) return 0;
    return (4 * Math.PI * area) / (perimeter * perimeter);
}
```


还可以用扇区分析法，将圆形分成8个扇区（像切披萨一样），然后检查每个扇区是否有足够的点：


```javascript
function checkCircularSectors(points, center, radius) {
    const sectorCounts = [0, 0, 0, 0, 0, 0, 0, 0]; // 8个扇区

    for (const point of points) {
        const angle = Math.atan2(point.y - center.y, point.x - center.x);
        const sectorIndex = Math.floor((angle + Math.PI) / (Math.PI / 4)) % 8;
        sectorCounts[sectorIndex]++;
    }

    // 检查是否每个扇区都有足够的点
    const minPoints = points.length / 12; // 至少要有1/12的点在每个扇区
    let emptySectors = 0;
    for (const count of sectorCounts) {
        if (count < minPoints) emptySectors++;
    }

    return emptySectors <= 2; // 允许最多2个空扇区
}
```


而椭圆和圆形很像，关键区别：**长宽比**。


```javascript
function distinguishCircleFromEllipse(bbox) {
    const aspectRatio = bbox.width / bbox.height;

    if (aspectRatio > 1.2 || aspectRatio < 0.8) {
        return 'ellipse'; // 明显不是1:1
    } else {
        return 'circle'; // 接近1:1
    }
}
```


**矩形度**的计算公式是：`图形面积 / 边界框面积`。完美矩形的矩形度为1，其他形状都小于1。


```javascript
getRectangularity(points, bbox) {
    const bboxArea = bbox.width * bbox.height;
    if (bboxArea === 0) return 0;
    return this.getArea(points) / bboxArea;
}
```

> 面积的计算需要用到鞋带算法。  
> 鞋带算法，也称为高斯面积公式，是**一种数学算法，用于计算平面上简单多边形（非自交）的面积。**计算过程中，需要将多边形顶点的坐标按顺序排列后进行交叉相乘，这个过程看起来就像系鞋带一样。

```javascript
function calculatePolygonArea(points) {
    let area = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        area += points[i].x * points[j].y;
        area -= points[j].x * points[i].y;
    }

    return Math.abs(area) / 2;
}
```


**角点检测**稍微复杂一点。通过计算连续三个点形成的角度变化来判断是否是角点。如果角度变化超过45度，我就认为这里有一个角点。


```javascript
getCornerCount(points) {
    let cornerCount = 0;
    for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i-1];
        const curr = points[i];
        const next = points[i+1];
        // 计算向量
        const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
        const v2 = { x: next.x - curr.x, y: next.y - curr.y };
        // 计算角度
        const angle1 = Math.atan2(v1.y, v1.x);
        const angle2 = Math.atan2(v2.y, v2.x);
        let angleDiff = Math.abs(angle2 - angle1);
        // 处理角度环绕
        if (angleDiff > Math.PI) {
            angleDiff = 2 * Math.PI - angleDiff;
        }
        // 如果角度变化大于45度，认为是角点
        if (angleDiff > Math.PI / 4) {
            cornerCount++;
        }
    }
    return cornerCount;
}
```


## 形状识别


现在我知道了每个形状应该有什么特征：

- **圆形**：高圆形度 + 少角点 + 长宽接近1:1
- **椭圆**：中等圆形度 + 扇区均匀 + 长宽比≠1
- **矩形**：高矩形度 + 大约4个角点
- **直线**：高线性度 + 很少角点
- **三角形**：大约3个角点

这就像我脑子里有个数据库：

- 看到又圆又光滑的 → 可能是圆形
- 看到有点椭圆但均匀的 → 可能是椭圆
- 看到方方正正的 → 可能是矩形
- 看到直直的 → 可能是直线
- 看到三个尖角的 → 可能是三角形

有了特征，接下来就是识别形状。我采用了规则匹配的方法，因为这种方法简单直接，而且对于基本形状效果很好。我的思路是：为每种形状设定一些规则，如果图形的特征符合这些规则，就认为它是这种形状。


```javascript
class ShapeRecognizer {
    recognize(features) {
        // 按顺序检查每种形状
        const candidates = [
            { type: 'line', confidence: this.getLineConfidence(features) },
            { type: 'circle', confidence: this.getCircleConfidence(features) },
            { type: 'ellipse', confidence: this.getEllipseConfidence(features) },
            { type: 'rectangle', confidence: this.getRectConfidence(features) },
            { type: 'triangle', confidence: this.getTriangleConfidence(features) }
        ];

        // 找出置信度最高的形状
        let bestMatch = { type: 'freehand', confidence: 0 };
        for (const candidate of candidates) {
            if (candidate.confidence > bestMatch.confidence) {
                bestMatch = candidate;
            }
        }

        return bestMatch;
    }

    getLineConfidence(features) {
        // 直线应该具有高线性度和很少的角点
        const linearityScore = features.linearity;
        const cornerScore = 1 - Math.min(features.cornerCount / 10, 1);
        return linearityScore * 0.7 + cornerScore * 0.3;
    }

    getCircleConfidence(features) {
        // 圆形应该具有高圆形度和接近1的长宽比
        const circularityScore = features.circularity;
        const aspectScore = 1 - Math.min(Math.abs(1 - features.aspectRatio), 1);
        return circularityScore * 0.6 + aspectScore * 0.4;
    }

    getEllipseConfidence(features) {
        // 椭圆应该具有中等圆形度和不均匀的长宽比
        const circularityScore = Math.min(features.circularity * 1.2, 1);
        const aspectScore = 1 - Math.min(Math.abs(1.5 - features.aspectRatio) / 2, 1);
        return circularityScore * 0.5 + aspectScore * 0.5;
    }

    getRectConfidence(features) {
        // 矩形应该具有高矩形度和大约4个角点
        const rectangularityScore = features.rectangularity;
        const cornerScore = Math.min(features.cornerCount / 4, 1);
        return rectangularityScore * 0.6 + cornerScore * 0.4;
    }

    getTriangleConfidence(features) {
        // 三角形应该有大约3个角点
        const cornerScore = Math.min(features.cornerCount / 3, 1);
        return cornerScore;
    }
}
```


这里我不仅判断形状类型，还计算了一个"置信度"，表示我对这个判断有多大把握。

- 置信度 > 0.8：很有把握，自动转换
- 置信度 0.6-0.8：有点把握，可以问用户要不要转换
- 置信度 < 0.6：没啥把握，保持原样

## 形状拟合：从"像"到"是"


识别出用户想画什么形状后，接下来就是画出完美的标准形状。


### 直线拟合


即使用户画的是歪歪扭扭的线，我们也要找到最合适的直线。我使用了最小二乘法，这是一种数学优化技术，可以找到一条直线，使得所有点到这条直线的距离的平方和最小。


```javascript
class LineFitter {
    fit(points) {
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        const n = points.length;

        for (const point of points) {
            sumX += point.x;
            sumY += point.y;
            sumXY += point.x * point.y;
            sumXX += point.x * point.x;
        }

        // 计算斜率和截距
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // 用起点和终点的x坐标来确定直线的端点
        const startX = points[0].x;
        const endX = points[points.length - 1].x;

        return {
            start: { x: startX, y: slope * startX + intercept },
            end: { x: endX, y: slope * endX + intercept }
        };
    }
}
```


### 圆形拟合：最小二乘法的精确应用


对于圆形，我使用了最小二乘法来找到最佳拟合圆，这种方法比简单的边界框方法更精确。

> 最小二乘法拟合圆形原理
>
> 圆形的一般方程为：`(x - a)² + (y - b)² = r²`
>
>
> 展开后得到：`x² + y² - 2ax - 2by + (a² + b² - r²) = 0`
>
>
> 为了便于计算，我们使用代换：
>
> - `A = -2a`
> - `B = -2b`
> - `C = a² + b² - r²`
>
> 得到：`x² + y² + Ax + By + C = 0`
>
>
> 通过最小二乘法求解A、B、C的最优值，然后还原出圆心(a,b)和半径r。
>
>

```javascript
class CircleFitter {
    fit(points) {
        let sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0, sumX3 = 0, sumY3 = 0;
        let sumXY = 0, sumX2Y = 0, sumXY2 = 0;
        const n = points.length;

        for (const point of points) {
            const x = point.x, y = point.y;
            const x2 = x * x, y2 = y * y;

            sumX += x;
            sumY += y;
            sumX2 += x2;
            sumY2 += y2;
            sumX3 += x2 * x;
            sumY3 += y2 * y;
            sumXY += x * y;
            sumX2Y += x2 * y;
            sumXY2 += x * y2;
        }

        // 解方程组求圆心和半径
        const A = n * sumX2 - sumX * sumX;
        const B = n * sumXY - sumX * sumY;
        const C = n * sumX3 + n * sumXY2 - (sumX2 + sumY2) * sumX;
        const D = n * sumY2 - sumY * sumY;
        const E = n * sumX2Y + n * sumY3 - (sumX2 + sumY2) * sumY;

        const denominator = A * D - B * B;
        const centerX = (C * D - E * B) / denominator;
        const centerY = (A * E - C * B) / denominator;

        // 计算平均半径
        let totalDistance = 0;
        for (const point of points) {
            totalDistance += Math.sqrt((point.x - centerX) ** 2 + (point.y - centerY) ** 2);
        }
        const radius = totalDistance / n;

        return { center: { x: centerX, y: centerY }, radius };
    }
}
```


### 椭圆拟合


椭圆拟合比圆形复杂，需要考虑长轴、短轴和旋转角度。这里使用简化的边界框方法：


```javascript
class EllipseFitter {
    fit(points) {
        const bbox = this.getBoundingBox(points);
        const center = {
            x: bbox.x + bbox.width / 2,
            y: bbox.y + bbox.height / 2
        };

        return {
            center: center,
            majorAxis: bbox.width / 2,
            minorAxis: bbox.height / 2,
            rotation: 0 // 简化为不旋转的椭圆
        };
    }
}
```


### 矩形拟合


矩形拟合很简单，直接使用边界框作为矩形。


```javascript
class RectangleFitter {
    fit(points) {
        const bbox = this.getBoundingBox(points);
        return {
            x: bbox.x,
            y: bbox.y,
            width: bbox.width,
            height: bbox.height
        };
    }
}
```


### 三角形拟合


三角形拟合的关键是找到三个最佳顶点：


```javascript
class TriangleFitter {
    fit(points) {
        const corners = this.findMainCorners(points);

        if (corners.length >= 3) {
            // 取最重要的三个角点
            return {
                vertex1: corners[0],
                vertex2: corners[1],
                vertex3: corners[2]
            };
        } else {
            // 如果没有明显角点，用边界框近似
            const bbox = this.getBoundingBox(points);
            return {
                vertex1: { x: bbox.x + bbox.width / 2, y: bbox.y },
                vertex2: { x: bbox.x, y: bbox.y + bbox.height },
                vertex3: { x: bbox.x + bbox.width, y: bbox.y + bbox.height }
            };
        }
    }
}
```


## 把所有的组合在一起


现在，我们把所有的组件组合起来，形成一个完整的智能画笔。


```javascript
class SmartBrush {
    constructor() {
        this.pointCollector = new PointCollector();
        this.featureExtractor = new FeatureExtractor();
        this.recognizer = new ShapeRecognizer();
        this.fitters = {
            line: new LineFitter(),
            circle: new CircleFitter(),
            ellipse: new EllipseFitter(),
            rectangle: new RectangleFitter(),
            triangle: new TriangleFitter()
        };
        this.isSmartMode = false;
        this.longPressTimer = null;
    }

    startDrawing(x, y) {
        this.pointCollector.points = [];
        this.pointCollector.addPoint(x, y);

        // 开始长按计时
        this.longPressTimer = setTimeout(() => {
            this.activateSmartPreview();
        }, 2000); // 2秒后激活智能预览
    }

    moveDrawing(x, y) {
        this.pointCollector.addPoint(x, y);

        // 如果移动距离较大，取消长按计时
        if (this.longPressTimer && this.pointCollector.points.length > 5) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
            this.deactivateSmartPreview();
        }

        // 实时绘制预览
        this.drawPreview();
    }

    endDrawing() {
        // 清除长按计时器
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }

        // 1. 平滑处理
        const points = smoothPoints(this.pointCollector.points);

        // 2. 精细简化（可选）
        const simplifiedPoints = douglasPeucker(points, 2.0);

        // 3. 如果处于智能模式，拟合标准形状
        if (this.isSmartMode) {
            const features = this.featureExtractor.extractFeatures(simplifiedPoints);
            const recognition = this.recognizer.recognize(features);

            if (recognition.confidence > 0.7) {
                const fittedShape = this.fitters[recognition.type].fit(simplifiedPoints);
                this.drawFinalShape(fittedShape);
            } else {
                this.drawFreehand(points);
            }

            this.deactivateSmartPreview();
        } else {
            // 否则，保持手绘
            this.drawFreehand(points);
        }
    }

    activateSmartPreview() {
        this.isSmartMode = true;
        const points = smoothPoints(this.pointCollector.points);
        const simplifiedPoints = douglasPeucker(points, 2.0);
        const features = this.featureExtractor.extractFeatures(simplifiedPoints);
        const recognition = this.recognizer.recognize(features);

        if (recognition.confidence > 0.6) {
            const fittedShape = this.fitters[recognition.type].fit(simplifiedPoints);
            this.drawSmartPreview(fittedShape); // 绘制半透明的智能图形
        }
    }

    deactivateSmartPreview() {
        this.isSmartMode = false;
        this.clearSmartPreview();
    }
}
```


## 项目中的拓展：智能交互体验


在我的项目中，我还增加了更智能的交互体验：

1. **用户绘制时，与普通画笔无异** - 保持自然的绘制体验
2. **如果长按2秒，出现半透明的智能绘制图形** - 给用户预览机会
3. **此时，用户松开鼠标（结束绘制），用智能绘制的图形替换手绘内容** - 确认转换
4. **如果继续绘制，则不显示智能绘制图形，直到再次长按** - 不干扰正常绘制

这种设计的核心思想是：**智能辅助不应该干扰创作流程，而是在用户需要时提供帮助**。


## 遇到的挑战和解决方案


在实现过程中，我遇到了几个挑战：

1. **识别准确性**：有时候图形介于两种形状之间，比如又像矩形又像圆形。我通过调整权重和阈值来解决这个问题。
2. **性能问题**：在低性能设备上，实时识别可能会导致卡顿。我通过减少采样率和简化特征计算来优化性能。
3. **用户体验**：有时候智能画笔会"自作聪明"，把用户不想转换的图形也转换了。我增加了设置选项，让用户调整识别灵敏度，并提供了撤销功能。

## 总结：智能画笔实现的关键要点


回顾整个智能画笔的实现过程，有几个关键的技术要点值得总结：


### 数据采集与预处理

1. **点采样**：使用均匀采样减少数据量，平衡实时性和准确性
2. **Douglas-Peucker算法**：用于后期精细简化，保留关键特征点
3. **数据平滑**：通过移动平均滤波去除手部抖动，让线条更流畅

### 特征提取与识别

1. **几何特征计算**：包括边界框、面积（鞋带算法）、周长等基础特征
2. **形状特征分析**：圆形度、矩形度、线性度等高级特征
3. **扇区分析法**：用于区分圆形和椭圆，检查点分布的均匀性
4. **角点检测**：通过角度变化识别图形的关键转折点
5. **置信度系统**：不是简单的二元判断，而是给出把握程度

### 形状拟合与生成

1. **最小二乘法**：用于直线和圆形的精确拟合
2. **边界框拟合**：用于矩形和椭圆的简化拟合
3. **角点连接**：用于三角形等多边形的拟合

### 用户体验设计

1. **智能交互模式**：长按触发预览，不干扰正常绘制
2. **实时反馈**：在绘制过程中提供形状预测
3. **可配置性**：允许用户调整识别灵敏度和行为

### 性能优化

1. **分层处理**：实时使用简单算法，后期使用复杂算法
2. **增量计算**：在绘制过程中逐步更新特征
3. **算法选择**：根据设备性能选择合适的算法复杂度

### 核心算法回顾

- **鞋带算法**：计算多边形面积的基础
- **最小二乘法**：精确拟合直线和圆形的关键
- **Douglas-Peucker**：曲线简化的高级技术
- **移动平均滤波**：数据平滑的实用方法
- **扇区分析**：圆形识别的创新方法

## 进一步优化的想法


虽然现在的智能画笔已经很好用了，但还有改进空间：

1. **机器学习**：可以使用机器学习模型来替代规则匹配，提高识别准确率。通过收集用户的绘制数据，训练一个深度学习模型，能够识别更复杂的形状和手势。
2. **更多形状**：可以增加对箭头、星形、流程图符号等更多形状的支持。每种新形状都需要定义其特征和拟合算法。
3. **手势识别**：可以识别用户的手势，比如画一个叉表示删除，画一个勾表示确认。这需要分析绘制轨迹的动态特征。
4. **自适应学习**：系统可以学习单个用户的绘制习惯，逐渐优化识别算法，提供更个性化的体验。
5. **实时协作**：在多人协作场景中，智能画笔可以同步识别结果，确保所有参与者看到相同的标准图形。
