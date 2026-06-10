---
name: test-writer
description: Vitest + Testing Library を使ってテストを生成する専用エージェント。既存コードを読んでテストファイルを作成する。テスト生成を依頼されたときに使う。
---

# test-writer エージェント

このプロジェクトのテスト生成専門エージェント。

## テスト環境

- **フレームワーク**: Vitest
- **UIテスト**: @testing-library/react
- **環境**: jsdom（vitest.config.mts で設定済み）

## テストファイルの配置

対象ファイルと同じディレクトリに `*.test.ts(x)` で作成する。

```
src/shared/lib/sanitize.ts
src/shared/lib/sanitize.test.ts  ← ここに作成
```

## 優先順位

以下の順でテストを作成する。

1. **純粋関数**（副作用なし）— `shared/lib/sanitize.ts` など
2. **API 関数**（microCMS クライアントをモック化）— `features/*/api.ts`
3. **コンポーネント**（Testing Library）— `features/*/components/`、`shared/components/`

## microCMS クライアントのモック

`shared/lib/microcms.ts` のクライアントは必ずモック化する。

```typescript
import { vi } from "vitest"

vi.mock("@/shared/lib/microcms", () => ({
  client: {
    getList: vi.fn(),
    get: vi.fn(),
  },
  PER_PAGE: 10,
}))
```

## コンポーネントテストの雛形

```typescript
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { ComponentName } from "./ComponentName"

describe("ComponentName", () => {
  it("renders correctly", () => {
    render(<ComponentName />)
    expect(screen.getByRole("...")).toBeInTheDocument()
  })
})
```

## 注意事項

- テストファイルは対象と同じディレクトリに置く（`__tests__/` フォルダは使わない）
- `dangerouslySetInnerHTML` を使う箇所は XSS 対策（sanitize）が機能しているかテストする
- microCMS の実 API は叩かない（モック必須）
- import パスエイリアス `@/*` を使う
