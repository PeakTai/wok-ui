# 重新渲染页面跳动问题

由于 wok-ui 是全量渲染，元素被重新创建，如果这个过程中元素的尺寸发生变化，会导致页面跳动。

下面是发生跳动的几种可能，逐个说明，并给出方案。

## 有图片元素

图片元素重新创建，会有个加载过程，这个过程中图片的尺寸会变化，导致页面跳动。

要解决这个问题有常用的两种方案：

1. 固定图片尺寸
2. 缓存图片模块

```typescript
import { FullRenderingModule, createDomModule } from 'wok-ui'

// 书藉数据
interface Book {
  id: string
  title: string
  author: string
  coverUrl: string
  content: string
}

class BookList extends FullRenderingModule {
  private books: Book[] = []

  constructor() {
    super()
    this.fetchData()
  }

  private fetchData() {
    // 从服务器获取数据后渲染，过程忽略
  }

  protected buildContent(): void {
    for (const book of this.books) {
      this.addChild({
        classNames: ['book-item'],
        children: [
          // 方案一，固定图片尺寸
          {
            classNames: ['book-item-cover'],
            style: {
              width: '240px',
              height: '135px'
            },
            tag: 'img',
            attrs: {
              src: book.coverUrl
            }
          },
          // 很多时候不方便固定图片尺寸，可以采用方案二
          // 方案二，缓存图片模块
          this.cacheModule({
            key: `book-cover-${book.id}`,
            module: () =>
              createDomModule({
                classNames: ['book-item-cover'],
                children: [
                  {
                    classNames: ['book-item-cover-image'],
                    tag: 'img',
                    attrs: {
                      src: book.coverUrl
                    }
                  }
                ]
              })
          }),
          {
            classNames: ['book-item-title'],
            innerText: book.title
          }
        ]
      })
    }
  }
}
```

## 元素有过渡效果

元素如果有过渡效果，然后重新渲染的时候，高度有个变化过程，就容易导致页面跳动。

尽可能不要对元素使用影响尺寸的过渡效果，很多时候 ai 生成的代码，常常会是这样 `transition: all 0.3s ease-in;`，
给所有元素加上这个过渡效果，开发人员自己编写代码的时候为了省事，也常常这样做。

如果遇到了页面跳闪，想找出页面上哪些元素有过渡效果，可以使用下面的脚本：

```javascript
(function () {
  const elementsWithTransition = [];

  document.querySelectorAll('*').forEach(el => {
    const style = getComputedStyle(el);
    const prop = style.transitionProperty;
    const dur = style.transitionDuration;

    // 没有过渡属性则跳过
    if (prop === 'none') return;

    // 可能有多个过渡值（如 "opacity, transform" 和 "0.2s, 0.3s"），只要有一个持续时间 > 0 即有效
    const durations = dur.split(',').map(s => s.trim());
    const hasValidDuration = durations.some(d => parseFloat(d) > 0);

    if (hasValidDuration) {
      elementsWithTransition.push(el);
    }
  });

  console.log('具有 CSS 过渡效果的元素：', elementsWithTransition);
  elementsWithTransition.forEach(el => {
    console.log(el);
    console.log('  transition:', getComputedStyle(el).transition);
  });
})();
```

## 数据重新加载导致部分子模块高度变化

子模块重新被创建和渲染，然后子模块里又有加载数据再渲染的逻辑，就容易有这样的问题。
数据没有加载成功的情况下，内容是空的，加载完成高填充了内容，这中间高度有变化。

有两个解决方法：

1. 给子模块固定高度
2. 缓存子模块

两个方法和图片重新加载导致的跳动的问题一样，这里不再给示例，可以参考图片的示例。

固定高度比较适合一些 header、footer 等固定高度的模块。

## 切换页面或内容变化较大

如果是页面切换，内容变化比较大，或者页面中的逻辑导致的内容变化比较大，如切换 tabs 页，也有可能会导致页面跳动。

这种情况，建议在模块中记录每次渲染前的位置，然后在渲染后调整回原来的位置。

对于后台管理这种，切换页面，是新的实例，菜单想保持滚动位置，就必须在本地保存菜单的位置信息，让实例间共享。


## 其它复杂情况

如果上述方案都不适用，只能设法局部渲染，只渲染变化的模块，而不是整个页面。

wok-ui 没有虚拟 dom ，没有差异化渲染，不能根据数据变化来局部渲染，
只能做全量渲染，局部渲染是会复杂一些，具体可以参考 [模块间通讯](./communication.md)，
模拟间通讯为的就是局部刷新。有些场景可能不得不做比较复杂一点的模块间通讯，实现精细的局部渲染，达到一个好的效果。
