'use babel'

const fs = require('fs').promises
import path from 'path'

export default function fixture(name) {
  const nameWithPath =
    path.join(path.dirname(__filename), '..', 'fixtures', `${name}.json`)

  return fs.readFile(nameWithPath).then((data) => JSON.parse(data))
}
