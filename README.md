[PrimeVue](https://primevue.org/vite)

```sh
pnpm add primevue @primeuix/themes primeicons
pnpm add tailwindcss @tailwindcss/vite
pnpm add @tanstack/vue-query
```

---

## TanStack Query 挙動メモ

```ts
// DataViewer.vue の useQuery
staleTime: 未設定,
gcTime: 未設定,
```

とりあえず何も設定しない（undefined）
- 最後の Observers を削除した直後に値を見ても isLoading → Error
- staleTime のデフォルト値が 0 なので、おそらく DataViewer 自身のアクセスで常に再取得が発生している

```ts
// DataViewer.vue の useQuery
staleTime: Infinity,
gcTime: 未設定,
```

staleTime を Infinity にして DataViewer 自身が再取得をしないようにした
- 最後に追加した useQuery の gcTime が経過した後にデータを確かめてもまだ残っている
- gcTime のデフォルト値が 5 分なので、おそらくデフォルト値の gcTime を設定したことになっている
- 引数 gcTime を省略しても、既存の gcTime を尊重するというわけではないらしい

```ts
// DataViewer.vue の useQuery
staleTime: Infinity,
gcTime: 0,
```

さらに gcTime を明示的に 0 として DataViewer 自身が gcTime に関わらないようにした
- 追加した単一の useQuery の gcTime が経過するとちょうどデータが消えるようになった
- ところが、その gcTime が経過する前にデータの非表示・再表示を繰り返してもデータが消えない
- DataViewer が gcTime を 0 で上書きしているわけではない（！）

```md
1. gcTime が 10s の Observer A を追加
2. gcTime が 3s の Observer B を追加
```

- gcTime は 3s で上書きされず 10s のままの扱いで、B が消えてからちょうど 10s 後にデータが消えた
- gcTime はキャッシュが持続した限りにおける最大値を尊重するらしい
- ただし、一度 gc 対象になると gcTime は 0（あるいは指定のデフォルト値）にリセットされる
