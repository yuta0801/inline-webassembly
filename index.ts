import wabt from 'wabt'

const Wabt = await wabt()

const filename = 'module.wast'

async function wasm<K extends string, V extends WebAssembly.ExportValue>([
  source,
]: TemplateStringsArray) {
  const module = Wabt.parseWat(filename, source)
  const { buffer } = module.toBinary({})
  const { instance } = await WebAssembly.instantiate(buffer)
  return instance.exports as Record<K, V>
}

const { fact } = await wasm<'fact', (n: number) => number>`
  (module
    (func $fact (param $n i32) (result i32)
      get_local $n
      (if (result i32) (i32.eqz)
        (then
          i32.const 1)
        (else
          get_local $n
          i32.const 1
          i32.sub
          call $fact
          get_local $n
          i32.mul)
        ))
    (export "fact" (func $fact)))
`

console.log(fact(10))
