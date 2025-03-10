#!/usr/bin/env node

import { main } from '.'

async function run () {
  await main(true)
  process.exit(0)
}

run()
