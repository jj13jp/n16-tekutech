---
name: new-feature
description: 新しい feature モジュールの雛形（types.ts / api.ts / components/）を生成する。引数にフィーチャー名を指定する（例: /new-feature comments）。
---

# new-feature スキル

## 使い方

```
/new-feature <feature-name>
```

例: `/new-feature comments`

## 生成するファイル

`src/features/<feature-name>/` 以下に以下の3点を作成する。

### 1. `types.ts`

```typescript
import type { MicroCMSListContent } from "microcms-js-sdk"

export type <FeatureName> = MicroCMSListContent & {
  // TODO: microCMS のフィールドに合わせて追加
  name: string
}
```

### 2. `api.ts`

```typescript
import { client } from "@/shared/lib/microcms"
import type { <FeatureName> } from "./<feature-name>/types"

export const get<FeatureName>List = async () => {
  return client.getList<<FeatureName>>({
    endpoint: "<feature-name>",
  })
}
```

### 3. `components/<FeatureName>Card.tsx`（必要な場合のみ）

```typescript
import type { <FeatureName> } from "../types"

type Props = {
  <featureName>: <FeatureName>
}

export const <FeatureName>Card = ({ <featureName> }: Props) => {
  return (
    <article>
      {/* TODO: UI を実装 */}
    </article>
  )
}
```

## 注意事項

- 型名・関数名・ファイル名はフィーチャー名から自動的にキャメルケース／パスカルケースに変換する
- microCMS のエンドポイント名はフィーチャー名と一致させる
- `components/` フォルダはカードやリスト表示が必要な場合のみ作成する
- 作成後、`project-conventions` スキルの配置ルールに従っているか確認する
