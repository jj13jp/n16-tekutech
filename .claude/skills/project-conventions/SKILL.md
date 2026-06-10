---
name: project-conventions
description: このプロジェクト（n16-tekutech）のアーキテクチャルール・Next.js 16 固有の制約・microCMS パターン・コードスタイルを参照する。コードを書く前に必ず確認すること。
user-invocable: false
---

# プロジェクト規約

## Next.js 16 の注意

このプロジェクトの Next.js はトレーニングデータと異なる可能性がある非標準バージョン。
実装前に `node_modules/next/dist/docs/` を確認し、AGENTS.md の警告に従うこと。

## アーキテクチャ（Feature-based）

```
src/
├── app/                        # ルーティングのみ。データ取得・型・UIは features から import
│   ├── layout.tsx              # ルートレイアウト・共通 OGP/SEO
│   ├── error.tsx               # API エラー時のフォールバック
│   ├── page.tsx                # 記事一覧（トップ）
│   ├── articles/[id]/page.tsx  # 記事詳細
│   ├── categories/[id]/page.tsx
│   ├── tags/[id]/page.tsx
│   └── search/page.tsx
├── features/
│   ├── articles/
│   │   ├── api.ts              # 記事取得（検索・カテゴリ/タグ絞り込みも含めここに集約）
│   │   ├── types.ts            # Article 型（Category / Tag 型を参照）
│   │   └── components/ArticleCard.tsx
│   ├── categories/
│   │   ├── api.ts
│   │   └── types.ts            # Category 型
│   ├── tags/
│   │   ├── api.ts
│   │   └── types.ts            # Tag 型
│   └── search/
│       └── components/SearchForm.tsx  # Client Component（唯一）
└── shared/
    ├── components/Pagination.tsx
    └── lib/
        ├── microcms.ts         # microCMS クライアント本体・PER_PAGE（= 10）をここに集約
        └── sanitize.ts         # HTML サニタイズ（sanitize-html）
```

**配置ルール**
- `app/` にはルーティングとページの組み立てのみ。ロジックは `features/` に置く
- 新しい機能を追加する場合は `features/<name>/api.ts`・`types.ts`・`components/` の3点セットで追加
- 機能をまたぐ共通部品は `shared/` に置く

## コンポーネント種別

- ほぼすべてが **Server Component**
- **Client Component は `SearchForm` のみ**（`"use client"` 付き）
- 新たに Client Component が必要な場合は明示的な理由が必要

## レンダリング戦略（ISR）

| 対象 | revalidate |
|------|-----------|
| 記事一覧・詳細（`/`、`/articles/[id]`） | 60 秒 |
| カテゴリ・タグ一覧 | 3600 秒 |
| 検索結果（`/search`） | なし（Dynamic） |

各ページで `export const revalidate = <秒数>` を設定する。

## microCMS の制約

- `MICROCMS_SERVICE_DOMAIN` はサブドメインのみ（`xxxx` のみ。`xxxx.microcms.io` のフル URL は不可）
- `MICROCMS_API_KEY` はサーバーサイド専用。クライアントに渡さない
- クライアントインスタンスは `shared/lib/microcms.ts` に集約。各 `api.ts` はここから import

## HTML サニタイズ

- microCMS リッチエディタの出力は必ず `sanitize-html`（`shared/lib/sanitize.ts`）を通す
- サニタイズ済みの文字列のみ `dangerouslySetInnerHTML` に渡す

## SEO / OGP

- `layout.tsx` でサイト共通テンプレート（`%s | Tech まとめブログ`）を設定済み
- 各ページで `generateMetadata` を使い個別のタイトル・説明・OGP を設定する

## コードスタイル（Biome）

- フォーマッタ: **Biome**（Prettier ではない）
- リンタ: **Biome**（ESLint ではない）
- セミコロン: **なし**（`asNeeded`）
- インデント: **タブ**（幅 2）
- import パスエイリアス: `@/*`（= `./src/*`）

## import 規約

```typescript
// パスエイリアスを使う
import { getArticles } from "@/features/articles/api"
import { Pagination } from "@/shared/components/Pagination"

// 相対パスは使わない
// import { getArticles } from "../../features/articles/api"  // NG
```
