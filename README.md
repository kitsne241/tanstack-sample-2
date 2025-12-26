# my-vue-template

Vue 開発のリポジトリの初期設定をテンプレート化
- Prettier, ESLint の導入と推奨される設定の整備
- npm → pnpm の乗り換え

ここから先はプロジェクトごとにどうにかする
- [Vue Router](https://router.vuejs.org/installation.html) の導入
- コンポーネントライブラリ（Vuetify, PrimeVue など）の導入
- [Tailwind CSS v4](https://tailwindcss.com/docs/installation/using-vite) の導入

### セットアップ

```sh
npm create vite@latest
npm i
npm install -D prettier eslint eslint-plugin-vue eslint-config-prettier typescript-eslint
# 後ろ 4 つは全て eslint.config.js の中で使われている
```

### pnpm の導入

npm や yarn と異なりパッケージをデバイスで単一化できるのでディスク容量の節約になる

```sh
pnpm import # 既存のロックファイルから pnpm-lock.yaml を生成
rm -rf node_modules package-lock.json  # package-lock を消す
pnpm install
```

## メモ

### `eslint-plugin-prettier` は非推奨
- Prettier を ESLint の内部で実行し、フォーマット違反を「ESLint のエラー」として出力するプラグイン
- 開発中にすぐエラーが出るし、責務の分離ができていないため非推奨
- `eslint-config-prettier` は ESLint のルールを緩めて Prettier と共存させる設定

### `globals` 関連の設定は不要
- globals は JavaScript で「未定義の変数」のエラーを ESLint で出すために必要
- TypeScript なら言語機能で「未定義の変数」のエラーを出せるので、ESLint で設定する必要がない

### `declare module '*.vue'` は書かない
- `vite-env.d.ts` に Vue の `declare module` を書いてはいけない
- 存在しない `.vue` ファイルもエラーを出さなくなってしまう
- ある程度プロジェクトが大きくなってきてからリファクタリングをするときにとても面倒
