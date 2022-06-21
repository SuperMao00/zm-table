## 使用方法
1. 安装组件
    ```
    npm install --save zm-table
    ```
2. 在页面的`json`配置文件中添加`table`和`table-column`自定义组件的配置
    ```
    "usingComponents": {
        "zm-table": "zm-table/table/index",
        "zm-table-column": "zm-table/table-column/index"
    }
    ```
3. `WXML`文件中引用`table`和`table-column`
    ```
    <zm-table data="{{ tableData }}" align="center" border>
        <zm-table-column label="名字" prop="name"></zm-table-column>
        <zm-table-column type="input" input-type="number" label="年龄" prop="age"></zm-table-column>
    </zm-table>
    ```
4. `js`文件中定义
    ```
    Page({
        data: {
            tableData: [
                { name: 'sike', age: 20 },
                { name: '滑稽', age: 16 },
            ],
        }
    })
    ```

## 组件介绍
#### Table Attributes
|参数|说明|类型|必填|可选值|默认值|
|---|---|---|---|---|---|
|data|显示的数据|array|是|——|——|
|height|Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 rpx；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。|string / number|否|——|——|
|max-height|Table 的最大高度。|string / number|否|——|——|
|stripe|是否为斑马纹 table|boolean|否|——|false|
|border|是否带有纵向边框|boolean|否|——|false|
|size|Table 的尺寸|string|否|medium / small / mini|——|——|
|align|对齐方式|string|否|center / right|——|——|
|show-header|是否显示表头|boolean|否|——|true|
|empty-text|空数据时显示的文本内容，也可以通过 slot="empty" 设置|string|否|——|暂无数据|
|show-summary|是否在表尾显示合计行|boolean|否|——|false|
|sum-text|合计行第一列的文本|string|否|——|合计|
|summary-method|自定义的合计计算方法|function({ columns, data })|否|——|——|
|row-hover|点击态效果|boolean|否|——|false|
|custom-style|自定义样式|string|否|——|——|
|input-delay|当 column 的类型为 input 时的防抖时间|nuber|否|——|300|
|dataset|事件源组件上由data-开头的自定义属性组成的集合|object|否|——|——|

#### Table Events
|事件名|说明|参数(event.detail)|
|---|---|---|
|header-click|当某一列的表头被点击时会触发该事件|column, event|
|row-click|当某一行被点击时会触发该事件|row, rowIndex, cell, cellIndex, column, event|
|cell-click|当某个单元格被点击时会触发该事件|row, rowIndex, cell, cellIndex, column, event|
|row-long-press|当某一行被长按时会触发该事件|row, rowIndex, cell, cellIndex, column, event|
|cell-long-press|当某个单元格被长按时会触发该事件|row, rowIndex, cell, cellIndex, column, event|
|cell-input|当某个单元格键盘输入时会触发该事件|row, rowIndex, cell, cellIndex, column, event|
|cell-input-focus|当某个单元格输入框聚焦时触发|row, rowIndex, cell, cellIndex, column, value, event|
|cell-input-blur|当某个单元格输入框失去焦点时触发|row, rowIndex, cell, cellIndex, column, value, event|
|cell-input-confirm|当某个单元格点击完成按钮时触发|row, rowIndex, cell, cellIndex, column, value, event|
|selection-change|当选择项发生变化时会触发该事件|selection|
|click|当某个单元格按钮被点击时触发|row, rowIndex, cell, cellIndex, column, event|

#### Table Slot
|name|说明|
|---|---|
|empty|自定义空数据时显示的元素|
|append|插入至表格最后一行之后的内容，如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。若表格有合计行，该 slot 会位于合计行之上。|

#### Table-column Attributes
|参数|说明|类型|必填|可选值|默认值|
|---|---|---|---|---|---|
|type|对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 input 则显示输入框；如果设置了 textarea 则显示多行输入框|string|否|selection / index / input / textarea / button|——|
|input-type|当 type 值为 input 时，可选值参考微信小程序 input 原生支持属性|string|否|——|text|
|label|显示的标题|string|是|——|——|
|prop|对应列内容的字段名|string|是|——|——|
|width|对应列的宽度|string|否|——|——|
|min-width|对应列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度自动分配|string|否|——|——|
|disabled|当 type 值为 selection / input / textarea 时，是否禁用 |boolean|否|——|false|
|auto-height|当 type 值为 textarea 时，是否自动增高|boolean|否|——|false|
|color|当 type 值为 selection 时，checkbox的颜色，同 css 的color|string|否|——|#09BB07|
|align|对齐方式，优先级高于 table 的 align 属性|string|否|center / right|——|——|
|custom-style|自定义样式|string|否|——|——|
|button|需要渲染的按钮，按钮对象组成数组，按钮对象属性可选值参考微信小程序 button 原生支持属性，设置 triggerEvent 属性组件内部会触发对应名字的事件|array|否|——|——|