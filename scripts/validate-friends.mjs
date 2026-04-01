import fs from 'node:fs/promises'

const dataPath = new URL('../data/friends.json', import.meta.url)

function fail(message) {
  console.error(`\n[validate-friends] ${message}`)
  process.exit(1)
}

function isHttpsUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:'
  } catch {
    return false
  }
}

function normalizeHostname(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return ''
  }
}

async function main() {
  const raw = await fs.readFile(dataPath, 'utf8')
  let friends

  try {
    friends = JSON.parse(raw)
  } catch {
    fail('`data/friends.json` 不是合法 JSON。')
  }

  if (!Array.isArray(friends)) {
    fail('`data/friends.json` 必须是数组。')
  }

  const idSet = new Set()
  const hostSet = new Set()

  for (let i = 0; i < friends.length; i += 1) {
    const item = friends[i]
    const label = `第 ${i + 1} 条`

    if (!item || typeof item !== 'object') {
      fail(`${label} 不是对象。`)
    }

    if (!item.id || typeof item.id !== 'string') {
      fail(`${label} 缺少字符串字段 \`id\`。`)
    }

    if (idSet.has(item.id)) {
      fail(`${label} 的 \`id\` 重复：${item.id}`)
    }
    idSet.add(item.id)

    if (!item.name || typeof item.name !== 'string') {
      fail(`${label} 缺少字符串字段 \`name\`。`)
    }

    if (!item.url || typeof item.url !== 'string' || !isHttpsUrl(item.url)) {
      fail(`${label} 的 \`url\` 必须是合法 https 链接。`)
    }

    if (!item.avatar || typeof item.avatar !== 'string' || !isHttpsUrl(item.avatar)) {
      fail(`${label} 的 \`avatar\` 必须是合法 https 链接。`)
    }

    if (!item.createdAt || typeof item.createdAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(item.createdAt)) {
      fail(`${label} 的 \`createdAt\` 必须符合 YYYY-MM-DD。`)
    }

    const host = normalizeHostname(item.url)
    if (!host) {
      fail(`${label} 的 \`url\` 无法解析域名。`)
    }
    if (hostSet.has(host)) {
      fail(`${label} 的域名重复：${host}`)
    }
    hostSet.add(host)
  }

  console.log(`[validate-friends] 校验通过，共 ${friends.length} 条。`)
}

main().catch((error) => {
  fail(`执行失败：${error.message}`)
})
