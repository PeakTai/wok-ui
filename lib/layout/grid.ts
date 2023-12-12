import { buildSubModules, ConvertibleModule, DivModule, SubModulesOpt } from '../module';
import './grid.less';

export interface GridOpts {
  /**
   * 每行的列数. 取值 1-12 .
   */
  cols: number
  /**
   * 间隙,可分开设置列之间和行之间的间隙.
   */
  gap?: number | { col: number; row: number }
  /**
   * 单元格. 会按照设定的 cols 和 gap 进行排列.
   */
  cells: SubModulesOpt
  /**
   * 格子的最小宽度，用于防止内容变形，设置一个最小可以显示全内容的宽度。
   * 这样在空间不够的情况下，就不会显示成指定的列数了，而是将每个格子显示成最小宽度。
   */
  cellMinWidth?: number
}
/**
 * 网格.
 */
export class Grid extends DivModule {
  readonly #gap: { col: number; row: number }
  readonly #opts: GridOpts
  constructor(opts: GridOpts) {
    super('wok-ui-grid')
    this.#opts = opts
    // gap
    if (typeof opts.gap === 'number') {
      this.#gap = { col: opts.gap, row: opts.gap }
    } else if (opts.gap) {
      this.#gap = opts.gap
    } else {
      this.#gap = { col: 0, row: 0 }
    }
    if (!Number.isInteger(opts.cols)) {
      throw new Error(`cols 必须是整数,当前值: ${opts.cols}`)
    }
    if (opts.cols < 1 || opts.cols > 12) {
      throw new Error(`cols 超出范围, 有效范围是 1-12 ,当前值: ${opts.cols}`)
    }
    this.el.style.columnGap = `${this.#gap.col}px`
    this.el.style.rowGap = `${this.#gap.row}px`
    buildSubModules(opts.cells).forEach(cell => this.addCell(cell))
  }

  addCell(module: ConvertibleModule) {
    this.addChild({
      style: {
        width: `calc((100% - ${this.#gap.col * (this.#opts.cols - 1)}px) / ${this.#opts.cols})`,
        minWidth:
          this.#opts.cellMinWidth && this.#opts.cellMinWidth > 0
            ? `${this.#opts.cellMinWidth}px`
            : undefined
      },
      children: module
    })
  }
}
