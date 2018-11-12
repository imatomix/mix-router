# mix-router

Simple router for [mixer](https://github.com/imatomix/mixer)

デザイナーが node.js とサーバサイド周りの勉強にちまちま作ってます。
仕様は気紛れに変わります。

## Usage

ルーティングの定義

```js
const mixer = require('mixer')
const { get } = require('mix-router')

const app = new mixer()
const juice = (req, res) => res.post(200, `${req.params.fruit} juice`)
const notfound = (req, res) => res.post(404, 'Not found route')

app.mix(
  get('/mix/:fruit', juice),
  get('/*', notfound)
).listen(3000)
```

### methods
```http.METHODS``` 分あるけど、代表的なのは以下の通り。ただし、```get()``` は自動的に ```HEAD``` も受け取るようにしている。

```js
get('/route', (req, res) => {})
```
```js
post('/route', (req, res) => {})
```
```js
put('/route', (req, res) => {})
```
```js
patch('/route', (req, res) => {})
```
```js
del('/route', (req, res) => {})
```
```js
head('/route', (req, res) => {})
```
```js
options('/route', (req, res) => {})
```

### namespace

ルーティングを階層化して管理する

```js
const mixer = require('mixer')
const {namespace, get} = require('mix-router')

const app = new mixer()
const apiV1 = namespace('/api/v1')
const apiV2 = namespace('/api/v2')

const notfound = (req, res) => res.post(404, 'Not found route')

app.mix(
  apiV1(get('/', (req, res) => { res.post(200, 'API V1') })),
  apiV2(get('/', (req, res) => { res.post(200, 'API V2') })),
  ('/*', notfound)
).listen(3000)
```

## req.params

ルートティング内に```:```で始まるワードを用いた場合は、そのワードをキーとして、リクエスト時のワードを値に、 ```req.params``` に追加される。

```js
const mixer = require('mixer')
const { get } = require('mix-router')

const app = new mixer(
  get('/mix/:fruit', (req, res) => res.post(200, req.params))
)
  
app.listen(3000)

// GET: http://localhost:3000/mix/apple へのレスポンス
// {"fruit":"apple"}
```

## req.query
クエリは ```req.query``` に追加される

```js
const mixer = require('mixer')
const { get } = require('mix-router')

const app = new mixer(
  get('/mix', (req, res) => res.post(200, req.query))
)
  
app.listen(3000)

// GET: http://localhost:3000/mix?fruit=apple へのレスポンス
// {"fruit":"apple"}
```

## ToDo
勉強中
- 足りない部分を探すところから
- 冗長な箇所の改善
- テスト

## mix modules

- [mixer](https://github.com/imatomix/mixer) : サーバー処理
- [mix-static](https://github.com/imatomix/mix-static) : 静的ファイルのサーブ
- [mix-favicon](https://github.com/imatomix/mix-favicon) : faviconのサーブ
- mix-cors : cors処理（作ろうかな）
- mix-csrf : csrf処理（作ろうかな）
