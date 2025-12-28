type Observer = {
  id: number
  onDataUpdate: () => void
}

type QueryOptions = {
  queryFn?: () => Promise<object>
  staleTime?: number // デフォルト 0
  gcTime?: number // デフォルト 5min
}

const DEFAULT_GC_TIME = 5 * 60 * 1000

// Query の挙動を雰囲気でコードに起こしてみたもの
export class Query {
  data: object | null = null
  status: 'pending' | 'success' | 'error' = 'pending'

  // キャッシュ管理
  lastUpdated: number = 0
  observers: Observer[] = []

  // GC 管理
  gcTime: number = 0
  gcTimeout: ReturnType<typeof setTimeout> | null = null

  // 重複排除用
  promise: Promise<object> | null = null
  queryFn: (() => Promise<object>) | null = null

  constructor(options: QueryOptions) {
    this.queryFn = options.queryFn || null
  }

  private updateGcTime(newGcTime: number | undefined) {
    const time = newGcTime ?? DEFAULT_GC_TIME
    this.gcTime = Math.max(this.gcTime, time)
  }

  // 宣言的
  subscribe(observer: Observer, options: QueryOptions) {
    this.observers.push(observer)
    this.updateGcTime(options.gcTime) // fetch の有無に関わらず gcTime 更新

    if (this.gcTimeout) {
      clearTimeout(this.gcTimeout) // 既存の GC タイマーを停止
      this.gcTimeout = null
    }

    void this.checkStaleAndFetch('mount', options.staleTime)
    return () => this.unsubscribe(observer)
  }

  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter((o) => o !== observer)
    if (this.observers.length === 0) {
      this.gcTimeout = setTimeout(() => this.gc(), this.gcTime)
    }
  }

  // 命令的
  async fetchQuery(options: QueryOptions) {
    this.queryFn = options.queryFn ?? this.queryFn
    const isStale = this.isStale(options.staleTime)
    if (this.data && !isStale) return this.data
    this.updateGcTime(options.gcTime) // fetch が発生したら gcTime 更新
    return this.fetch()
  }

  async fetch() {
    if (!this.queryFn) return
    if (this.promise) return this.promise // 重複排除

    this.promise = (async () => {
      try {
        this.data = await this.queryFn!()
        this.lastUpdated = Date.now()
        this.status = 'success'
        this.notifyObservers()
        return this.data
      } finally {
        this.promise = null
      }
    })()

    return this.promise
  }

  isStale(staleTime: number | undefined): boolean {
    if (!this.data) return true // データがない場合も stale
    return Date.now() - this.lastUpdated > (staleTime ?? 0)
  }

  async checkStaleAndFetch(reason: string, staleTime: number | undefined) {
    console.log(`[${reason}] checkStaleAndFetch`)
    if (this.isStale(staleTime)) {
      // 実際のライブラリではここで deduplication が効くので、fetch は 1 回しか走らない
      await this.fetch()
    }
  }

  gc() {
    this.data = null
    this.status = 'pending'
    this.lastUpdated = 0
    this.gcTime = 0
  }

  notifyObservers() {
    this.observers.forEach((o) => o.onDataUpdate())
  }
}
