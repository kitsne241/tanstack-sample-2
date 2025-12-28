type Observer = { id: number }
type Options = {
  queryFn: () => Promise<object>
  staleTime?: number
  gcTime?: number
}

export class Query {
  data: object | null = null
  queryFn: () => Promise<object>
  gcTime: number
  observers: Observer[] = []

  lastUpdated: number = 0 // キャッシュ管理
  gcTimeout: number | undefined = undefined // ガベージコレクション関数の ID
  promise: Promise<void> | null = null // fetch 関数

  constructor(options: Options) {
    this.queryFn = options.queryFn
    this.gcTime = options.gcTime ?? 0
  }

  // useQuery された
  subscribe(observer: Observer, options: Options) {
    this.observers.push(observer)
    clearTimeout(this.gcTimeout)
    this.gcTimeout = undefined
    void this.checkStaleAndFetch(options)
    return () => this.unsubscribe(observer)
  }

  // Observer のアンマウント
  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter((o) => o !== observer)
    if (this.observers.length === 0) {
      this.gcTimeout = setTimeout(() => {
        this.data = null
        this.gcTime = 0 // gcTime リセット
      }, this.gcTime)
    }
  }

  // フェッチ実行
  async fetch() {
    if (this.promise) return this.promise
    this.promise = (async () => {
      try {
        this.data = await this.queryFn()
        this.lastUpdated = Date.now()
      } finally {
        this.promise = null
      }
    })()
    return this.promise
  }

  // 状態チェックとフェッチのトリガー
  async checkStaleAndFetch(options: Options) {
    const isStale = Date.now() - this.lastUpdated > (options.staleTime ?? 0)
    if (this.data && !isStale) return // 新しければ何もしない
    this.gcTime = Math.max(this.gcTime, options.gcTime ?? 0)
    // fetch 直前に gcTime をより大きな値に更新するという副作用を伴う
    await this.fetch()
  }

  // Stale なら取り直す
  async fetchQuery(options: Options) {
    await this.checkStaleAndFetch(options)
    return this.data
  }

  // あれば古くても返す
  async ensureQueryData(options: Options) {
    if (this.data) return this.data
    return this.fetchQuery(options)
  }
}
